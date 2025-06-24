# Script Expert - Complete Internal Functionality Guide

## Homepage Layout & Components

### Header Section
**Logo & Branding**
- **FeatherIcon**: Custom feather logo (cyan/sky blue gradient)
- **Title**: "Script Expert" text in gradient styling
- **Position**: Top-left corner of the page

**Navigation Controls**
- **Theme Toggle**: Sun/moon icon button (top-right)
  - Light mode: Sun icon
  - Dark mode: Moon icon
  - Automatically detects system preference on first visit
  - Toggles between light and dark themes instantly

**User Authentication Area** (Top-right)
- **When NOT signed in**: "Sign In" button (primary blue styling)
- **When signed in**: User profile dropdown menu
  - Shows user's Google profile picture (circular avatar)
  - Shows user's name and email
  - "Manage Subscription" button (if subscribed)
  - "Sign Out" button

### Main Content Area

#### Authentication Modal (When Sign In clicked)
**Modal Dialog** with centered layout:
- **Title**: "Welcome to Script Expert"
- **Subtitle**: "Sign in to generate viral Instagram scripts"
- **Google Sign In Button**: 
  - Red Google "G" logo + "Continue with Google"
  - Triggers Google OAuth flow through Supabase
  - Redirects to Google's consent screen
  - Returns with user profile and authentication

#### Subscription Card Section
**Card Component** (appears prominently on mobile, top-right on desktop):
- **Header**: "Ready to Create Viral Scripts?"
- **Price Display**: "$5/month" in large text
- **Feature List**:
  - ✓ Unlimited script generation
  - ✓ Advanced customization options
  - ✓ Viral hook formulas
  - ✓ Multiple language support
- **Action Button**:
  - **NOT signed in**: "Sign In" (triggers auth modal)
  - **Signed in, NOT subscribed**: "Subscribe Now" (triggers Stripe checkout)
  - **Signed in, subscribed**: "Manage Subscription" (opens Stripe customer portal)

#### Script Generation Form
**Form Container** (main content area):

**Title Input Section**:
- **Label**: "Video Title/Topic"
- **Input Field**: Text input, placeholder: "Enter your video title or main topic"
- **Validation**: Required field
- **State**: Disabled until user is subscribed

**Description Input Section**:
- **Label**: "Description (Optional)"
- **Textarea**: Multi-line text input, placeholder: "Add more details about your video content..."
- **State**: Disabled until user is subscribed

**Video Length Selection**:
- **Label**: "Video Length"
- **Dropdown Menu** with options:
  - "30 seconds"
  - "60 seconds"
  - "90 seconds"
  - "Custom length"
- **Custom Length Input**: 
  - Appears when "Custom length" selected
  - Number input with "seconds" suffix
- **State**: Disabled until user is subscribed

**Language Selection**:
- **Label**: "Language"
- **Dropdown Menu** with 20+ languages:
  - English, Spanish, French, German, Italian
  - Portuguese, Dutch, Russian, Chinese, Japanese
  - Korean, Arabic, Hindi, Turkish, Polish
  - Swedish, Norwegian, Danish, Finnish
  - Czech, Hungarian, Romanian, Bulgarian
  - "Custom language" option
- **Custom Language Input**:
  - Appears when "Custom language" selected
  - Text input for any language
- **State**: Disabled until user is subscribed

**Tone Selection**:
- **Label**: "Script Tone"
- **Multi-select Checkboxes**:
  - □ Educational/Informative
  - □ Entertaining/Fun
  - □ Motivational/Inspiring
  - □ Dramatic/Emotional
  - □ Casual/Conversational
  - □ Professional/Business
  - □ Humorous/Comedy
  - □ Mysterious/Intriguing
- **AI-Chosen Tone Option**:
  - □ "Let AI choose the best tone"
  - When checked, overrides manual selections
- **Custom Tone Input**:
  - Text input for custom tone description
- **State**: Disabled until user is subscribed

**Script Structure Selection**:
- **Label**: "Script Structure"
- **Dropdown Menu** with options:
  - "Hook + Main Content + CTA"
  - "Problem + Solution + Action"
  - "Story + Lesson + Call-to-Action"
  - "Question + Answer + Engagement"
  - "Trend + Opinion + Discussion"
  - "Tutorial/How-to Format"
  - "Custom structure"
