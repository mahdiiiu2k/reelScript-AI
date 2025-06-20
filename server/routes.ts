import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import cookieParser from "cookie-parser";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/auth/google/callback`
  );

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

  // Auth routes
  app.get('/api/auth/google', (req, res) => {
    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      state: nanoid(),
    });
    res.redirect(authUrl);
  });

  app.get('/api/auth/google/callback', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.redirect('/?error=auth_failed');
      }

      const { tokens } = await googleClient.getToken(code as string);
      googleClient.setCredentials(tokens);

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.redirect('/?error=auth_failed');
      }

      let user = await storage.getUserByGoogleId(payload.sub);
      if (!user) {
        user = await storage.createUser({
          email: payload.email!,
          google_id: payload.sub,
          name: payload.name || null,
          avatar_url: payload.picture || null,
        });
      }

      // Create session
      const sessionId = nanoid();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await storage.createSession({
        id: sessionId,
        user_id: user.id,
        expires_at: expiresAt,
      });

      res.cookie('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
      });

      res.redirect('/');
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect('/?error=auth_failed');
    }
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
      }
    });
  });

  // Subscription routes
  app.post('/api/subscription/create-checkout', requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const customers = await stripe.customers.list({ email: req.user.email, limit: 1 });
      let customerId;
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : req.user.email,
        line_items: [
          {
            price: "price_1Rc7AvEHEdRuv5DaPBQ7xjC2",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin || 'http://localhost:5000'}/?success=true`,
        cancel_url: `${req.headers.origin || 'http://localhost:5000'}/?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post('/api/subscription/customer-portal', requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const customers = await stripe.customers.list({ email: req.user.email, limit: 1 });
      if (customers.data.length === 0) {
        return res.status(404).json({ error: "No Stripe customer found" });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customers.data[0].id,
        return_url: `${req.headers.origin || 'http://localhost:5000'}/`,
      });

      res.json({ url: portalSession.url });
    } catch (error) {
      console.error('Customer portal error:', error);
      res.status(500).json({ error: "Failed to create customer portal session" });
    }
  });

  app.post('/api/subscription/check', requireAuth, async (req: any, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.json({ subscribed: false });
      }

      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const customers = await stripe.customers.list({ email: req.user.email, limit: 1 });
      
      if (customers.data.length === 0) {
        await storage.createOrUpdateSubscription({
          user_id: req.user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
        });
        return res.json({ subscribed: false });
      }

      const customerId = customers.data[0].id;
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      const hasActiveSub = subscriptions.data.length > 0;
      let subscriptionEnd = null;

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000);
      }

      await storage.createOrUpdateSubscription({
        user_id: req.user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: hasActiveSub ? "Premium" : null,
        subscription_end: subscriptionEnd,
      });

      res.json({
        subscribed: hasActiveSub,
        subscription_tier: hasActiveSub ? "Premium" : null,
        subscription_end: subscriptionEnd,
      });
    } catch (error) {
      console.error('Check subscription error:', error);
      res.status(500).json({ error: "Failed to check subscription" });
    }
  });

  // Script generation route
  app.post('/api/generate-script', requireAuth, async (req: any, res) => {
    try {
      const subscription = await storage.getSubscription(req.user.id);
      
      // Check if user has premium access or implement rate limiting for free users
      if (!subscription?.subscribed) {
        // You can implement daily limits here for free users
        // For now, we'll allow generation but with basic features
      }

      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({ error: "AI service not configured. Please provide OpenRouter API key." });
      }

      const formData = req.body;
      const prompt = buildPrompt(formData);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000',
          'X-Title': 'Reel Script AI'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v3:free',
          messages: [
            {
              role: 'system',
              content: 'You are an elite short-form video scriptwriter. Your job is to write a compelling spoken script (what the creator says) that makes a reel go viral using the best storytelling and hook psychology available. Output just the final script paragraph. No explanations, no headings, no labels, no formatting. Use commas and periods where appropriate. The paragraph should feel natural, rhythmic, personal, and visually supported.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API');
      }

      res.json({ script: data.choices[0].message.content });
    } catch (error) {
      console.error('Script generation error:', error);
      res.status(500).json({ error: "Failed to generate script" });
    }
  });

  // Helper function to build prompt
  const buildPrompt = (formData: any): string => {
    let prompt = `You are an elite short-form video scriptwriter. Your job is to write a compelling spoken script (what the creator says) that makes a reel go viral using the best storytelling and hook psychology available.

