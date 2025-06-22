# Deployment Guide for Script Generator App

## Required Environment Variables for Production

### Supabase Configuration (Recommended)
1. **SUPABASE_URL** - Your Supabase project URL
2. **SUPABASE_KEY** - Your Supabase anon/public key
3. **DATABASE_URL** - Your Supabase PostgreSQL connection string

### Google OAuth Configuration (Alternative)
1. **GOOGLE_CLIENT_ID** - Your Google OAuth client ID
2. **GOOGLE_CLIENT_SECRET** - Your Google OAuth client secret
3. **GOOGLE_CALLBACK_URL** - Your production callback URL (e.g., `https://your-app.onrender.com/api/auth/callback`)

### Optional Services
- **STRIPE_SECRET_KEY** - For subscription payments
- **OPENROUTER_API_KEY** - For AI script generation

### Environment Detection
- **NODE_ENV** - Set to `production`
- **RENDER_EXTERNAL_URL** - Automatically provided by Render

## Supabase Setup (Recommended)

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for database to be ready
4. Go to Settings → API to get your keys

### 2. Enable Google Auth in Supabase
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID: Your Google OAuth client ID
   - Client Secret: Your Google OAuth client secret
4. Set redirect URL: `https://your-app.onrender.com/api/auth/callback`

### 3. Get Database URL
1. Go to Settings → Database
2. Copy the connection string under "Connection pooling" 
3. Replace `[YOUR-PASSWORD]` with your database password
4. **Important**: If your password contains special characters (like `?`, `@`, `#`), they must be URL-encoded:
   - `?` becomes `%3F`
   - `@` becomes `%40` 
   - `#` becomes `%23`
   - Use an online URL encoder or the app will auto-encode common characters

## Alternative: Google OAuth Setup

### 1. Create Google OAuth Application
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - For development: `http://localhost:5000/api/auth/callback`
   - For production: `https://your-app.onrender.com/api/auth/callback`

### 2. Configure Environment Variables

**For Supabase (Recommended):**
```
SUPABASE_URL=https://nvthjpjveqeuscyixwqg.supabase.co
SUPABASE_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.nvthjpjveqeuscyixwqg.supabase.co:5432/postgres
NODE_ENV=production
```

**Important**: Replace `YOUR_PASSWORD` with your actual Supabase database password. Never commit real passwords to version control.

**For Custom Google OAuth (Alternative):**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/callback
NODE_ENV=production
```

## Common Issues and Solutions

### 1. "redirect_uri_mismatch" Error
This is the most common issue. The callback URL must match exactly:

**In Google Cloud Console:**
- Authorized redirect URIs: `https://your-app-name.onrender.com/api/auth/google/callback`

**In Render Environment Variables:**
- GOOGLE_CALLBACK_URL: `https://your-app-name.onrender.com/api/auth/google/callback`

**Common mistakes:**
- Using `http://` instead of `https://` in production
- Wrong app name in the URL
- Missing or extra slashes
- Different domain than what Render assigned

### 2. Cookie Issues in Production
- Cookies are configured for cross-site compatibility in production
- HTTPS is required for secure cookies

### 3. CORS Issues
- The app is configured to handle CORS automatically
- Ensure your domain is properly configured

## Testing Deployment

1. Deploy to Render with all environment variables
2. Visit your app URL
3. Try Google sign-in
4. Check browser developer tools for any console errors
5. Verify authentication works by checking /api/auth/me endpoint

## Troubleshooting

### Check Logs
- View Render logs for server-side errors
- Check browser console for client-side issues

### Verify Configuration
- Ensure all required environment variables are set
- Confirm Google OAuth callback URL matches exactly
- Test database connection

### Common Error Messages
- "Not authenticated" - Session/cookie issues
- "oauth_config_error" - Missing Google OAuth credentials
- "auth_failed" - Google OAuth flow failed