- **Custom Structure Input**:
  - Textarea for custom structure description
- **State**: Disabled until user is subscribed

**Hook Style Selection**:
- **Label**: "Hook Style"
- **Dropdown Menu** with options:
  - "Question hook"
  - "Shocking statement"
  - "Personal story"
  - "Trend reference"
  - "Controversial opinion"
  - "Number/statistic"
  - "Challenge/dare"
  - "Custom hook"
- **Custom Hook Input**:
  - Text input for custom hook idea
- **State**: Disabled until user is subscribed

**Call-to-Action Selection**:
- **Label**: "Call-to-Action"
- **Dropdown Menu** with options:
  - "Like and follow"
  - "Comment your thoughts"
  - "Share with friends"
  - "Save for later"
  - "Try this yourself"
  - "Tag someone"
  - "Custom CTA"
- **Custom CTA Input**:
  - Text input for custom call-to-action
- **State**: Disabled until user is subscribed

**Goal/Purpose Selection**:
- **Label**: "Video Goal"
- **Dropdown Menu** with options:
  - "Increase engagement"
  - "Drive website traffic"
  - "Promote product/service"
  - "Build brand awareness"
  - "Educational content"
  - "Entertainment"
  - "Custom goal"
- **Custom Goal Input**:
  - Text input for custom goal description
- **State**: Disabled until user is subscribed

**Target Audience Selection**:
- **Label**: "Target Audience"
- **Dropdown Menu** with options:
  - "General audience"
  - "Young adults (18-25)"
  - "Millennials (26-40)"
  - "Parents/families"
  - "Professionals/business"
  - "Students"
  - "Entrepreneurs"
  - "Custom audience"
- **Custom Audience Input**:
  - Text input for custom audience description
- **State**: Disabled until user is subscribed

**Audience Age Selection**:
- **Label**: "Primary Age Group"
- **Dropdown Menu** with options:
  - "13-17 years"
  - "18-24 years"
  - "25-34 years"
  - "35-44 years"
  - "45-54 years"
  - "55+ years"
  - "All ages"
- **State**: Disabled until user is subscribed

**Generate Button**:
- **Text**: "Generate Viral Script"
- **Style**: Large, prominent button with gradient background
- **States**:
  - **NOT subscribed**: Disabled with gray styling
  - **Subscribed**: Active blue gradient styling
  - **Generating**: Shows loading spinner + "Generating..."
- **Functionality**: Sends all form data to AI generation API

### Script Results Section

**Results Container** (appears after successful generation):

**Generated Script Display**:
- **Card Layout**: White/dark card with padding
- **Script Text**: Large, readable text in paragraph format
- **Single Paragraph**: AI-generated viral script using Callaway's 3-step hook formula
- **Copy Button**: "Copy Script" button with clipboard icon

**Action Buttons**:
- **Copy to Clipboard**: Copies script text to system clipboard
- **Generate New Script**: Clears current result and allows new generation
- **Save Script**: Stores script in previous scripts list

**Previous Scripts Section**:
- **Expandable List**: Shows previously generated scripts
- **Script Cards**: Each previous script in a card with:
  - Truncated script preview
  - Timestamp of generation
  - "View Full" button to expand
  - "Delete" button to remove
  - "Copy" button for quick copying

## User Flow & Interactions

### 1. Initial Visit (Unauthenticated)
- User sees complete interface with all form elements
- All form inputs are disabled/grayed out
- Subscription card shows "Sign In" button
- Generate button is disabled
- Clicking any form element shows tooltip: "Sign in and subscribe to unlock"

### 2. Authentication Process
**Step 1**: Click "Sign In" button
- Auth modal opens with Google sign-in option
- Click "Continue with Google"
- Redirects to Google OAuth consent screen

**Step 2**: Google OAuth Flow
- User grants permissions in Google
- Redirects back to application
- User profile appears in top-right corner
- Toast notification: "Welcome back, [Name]!"

### 3. Subscription Process
**Step 1**: Authenticated but not subscribed
- Form elements remain disabled
- Subscription card shows "Subscribe Now" button
- User menu shows subscription status

