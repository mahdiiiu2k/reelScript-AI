import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import cookieParser from "cookie-parser";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

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

  // Create session endpoint for client-side auth
  app.post('/api/auth/session', async (req, res) => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return res.status(400).json({ error: 'Supabase not configured' });
      }

      const { access_token, refresh_token, user } = req.body;
      
      if (!access_token || !refresh_token || !user) {
        return res.status(400).json({ error: 'Missing required auth data' });
      }

      console.log('Creating session for user:', user.email);

      // Create or update user in our database
      let dbUser = await storage.getUserByGoogleId(user.id);
      if (!dbUser) {
        dbUser = await storage.createUser({
          email: user.email,
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

  // Subscription management
  app.post('/api/create-checkout-session', requireAuth, async (req: any, res) => {
    try {
      // This would integrate with Stripe in production
      res.json({ 
        url: "https://checkout.stripe.com/pay/example",
        message: "Stripe integration not implemented yet" 
      });
    } catch (error) {
      console.error('Checkout session error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
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