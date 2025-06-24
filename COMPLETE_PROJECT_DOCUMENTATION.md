# Script Expert - Complete Technical Documentation

## Project Overview
Script Expert is a full-stack web application that generates viral Instagram Reel scripts using AI. Users must authenticate with Google OAuth and subscribe ($5/month) to unlock the script generation features.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **UI Library**: shadcn/ui components (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Dark/light mode support with system preference detection
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React Context for auth/theme, TanStack Query for server state
- **Icons**: Lucide React for UI icons

### Backend
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for fast bundling

### Database & Storage
- **Database**: PostgreSQL (Neon serverless in production)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migrations**: Drizzle Kit for schema management

### Authentication & Payments
- **Auth Provider**: Supabase Auth with Google OAuth
- **Session Management**: HTTP-only cookies with secure session storage
- **Payment Processing**: Stripe checkout and webhooks
- **Subscription Model**: $5/month recurring subscription

### External APIs
- **AI Provider**: OpenRouter API using DeepSeek V3 model
- **Script Generation**: Advanced prompting with Callaway's 3-step hook formula

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui base components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ScriptForm.tsx
│   │   │   ├── ScriptResult.tsx
│   │   │   ├── SubscriptionCard.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── main.tsx        # App entry point
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and auth logic
│   ├── storage.ts         # Database abstraction layer
│   ├── db.ts              # Database connection
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
├── lib/                   # Shared utilities
└── package.json           # Dependencies and scripts
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscribed BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50),
  subscription_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Authentication Flow

### 1. Google OAuth Setup
- Supabase project with Google OAuth provider configured
- Google Cloud Console project with OAuth 2.0 credentials
- Callback URL: `https://[supabase-url]/auth/v1/callback`
- Redirect URL: `https://[your-domain]/api/auth/callback`

### 2. Authentication Endpoints
```typescript
// Google OAuth initiation
GET /api/auth/google
// OAuth callback handler
GET /api/auth/callback
// Session creation
POST /api/auth/session
// Current user info
GET /api/auth/me
// Logout
POST /api/auth/logout
```

### 3. Session Management
- Sessions stored in database with expiration
- HTTP-only cookies for security
- Automatic session cleanup for expired sessions

## Stripe Integration

### 1. Subscription Setup
- Product: Script Expert Premium
- Price: $5/month recurring (price_1Rc7AvEHEdRuv5DaPBQ7xjC2)
- Mode: Subscription with card payments

### 2. Stripe Endpoints
```typescript
// Create checkout session
POST /api/subscription/create-checkout
// Customer portal access
POST /api/subscription/customer-portal
// Subscription status check
POST /api/subscription/check
// Webhook handler
POST /api/webhook/stripe
```

### 3. Webhook Events
- `checkout.session.completed`: Activate subscription
- `customer.subscription.deleted`: Deactivate subscription

## AI Script Generation

### 1. OpenRouter Configuration
- Model: DeepSeek V3
- Advanced prompting system with viral script templates
- Callaway's 3-step hook formula implementation

### 2. Script Parameters
- Title and description
- Video length (30s, 60s, 90s, custom)
- Language selection with custom option
- Tone selection (multiple tones, AI-chosen option)
- Script structure templates
- Hook styles and CTA options
- Target audience and age demographics

### 3. Generation Process
```typescript
POST /api/generate-script
// Requires authentication and active subscription
// Returns formatted single-paragraph viral script
```

## Frontend Components

### 1. Core Components
- **Header**: Logo, theme toggle, user menu
- **AuthModal**: Google OAuth sign-in interface
- **SubscriptionCard**: Stripe checkout integration
- **ScriptForm**: Comprehensive input form (locked until subscribed)
- **ScriptResult**: Generated script display with copy functionality
- **UserMenu**: Profile dropdown with logout option

### 2. UI Components (shadcn/ui)
Complete set of accessible components including:
- Button, Input, Textarea, Select
- Dialog, Dropdown, Toast
- Card, Badge, Separator
- Form components with validation

### 3. Theme System
```typescript
// Dark/light mode with system detection
// CSS variables for consistent theming
// Tailwind CSS integration
```

## Environment Variables