**Step 2**: Stripe Checkout
- Click "Subscribe Now"
- Redirects to Stripe checkout page
- $5/month subscription with card details
- Secure payment processing

**Step 3**: Subscription Activation
- Webhook processes successful payment
- User redirected back to application
- Form elements become enabled
- Toast notification: "Subscription activated! Start generating scripts."

### 4. Script Generation Workflow
**Step 1**: Form Completion
- User fills out desired form fields
- Real-time validation on required fields
- Custom inputs appear based on dropdown selections

**Step 2**: AI Generation
- Click "Generate Viral Script"
- Loading state with spinner
- Form disabled during generation
- Progress indicator

**Step 3**: Results Display
- Generated script appears in results card
- Copy functionality becomes available
- Script automatically saved to previous scripts
- Options to generate new or modify current

### 5. Subscription Management
**Customer Portal Access**:
- Click user profile → "Manage Subscription"
- Redirects to Stripe customer portal
- Can update payment method, cancel subscription, view invoices
- Returns to application after changes

## Form Validation & Error Handling

### Required Field Validation
- **Title**: Must not be empty
- **Video Length**: Must select option or provide custom seconds
- **Language**: Must select or provide custom language
- **Real-time feedback**: Red borders and error messages

### Error States
- **Network Errors**: Toast notifications with retry options
- **Authentication Errors**: Redirects to sign-in flow
- **Subscription Errors**: Clear error messages with support contact
- **Generation Errors**: Retry button with error explanation

### Loading States
- **Authentication**: Spinner on sign-in button
- **Subscription**: Loading overlay during Stripe redirect
- **Generation**: Progress indicator and disabled form
- **Previous Scripts**: Skeleton loaders while fetching

## Responsive Design Details

### Mobile Layout (< 768px)
- **Stacked Layout**: Subscription card above form
- **Full-width Elements**: All inputs span full width
- **Touch-friendly**: Larger buttons and touch targets
- **Collapsible Sections**: Previous scripts in accordion format

### Tablet Layout (768px - 1024px)
- **Two-column**: Form and subscription card side-by-side
- **Responsive Grid**: Form elements in 2-column grid
- **Optimized Spacing**: Balanced white space

### Desktop Layout (> 1024px)
- **Three-column**: Header, main form, subscription sidebar
- **Fixed Sidebar**: Subscription card remains visible
- **Expanded Form**: More horizontal space for inputs

## Theme System Details

### Light Theme Colors
- **Background**: Pure white (#FFFFFF)
- **Text**: Dark gray (#1F2937)
- **Primary**: Sky blue gradient (#0EA5E9 to #0284C7)
- **Cards**: Light gray background (#F8FAFC)
- **Borders**: Light gray (#E5E7EB)

### Dark Theme Colors
- **Background**: Dark navy (#0F172A)
- **Text**: Light gray (#F1F5F9)
- **Primary**: Cyan gradient (#06B6D4 to #0891B2)
- **Cards**: Dark gray background (#1E293B)
- **Borders**: Dark gray (#334155)

### Theme Transition
- **Smooth Animation**: 200ms transition on all elements
- **System Preference**: Automatically detects user's OS preference
- **Persistence**: Remembers user's choice in localStorage

## Data Persistence

### Local Storage
- **Theme Preference**: Saved across browser sessions
- **Form Auto-save**: Drafts saved as user types
- **Previous Scripts**: Cached for quick access

### Database Storage
- **User Sessions**: Secure session management
- **Subscription Status**: Real-time sync with Stripe
- **Script History**: Permanent storage of generated scripts

## Security Features

### Authentication Security
- **HTTP-only Cookies**: Prevents XSS attacks
- **CSRF Protection**: Secure form submissions
- **Session Expiry**: Automatic logout after inactivity

### Payment Security
- **Stripe Integration**: PCI-compliant payment processing
- **Webhook Verification**: Cryptographic signature validation
- **Secure Redirects**: Validated redirect URLs

### Input Sanitization
- **XSS Prevention**: All user inputs sanitized
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Prevents abuse of AI generation

This comprehensive guide covers every interactive element, button, input field, dropdown, and functionality within the Script Expert application, providing the complete internal structure needed for exact replication.