Your output should be:

A single paragraph (natural for a creator to speak)

No headings, no labels, no formatting

Use commas and periods where appropriate

The paragraph should feel natural, rhythmic, personal, and visually supported

Follow this structure and logic in your writing:

Use Callaway's 3-step hook formula at the start:

Context Lean: Be ultra-clear about the topic and create immediate interest by referencing a benefit, pain point, mind-blowing stat, or metaphor

Scroll-Stop Interjection: Use a word like "but", "yet", or "however" to deliver a surprising contrast

Contrarian Snapback: Flip expectations in a direction that opens a curiosity loop and teases deeper insight

Build the rest of the script using:

The Dance (alternating conflict and context beats)

Rhythm (sentence variety: short, medium, long, staccato when needed)

Conversational Tone (as if the creator is talking to one close friend)

Clear Direction (start with the end in mind, loop final line to intro if possible)

Unique Story Lens (an unexpected or niche perspective that makes the take feel fresh)

CTA (naturally integrate this toward the end if provided)

Assume a strong visual hook will be shown on-screen during the first 2 seconds. Do not mention visuals in the script — just write the spoken part.

Output just the final script paragraph. No explanations.

🔽 USER INPUT VARIABLES:

Reel Description: ${formData.description}

Reel Title (Optional): ${formData.title || 'N/A'}

Reel Length: ${formData.length && formData.length !== 'ai-choose' ? 
  (formData.length === 'custom' && formData.customLength ? formData.customLength : formData.length) : 
  'AI will choose optimal length'}

Language / Dialect: ${formData.language === 'custom' ? formData.customLanguage : (formData.language || 'English')}

Tone (Multiple Selection): ${formData.isAIChosenTone ? 'AI will choose optimal tone' : 
  (formData.tones && formData.tones.length > 0 ? 
    (formData.tones.includes('custom') && formData.customTone ? 
      [...formData.tones.filter((t: string) => t !== 'custom'), formData.customTone].join(', ') : 
      formData.tones.join(', ')) : 
    'Not specified')}

Script Structure: ${formData.structure === 'custom' ? formData.customStructure : 
  (formData.structure && formData.structure !== 'ai-choose' ? formData.structure : 'AI will choose optimal structure')}

Hook: ${formData.hook === 'custom' ? formData.customHook : 
  (formData.hook && formData.hook !== 'ai-choose' ? formData.hook : 'AI will choose optimal hook')}

Previous Reel Scripts (Optional): ${formData.previousScripts && formData.previousScripts.length > 0 ? 
  formData.previousScripts.map((script: string, index: number) => `${index + 1}. ${script.substring(0, 200)}...`).join('\n') : 
  'None provided'}

Reel Goal: ${formData.goal === 'custom' ? formData.customGoal : 
  (formData.goal && formData.goal !== 'ai-choose' ? formData.goal : 'AI will choose optimal goal')}

Target Audience: ${formData.targetAudience === 'custom' ? formData.customAudience : 
  (formData.targetAudience && formData.targetAudience !== 'ai-choose' ? formData.targetAudience : 'AI will choose optimal audience')}

Call to Action (CTA): ${formData.cta === 'custom' ? formData.customCta : 
  (formData.cta && formData.cta !== 'ai-choose' ? formData.cta : 'AI will choose optimal CTA')}

Audience Age (Optional): ${formData.audienceAge && formData.audienceAge !== 'all-ages' ? formData.audienceAge : 'Not specified'}`;

    return prompt;
  };

  const httpServer = createServer(app);
  return httpServer;
}