### Required Secrets
```bash
# Supabase Configuration
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=eyJ...
GOOGLE_CLIENT_ID=xxxxx.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Configuration
OPENROUTER_API_KEY=sk-or-v1-...

# Database
DATABASE_URL=postgresql://[connection-string]
```

### Optional Configuration
```bash
# Development
NODE_ENV=development
REPLIT_DEV_DOMAIN=https://[repl-url]

# Production
RENDER_EXTERNAL_URL=https://[your-domain]
```

## Build Configuration

### 1. Package.json Scripts
```json
{
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

### 2. Vite Configuration
```typescript
// Frontend build with React and TypeScript
// Tailwind CSS processing
// Asset optimization
// Development server with HMR
```

### 3. esbuild Configuration
```typescript
// Backend bundling for production
// ES module format
// External packages handling
// Node.js platform targeting
```

## Deployment Instructions

### 1. Environment Setup
1. Create PostgreSQL database (Neon recommended)
2. Set up Supabase project with Google OAuth
3. Configure Stripe product and webhooks
4. Get OpenRouter API key
5. Set all environment variables

### 2. Database Migration
```bash
npm run db:push
```

### 3. Build Process
```bash
npm install --include=dev
npm run build
```

### 4. Production Start
```bash
npm run start
```

## Key Features Implementation

### 1. Authentication Gate
- All script generation features locked until authentication
- Google OAuth with Supabase integration
- Persistent sessions with secure cookies

### 2. Subscription Paywall
- Form inputs disabled until subscription active
- Stripe checkout integration with $5/month billing
- Real-time subscription status checking

### 3. AI Script Generation
- Advanced prompting system for viral content
- Multiple customization options
- Single-paragraph output format
- Copy-to-clipboard functionality

### 4. Responsive Design
- Mobile-first approach
- Dark/light theme support
- Professional UI with shadcn/ui components

## Security Considerations

### 1. Authentication Security
- HTTP-only cookies prevent XSS attacks
- Session expiration and cleanup
- CSRF protection with same-site cookies

### 2. API Security
- Authentication middleware on protected routes
- Input validation with Zod schemas
- Secure webhook signature verification

### 3. Environment Security
- Secrets stored in environment variables
- No sensitive data in client-side code
- Proper CORS configuration

## Performance Optimizations

### 1. Frontend
- React Query for efficient data fetching
- Component code splitting
- Optimized asset loading with Vite

### 2. Backend
- Database connection pooling
- Efficient session management
- Minimal API response payloads

### 3. Database
- Indexed foreign keys
- Automatic session cleanup
- Optimized query patterns

## Testing Checklist

### 1. Authentication Flow
- [ ] Google OAuth sign-in works
- [ ] Profile displays correctly after sign-in
- [ ] Sessions persist across page refreshes
- [ ] Logout clears session properly

### 2. Subscription Flow
- [ ] "Subscribe Now" button works for authenticated users
- [ ] Stripe checkout redirects correctly
- [ ] Successful payment activates subscription
- [ ] Form inputs unlock after payment
- [ ] Customer portal access works

### 3. Script Generation
- [ ] Form validation works properly
- [ ] AI script generation produces quality output
- [ ] Copy functionality works
- [ ] Previous scripts are stored/displayed

### 4. UI/UX
- [ ] Theme toggle works (dark/light)
- [ ] Mobile responsive design
- [ ] All components render correctly
- [ ] Loading states display properly

## Clone Instructions for Other Platforms

### 1. File Structure Setup
Create the exact folder structure as shown above with all files.

### 2. Dependencies Installation
Copy package.json exactly and run `npm install`

### 3. Configuration Files
- Copy all config files: vite.config.ts, tailwind.config.ts, drizzle.config.ts
- Copy tsconfig.json for TypeScript configuration
- Copy postcss.config.js for CSS processing

### 4. Environment Setup
Set up all required environment variables as listed above.

### 5. Database Setup
- Create PostgreSQL database
- Run `npm run db:push` to apply schema

### 6. External Services
- Set up Supabase project with Google OAuth
- Configure Stripe products and webhooks
- Get OpenRouter API key

### 7. Build and Deploy
Follow the build configuration and deployment instructions above.

This documentation provides everything needed to recreate Script Expert exactly on any platform that supports Node.js and PostgreSQL.