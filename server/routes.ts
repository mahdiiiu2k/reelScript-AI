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
            price_data: {
              currency: "usd",
              product_data: { name: "Premium Subscription - Reel Script AI" },
              unit_amount: 500, // $5.00 in cents
              recurring: { interval: "month" },
            },
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
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            {
              role: 'system',
              content: 'You are a professional Instagram Reel scriptwriter. Generate a high-quality, time-stamped script based on the user\'s selected options. The script should contain the exact words the creator will say in the reel. Follow the exact format provided in the prompt structure.'
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
    let prompt = `You are a professional Instagram Reel scriptwriter. Generate a high-quality, time-stamped script based on the user's selected options. The script should contain the exact words the creator will say in the reel.

Use the following structure:

---

🎬 Reel Title (optional): ${formData.title || 'N/A'}
📝 Reel Description / Topic: ${formData.description}`;

    // Length
    if (formData.length && formData.length !== 'ai-choose') {
      if (formData.length === 'custom' && formData.customLength) {
        prompt += `\n⏱️ Length: ${formData.customLength}`;
      } else {
        prompt += `\n⏱️ Length: ${formData.length}`;
      }
    } else {
      prompt += `\n⏱️ Length: AI will choose optimal length`;
    }

    // Language
    const language = formData.language === 'custom' ? formData.customLanguage : formData.language;
    if (language && language !== 'English') {
      prompt += `\n🌐 Language / Dialect: ${language}`;
    } else {
      prompt += `\n🌐 Language / Dialect: English`;
    }

    // Tone
    if (formData.isAIChosenTone) {
      prompt += `\n🎭 Tone: AI will choose optimal tone`;
    } else if (formData.tones && formData.tones.length > 0) {
      const toneList = formData.tones.includes('custom') && formData.customTone 
        ? [...formData.tones.filter((t: string) => t !== 'custom'), formData.customTone]
        : formData.tones;
      prompt += `\n🎭 Tone: ${toneList.join(', ')}`;
    }

    // Structure
    const structure = formData.structure === 'custom' ? formData.customStructure : formData.structure;
    if (structure && structure !== 'ai-choose') {
      prompt += `\n📋 Structure: ${structure}`;
    } else {
      prompt += `\n📋 Structure: AI will choose optimal structure`;
    }

    // Hook
    const hook = formData.hook === 'custom' ? formData.customHook : formData.hook;
    if (hook && hook !== 'ai-choose') {
      prompt += `\n🎣 Hook Style: ${hook}`;
    } else {
      prompt += `\n🎣 Hook Style: AI will choose optimal hook`;
    }

    // CTA
    const cta = formData.cta === 'custom' ? formData.customCta : formData.cta;
    if (cta && cta !== 'ai-choose') {
      prompt += `\n📢 Call-to-Action: ${cta}`;
    } else {
      prompt += `\n📢 Call-to-Action: AI will choose optimal CTA`;
    }

    // Goal
    const goal = formData.goal === 'custom' ? formData.customGoal : formData.goal;
    if (goal && goal !== 'ai-choose') {
      prompt += `\n🎯 Goal: ${goal}`;
    } else {
      prompt += `\n🎯 Goal: AI will choose optimal goal`;
    }

    // Target Audience
    const audience = formData.targetAudience === 'custom' ? formData.customAudience : formData.targetAudience;
    if (audience && audience !== 'ai-choose') {
      prompt += `\n👥 Target Audience: ${audience}`;
      if (formData.audienceAge && formData.audienceAge !== 'all-ages') {
        prompt += ` (${formData.audienceAge})`;
      }
    } else {
      prompt += `\n👥 Target Audience: AI will choose optimal audience`;
    }

    // Previous Scripts
    if (formData.previousScripts && formData.previousScripts.length > 0) {
      prompt += `\n\n📚 Previous Scripts (for reference, create something different):\n${formData.previousScripts.map((script: string, index: number) => `${index + 1}. ${script.substring(0, 200)}...`).join('\n')}`;
    }

    prompt += `\n\n---

Please generate a professional Instagram Reel script following these guidelines:

1. Start with a compelling hook in the first 3 seconds
2. Include time stamps (e.g., [0:00-0:03])
3. Keep the language conversational and engaging
4. Include visual cues where appropriate (e.g., [Show example on screen])
5. End with a strong call-to-action
6. Make sure the script flows naturally and sounds authentic
7. Keep the total length appropriate for Instagram Reels (15-90 seconds)

Format the script clearly with timestamps and include any relevant visual directions in brackets.`;

    return prompt;
  };

  const httpServer = createServer(app);
  return httpServer;
}
