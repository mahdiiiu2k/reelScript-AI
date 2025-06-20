# Overview

This is a full-stack web application called "Script Expert" that generates viral Instagram Reel scripts using AI. The application features a React frontend with TypeScript, a Node.js/Express backend, PostgreSQL database with Drizzle ORM, and Google OAuth authentication with Stripe subscription management.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark/light theme support
- **State Management**: React Context for theme and authentication state, TanStack Query for server state
- **Routing**: React Router DOM for client-side navigation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast bundling

## Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless with connection pooling
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migrations**: Drizzle Kit for schema migrations
- **Storage Strategy**: Memory storage implementation with interface abstraction for easy database swapping

# Key Components

## Authentication System
- **Provider**: Supabase Auth with Google OAuth integration  
- **Session Management**: JWT tokens with automatic refresh
- **User Context**: React Context provider for authentication state across the app

## Subscription Management
- **Payment Provider**: Stripe for subscription processing
- **Billing Model**: $5/month recurring subscription for premium features
- **Integration**: Supabase Edge Functions for secure webhook handling and customer portal access

## AI Script Generation
- **AI Provider**: OpenRouter API using DeepSeek V3 model
- **Service Architecture**: Dedicated script generation service with advanced viral script prompting
- **User Input**: Comprehensive form with customizable script parameters (tone, length, audience, etc.)
- **Script Format**: Single paragraph viral script output using Callaway's 3-step hook formula

## UI/UX Design
- **Design System**: Consistent component library with shadcn/ui
- **Theme System**: Dynamic light/dark mode with system preference detection
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **User Feedback**: Toast notifications and loading states for better UX

# Data Flow

1. **User Authentication**: Users sign in via Google OAuth through Supabase
2. **Form Submission**: Script generation form collects user preferences and requirements
3. **AI Processing**: Form data is sent to OpenRouter API with structured prompts
4. **Result Display**: Generated scripts are formatted and displayed with copy functionality
5. **Subscription Flow**: Premium users can access advanced features through Stripe checkout
6. **Database Persistence**: User data and subscription status stored in PostgreSQL

# External Dependencies

## Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Supabase**: Authentication, edge functions, and real-time features
- **Replit**: Development environment and deployment platform

## Third-Party Services  
- **Stripe**: Payment processing and subscription management
- **OpenRouter**: AI model access (DeepSeek R1) for script generation
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

## Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety and enhanced developer experience
- **Drizzle**: Type-safe database ORM and query builder

# Deployment Strategy

The application is configured for deployment on Replit with the following setup:

## Build Process
- **Development**: `npm run dev` runs the full-stack application with hot reloading
- **Production Build**: `npm run build` creates optimized client and server bundles
- **Database**: `npm run db:push` applies schema changes to PostgreSQL

## Environment Configuration
- **Port Configuration**: Server runs on port 5000 with external port 80
- **Database**: Automatic PostgreSQL provisioning through Replit
- **Environment Variables**: Configured for Stripe keys, Supabase credentials, and API keys

## Deployment Target
- **Platform**: Replit with autoscale deployment
- **Static Assets**: Client build output served from `/dist/public`
- **API Routes**: Express server handles all `/api/*` routes
- **Database Migrations**: Automated through Drizzle Kit

# Changelog

```
Changelog:
- June 20, 2025. Complete rebranding to "Script Expert"
  - Updated AI model from DeepSeek R1 to DeepSeek V3 for improved script generation
  - Implemented advanced viral script prompt using Callaway's 3-step hook formula
  - Rebranded application from "Reel Script AI" to "Script Expert"
  - Created custom feather logo design matching brand identity
  - Updated color scheme to sky/cyan gradients throughout UI
  - Added Stripe price ID (price_1Rc7AvEHEdRuv5DaPBQ7xjC2) for $5/month subscription
  - Enhanced subscription button text: "Subscribe Now" when authenticated, "Sign In" when not
  - Updated page title and meta description for SEO optimization
  - Confirmed mobile-first layout with subscription card above form
- June 19, 2025. Successfully migrated from Lovable to Replit
  - Replaced Supabase with PostgreSQL/Drizzle ORM
  - Implemented server-side Google OAuth authentication
  - Added secure session management with HTTP-only cookies
  - Migrated Stripe subscription handling to server routes
  - Moved OpenRouter AI integration to secure server-side API
  - Updated UI layout for mobile-first subscription card placement
  - Enhanced authentication modal with email/password options
  - Removed all Supabase dependencies for improved security
- June 18, 2025. Initial setup
```

# User Preferences

```
Preferred communication style: Simple, everyday language.
```