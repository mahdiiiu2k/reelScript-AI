import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import cookieParser from "cookie-parser";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  
  // Get the correct redirect URL for the application
  const getAppRedirectUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.RENDER_EXTERNAL_URL || 'https://reelscript-ai.onrender.com';
    }
    return process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000';
  };

  // Supabase callback URL (this should be registered in Google Cloud Console)
  const getSupabaseCallbackUrl = () => {
    return 'https://nvthjpjveqeuscyixwqg.supabase.co/auth/v1/callback';
  };

  // Log OAuth configuration
  console.log('OAuth Configuration:', {
    supabaseConfigured: isSupabaseConfigured,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    supabaseCallbackUrl: getSupabaseCallbackUrl(),
    appRedirectUrl: getAppRedirectUrl()
  });

  // Middleware to check authentication
  const requireAuth = async (req: any, res: any, next: any) => {
    const sessionId = req.cookies.session;
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const session = await storage.getSession(sessionId);
    if (!session || session.expires_at < new Date()) {
      if (session) await storage.deleteSession(sessionId);
      res.clearCookie('session');
      return res.status(401).json({ error: "Session expired" });
    }

    const user = await storage.getUser(session.user_id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.session = session;
    next();
  };

  // Auth config endpoint for client-side auth
  app.get('/api/auth/config', (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    });
  });

  // Auth routes
  app.get('/api/auth/google', async (req, res) => {
    try {
      // Use Supabase Auth for Google OAuth
      if (isSupabaseConfigured && supabase) {
        console.log('Initiating Supabase Google OAuth');
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${getAppRedirectUrl()}/api/auth/callback`
          }
        });
        
        if (error) {
          console.error('Supabase OAuth error:', error);
          return res.redirect('/?error=oauth_config_error');
        }
        
        console.log('Redirecting to Supabase OAuth URL:', data.url);
        return res.redirect(data.url);
      }
      
      // Fallback error if Supabase not configured
      console.error('Supabase OAuth not configured');
      return res.redirect('/?error=oauth_not_configured');
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      res.redirect('/?error=oauth_config_error');
    }
  });

  // Supabase Auth callback - serve the auth callback HTML page
  app.get('/api/auth/callback', async (req, res) => {
    // Serve the auth callback HTML page that handles client-side auth
    res.sendFile('auth-callback.html', { root: './client/public' });
  });

  // Code exchange endpoint for Supabase OAuth
  app.post('/api/auth/exchange', async (req, res) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return res.status(400).json({ error: 'Supabase not configured' });
      }

      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Authorization code required' });
      }

      console.log('Exchanging authorization code for session');

      // Exchange code for session using Supabase
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Code exchange error:', error);
        return res.status(400).json({ error: 'Code exchange failed', details: error.message });
      }

      if (!data.session || !data.user) {
        return res.status(400).json({ error: 'No session or user data received' });
      }

      console.log('Code exchange successful for user:', data.user.email);

      // Create or update user in our database
      let dbUser = await storage.getUserByGoogleId(data.user.id);
      if (!dbUser) {
        dbUser = await storage.createUser({
          email: data.user.email!,
          google_id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
        });
        console.log('Created new user:', dbUser.id);
      } else {
        console.log('Found existing user:', dbUser.id);
      }

      // Create our own session
      const sessionId = nanoid();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await storage.createSession({
        id: sessionId,
        user_id: dbUser.id,
        expires_at: expiresAt,
      });

      // Set session cookie
      res.cookie('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: expiresAt,
      });

      console.log('Session created successfully via code exchange:', sessionId);
      res.json({ success: true, user: dbUser });
    } catch (error) {
      console.error('Code exchange error:', error);
      res.status(500).json({ error: 'Code exchange failed' });
    }
  });

  // Create session endpoint for client-side auth
  app.post('/api/auth/session', async (req, res) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return res.status(400).json({ error: 'Supabase not configured' });
      }

      const { access_token, refresh_token } = req.body;
      
      if (!access_token || !refresh_token) {
        return res.status(400).json({ error: 'Missing access_token or refresh_token' });
      }

      console.log('Creating session with tokens...');

      let user;
      try {
        // Try to get user from Supabase first
        const { data: userData, error } = await supabase.auth.getUser(access_token);
        
        if (error || !userData.user) {
          console.log('Supabase getUser failed, trying manual JWT decode:', error?.message);
          
          // Fallback: decode JWT manually
          const tokenParts = access_token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT format');
          }
          
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          console.log('Decoded JWT payload for user:', payload.email);
          
          user = {
            id: payload.sub,
            email: payload.email,
            user_metadata: payload.user_metadata || {}
          };
        } else {
          user = userData.user;
        }
      } catch (tokenError) {
        console.error('Token processing failed:', tokenError);
        return res.status(400).json({ error: 'Invalid access token' });
      }

      console.log('Retrieved user:', user.email);

      // Create or update user in our database
      let dbUser = await storage.getUserByGoogleId(user.id);
      if (!dbUser) {
        dbUser = await storage.createUser({
          email: user.email!,
          google_id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        });
        console.log('Created new user:', dbUser.id);
      } else {
        console.log('Found existing user:', dbUser.id);
      }

      // Create our own session
      const sessionId = nanoid();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await storage.createSession({
        id: sessionId,
        user_id: dbUser.id,
        expires_at: expiresAt,
      });

      // Set session cookie
      res.cookie('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: expiresAt,
      });

      console.log('Session created successfully:', sessionId);
      res.json({ success: true, user: dbUser });
    } catch (error) {
      console.error('Session creation error:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Legacy Google OAuth callback (redirects to Supabase auth)
  app.get('/api/auth/google/callback', async (req, res) => {
    console.log('Legacy Google OAuth callback accessed - redirecting to Supabase auth');
    return res.redirect('/api/auth/google');
  });

  app.post('/api/auth/logout', requireAuth, async (req: any, res) => {
    await storage.deleteSession(req.session.id);
    res.clearCookie('session');
    res.json({ success: true });
  });

  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    const subscription = await storage.getSubscription(req.user.id);
    res.json({
      user: req.user,
      subscription: {
        subscribed: subscription?.subscribed || false,
        subscription_tier: subscription?.subscription_tier || null,
        subscription_end: subscription?.subscription_end || null,
      },
    });
  });

  // Script generation endpoint
  app.post('/api/generate-script', requireAuth, async (req: any, res) => {
    try {
      const { 
        title, 
        description, 
        length, 
        customLength, 
        language, 
        customLanguage, 
        tones, 
        customTone, 
        isAIChosenTone, 
        structure, 
        customStructure, 
        hook, 
        customHook, 
        cta, 
        customCta, 
        goal, 
        customGoal, 
        targetAudience, 
        customAudience, 
        audienceAge, 
        previousScripts 
      } = req.body;

      // Check subscription for premium features
      const subscription = await storage.getSubscription(req.user.id);
      const hasActiveSubscription = subscription?.subscribed && 
        subscription.subscription_end && 
        new Date(subscription.subscription_end) > new Date();

      // Basic validation
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }

      // For now, return a placeholder response
      // In production, this would integrate with your AI service
      const script = `# ${title}

## Hook
${hook === 'custom' ? customHook : hook}

## Main Content
${description}

## Call to Action
${cta === 'custom' ? customCta : cta}

---
Generated with ${length === 'custom' ? customLength : length} length
Language: ${language === 'custom' ? customLanguage : language}
Tone: ${isAIChosenTone ? 'AI-chosen' : (tones.includes('custom') ? customTone : tones.join(', '))}
Structure: ${structure === 'custom' ? customStructure : structure}
Target Audience: ${targetAudience === 'custom' ? customAudience : targetAudience}
Age Group: ${audienceAge}
Goal: ${goal === 'custom' ? customGoal : goal}`;

      res.json({ script });
    } catch (error) {
      console.error('Script generation error:', error);
      res.status(500).json({ error: "Failed to generate script" });
    }
  });

  // Subscription management (this endpoint is not used - see the real one below)
  app.post('/api/create-checkout-session', requireAuth, async (req: any, res) => {
    try {
      res.json({ 
        url: "https://checkout.stripe.com/pay/example",
        message: "Old endpoint - not used" 
      });
    } catch (error) {
      res.status(500).json({ error: "Old endpoint error" });
    }
  });

  // Subscription management endpoints
  app.post('/api/subscription/create-checkout', requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const priceId = 'price_1Rc7AvEHEdRuv5DaPBQ7xjC2'; // $5/month price ID from replit.md

      const session = await stripe.checkout.sessions.create({
        customer_email: req.user.email,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${getAppRedirectUrl()}/?success=true`,
        cancel_url: `${getAppRedirectUrl()}/?canceled=true`,
        metadata: {
          user_id: req.user.id.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Checkout session error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post('/api/subscription/customer-portal', requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      
      // Get the user's Stripe customer ID from subscription
      const subscription = await storage.getSubscription(req.user.id);
      if (!subscription || !subscription.stripe_customer_id) {
        return res.status(400).json({ error: "No subscription found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripe_customer_id,
        return_url: getAppRedirectUrl(),
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Customer portal error:', error);
      res.status(500).json({ error: "Failed to create customer portal session" });
    }
  });

  app.post('/api/subscription/check', requireAuth, async (req: any, res) => {
    try {
      const subscription = await storage.getSubscription(req.user.id);
      res.json({
        subscribed: subscription?.subscribed || false,
        subscription_tier: subscription?.subscription_tier || null,
        subscription_end: subscription?.subscription_end || null,
      });
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({ error: "Failed to check subscription" });
    }
  });

  // Stripe webhook endpoint
  app.post('/api/webhook/stripe', (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        req.body = data;
        next();
      });
    } else {
      next();
    }
  }, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('Stripe webhook secret not configured');
        return res.status(400).send('Webhook secret not configured');
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Get user ID from metadata
        const userId = parseInt(session.metadata.user_id);
        if (userId) {
          // Create or update subscription
          await storage.createOrUpdateSubscription({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscribed: true,
            subscription_tier: 'premium',
            subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          });
          console.log('Subscription activated for user:', userId);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription canceled:', deletedSubscription.id);
        
        // Note: In a full implementation, you'd find the subscription by stripe_subscription_id
        // For now, this is a placeholder for the webhook handler
        console.log('Subscription deletion webhook received but not fully implemented');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      supabase: isSupabaseConfigured ? 'configured' : 'not configured'
    });
  });

  const server = createServer(app);
  return server;
}