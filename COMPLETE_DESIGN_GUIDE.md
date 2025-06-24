# Script Expert - Complete Design System & Visual Guide

## Brand Identity

### Logo Design
**FeatherIcon Component**
- **Symbol**: Stylized feather icon representing creativity and writing
- **Style**: Modern, minimalist line art with subtle curves
- **Colors**: Cyan/sky blue gradient (#06B6D4 to #0EA5E9)
- **Size**: 24x24px standard, scales responsively
- **Usage**: Always paired with "Script Expert" wordmark

### Brand Colors
**Primary Palette**
- **Sky Blue**: #0EA5E9 (main brand color)
- **Cyan**: #06B6D4 (accent color)
- **Deep Blue**: #0284C7 (darker variant)
- **Light Cyan**: #67E8F9 (hover states)

**Gradient Applications**
- **Primary Gradient**: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)
- **Accent Gradient**: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)
- **Text Gradient**: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)

## Typography System

### Font Family
**Primary Font**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Character Set**: Latin, Latin Extended
- **Weights Used**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Text Hierarchy

**H1 - Main Heading**
- **Font Size**: 2.5rem (40px) desktop, 2rem (32px) mobile
- **Font Weight**: 700 (Bold)
- **Line Height**: 1.2
- **Color**: Gradient text effect
- **Usage**: "Script Expert" main title

**H2 - Section Headings**
- **Font Size**: 1.875rem (30px) desktop, 1.5rem (24px) mobile
- **Font Weight**: 600 (SemiBold)
- **Line Height**: 1.3
- **Color**: Text primary
- **Usage**: "Ready to Create Viral Scripts?"

**H3 - Card Titles**
- **Font Size**: 1.25rem (20px)
- **Font Weight**: 600 (SemiBold)
- **Line Height**: 1.4
- **Color**: Text primary
- **Usage**: Form section labels

**Body Text - Regular**
- **Font Size**: 1rem (16px)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Color**: Text secondary
- **Usage**: Form descriptions, general content

**Body Text - Small**
- **Font Size**: 0.875rem (14px)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Color**: Text muted
- **Usage**: Helper text, captions

**Labels**
- **Font Size**: 0.875rem (14px)
- **Font Weight**: 500 (Medium)
- **Line Height**: 1.4
- **Color**: Text primary
- **Usage**: Form field labels

## Color System

### Light Theme Palette
**Background Colors**
- **Primary Background**: #FFFFFF (pure white)
- **Secondary Background**: #F8FAFC (slate-50)
- **Card Background**: #FFFFFF with subtle shadow
- **Input Background**: #FFFFFF with border

**Text Colors**
- **Primary Text**: #0F172A (slate-900)
- **Secondary Text**: #475569 (slate-600)
- **Muted Text**: #64748B (slate-500)
- **Placeholder Text**: #94A3B8 (slate-400)

**Border Colors**
- **Primary Border**: #E2E8F0 (slate-200)
- **Input Border**: #D1D5DB (gray-300)
- **Focus Border**: #0EA5E9 (sky-500)
- **Error Border**: #EF4444 (red-500)

**Interactive Colors**
- **Primary Button**: Sky blue gradient
- **Primary Button Hover**: Darker gradient shift
- **Secondary Button**: #F1F5F9 (slate-100)
- **Destructive Button**: #EF4444 (red-500)

### Dark Theme Palette
**Background Colors**
- **Primary Background**: #0F172A (slate-900)
- **Secondary Background**: #1E293B (slate-800)
- **Card Background**: #1E293B with subtle highlight
- **Input Background**: #334155 (slate-700)

**Text Colors**
- **Primary Text**: #F1F5F9 (slate-100)
- **Secondary Text**: #CBD5E1 (slate-300)
- **Muted Text**: #94A3B8 (slate-400)
- **Placeholder Text**: #64748B (slate-500)

**Border Colors**
- **Primary Border**: #334155 (slate-700)
- **Input Border**: #475569 (slate-600)
- **Focus Border**: #06B6D4 (cyan-500)
- **Error Border**: #F87171 (red-400)

**Interactive Colors**
- **Primary Button**: Cyan gradient
- **Primary Button Hover**: Brighter gradient shift
- **Secondary Button**: #334155 (slate-700)
- **Destructive Button**: #F87171 (red-400)

## Layout & Spacing

### Grid System
**Container**
- **Max Width**: 1200px
- **Padding**: 1rem (16px) mobile, 2rem (32px) desktop
- **Margin**: Auto-centered

**Responsive Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Spacing Scale (Tailwind-based)
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **base**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 2.5rem (40px)
- **3xl**: 3rem (48px)
- **4xl**: 4rem (64px)

### Component Spacing
**Vertical Rhythm**
- **Section Spacing**: 3rem (48px) between major sections
- **Component Spacing**: 2rem (32px) between components
- **Form Field Spacing**: 1.5rem (24px) between form fields
- **Text Spacing**: 1rem (16px) between paragraphs

**Horizontal Padding**
- **Cards**: 1.5rem (24px) padding
- **Buttons**: 1rem (16px) horizontal, 0.75rem (12px) vertical
- **Inputs**: 0.75rem (12px) padding
- **Container**: 1rem (16px) mobile, 2rem (32px) desktop

## Header Design

### Header Layout
**Structure**
- **Height**: 4rem (64px) fixed
- **Background**: White/dark with subtle border bottom
- **Position**: Sticky top navigation
- **Shadow**: Subtle drop shadow (0 1px 3px rgba(0,0,0,0.1))

**Logo Section** (Left side)
- **Container**: Flex layout with gap
- **Icon**: FeatherIcon component (24x24px)
- **Text**: "Script Expert" in gradient colors
- **Hover**: Subtle scale transform (scale(1.05))

**Navigation Section** (Right side)
- **Layout**: Flex with items center, gap 1rem
- **Theme Toggle**: 40x40px button with icon
- **User Menu**: Profile picture or sign-in button

### Theme Toggle Button
**Design**
- **Size**: 40x40px circular button
- **Background**: Transparent with hover state
- **Icon**: Sun (light mode) / Moon (dark mode)
- **Hover**: Background color transition
- **Active**: Subtle pressed state

## Form Design System

### Form Container
**Layout**
- **Background**: Card background with rounded corners
- **Border Radius**: 0.75rem (12px)
- **Padding**: 2rem (32px)
- **Shadow**: Subtle elevation (0 4px 6px rgba(0,0,0,0.1))
- **Max Width**: 600px

### Input Field Design
**Text Input**
- **Height**: 2.75rem (44px)
- **Border**: 1px solid border color
- **Border Radius**: 0.5rem (8px)
- **Padding**: 0.75rem (12px)
- **Font Size**: 1rem (16px)
- **Transition**: 150ms ease-in-out

**Focus State**
- **Border**: 2px solid focus color
- **Shadow**: Focus ring (0 0 0 3px rgba(14,165,233,0.1))
- **Outline**: None (custom focus styling)

**Disabled State**
- **Background**: Muted background
- **Border**: Lighter border color
- **Text**: Muted text color
- **Cursor**: Not-allowed

**Error State**
- **Border**: 2px solid error color
- **Shadow**: Error ring (0 0 0 3px rgba(239,68,68,0.1))
- **Text**: Error color for validation message

### Dropdown/Select Design
**Select Container**
- **Height**: 2.75rem (44px)
- **Border**: Same as text input
- **Padding**: 0.75rem (12px)
- **Arrow Icon**: Chevron down, positioned right

**Dropdown Menu**
- **Background**: Card background
- **Border**: 1px solid border color
- **Border Radius**: 0.5rem (8px)
- **Shadow**: Dropdown shadow (0 10px 15px rgba(0,0,0,0.1))
- **Max Height**: 200px with scroll

**Option Items**
- **Padding**: 0.75rem (12px)
- **Hover**: Background highlight
- **Selected**: Primary color background
- **Font Size**: 1rem (16px)

### Checkbox Design
**Checkbox Container**
- **Size**: 1.25rem (20px) square
- **Border**: 2px solid border color
- **Border Radius**: 0.25rem (4px)
- **Background**: Input background

**Checked State**
- **Background**: Primary color
- **Border**: Primary color
- **Icon**: White checkmark
- **Animation**: Scale and fade transition

**Label Design**
- **Font Size**: 1rem (16px)
- **Margin Left**: 0.75rem (12px)
- **Cursor**: Pointer
- **Line Height**: 1.5

### Textarea Design
- **Min Height**: 6rem (96px)
- **Resize**: Vertical only
- **Same styling**: As text input
- **Scrollbar**: Custom styling to match theme

## Button Design System

### Primary Button
**Default State**
- **Background**: Primary gradient
- **Color**: White text
- **Padding**: 0.75rem 2rem (12px 32px)
- **Border Radius**: 0.5rem (8px)
- **Font Weight**: 600 (SemiBold)
- **Font Size**: 1rem (16px)
- **Transition**: All 150ms ease-in-out

**Hover State**
- **Background**: Darker gradient
- **Transform**: translateY(-1px)
- **Shadow**: Elevated shadow (0 4px 12px rgba(14,165,233,0.3))

**Active State**
- **Transform**: translateY(0)
- **Shadow**: Reduced shadow

**Disabled State**
- **Background**: Muted gray
- **Color**: Muted text
- **Cursor**: Not-allowed
- **No hover effects**

### Secondary Button
**Styling**
- **Background**: Secondary background
- **Color**: Primary text
- **Border**: 1px solid border color
- **Same dimensions**: As primary button

### Destructive Button
**Styling**
- **Background**: Error color
- **Color**: White text
- **Same dimensions**: As primary button

### Icon Buttons
**Design**
- **Size**: 2.5rem (40px) square
- **Background**: Transparent
- **Border Radius**: 0.5rem (8px)
- **Icon Size**: 1.25rem (20px)
- **Hover**: Background highlight

## Card Component Design

### Standard Card
**Structure**
- **Background**: Card background color
- **Border**: 1px solid border color (light theme only)
- **Border Radius**: 0.75rem (12px)
- **Padding**: 1.5rem (24px)
- **Shadow**: Subtle card shadow

**Hover State** (for interactive cards)
- **Shadow**: Elevated shadow
- **Transform**: translateY(-2px)
- **Transition**: 200ms ease-in-out

### Subscription Card
**Special Styling**
- **Background**: Gradient background (subtle)
- **Border**: Premium border with gradient
- **Padding**: 2rem (32px)
- **Text Alignment**: Center
- **Icon**: Large feather icon at top

## Modal Design

### Modal Overlay
- **Background**: rgba(0,0,0,0.5) backdrop
- **Position**: Fixed fullscreen
- **Z-index**: 50
- **Animation**: Fade in/out

### Modal Container
- **Background**: Card background
- **Border Radius**: 1rem (16px)
- **Padding**: 2rem (32px)
- **Max Width**: 400px
- **Shadow**: Large modal shadow
- **Animation**: Scale and fade transition

### Modal Header
- **Title**: H2 styling
- **Close Button**: Top-right X icon
- **Padding Bottom**: 1rem (16px)
- **Border Bottom**: 1px solid border color

## Responsive Design Details

### Mobile Layout (< 640px)
**Adjustments**
- **Header**: Reduced padding, smaller logo
- **Form**: Single column, full width inputs
- **Cards**: Reduced padding, stacked layout
- **Buttons**: Full width on mobile
- **Typography**: Smaller heading sizes

### Tablet Layout (640px - 1024px)
**Adjustments**
- **Grid**: 2-column form layout
- **Cards**: Side-by-side arrangement
- **Spacing**: Increased section spacing
- **Typography**: Medium heading sizes

### Desktop Layout (> 1024px)
**Features**
- **Sidebar**: Fixed subscription card
- **Form**: Optimal input widths
- **Typography**: Full heading sizes
- **Hover Effects**: All interactive states
- **Advanced Layout**: 3-column arrangement

## Animation & Transitions

### Standard Transitions
- **Duration**: 150ms for micro-interactions
- **Duration**: 200ms for component state changes
- **Duration**: 300ms for layout changes
- **Easing**: ease-in-out for smooth motion

### Hover Animations
- **Scale**: transform: scale(1.05) for buttons
- **Translate**: translateY(-2px) for cards
- **Shadow**: Smooth shadow transitions
- **Color**: Background/text color changes

### Loading States
- **Spinner**: Rotating animation
- **Skeleton**: Shimmer effect for content loading
- **Progress**: Linear progress indicators
- **Pulse**: Opacity pulse for loading elements

### Theme Transition
- **All Properties**: 200ms transition
- **Color Changes**: Smooth color interpolation
- **Background**: Seamless theme switching

## Accessibility Design

### Focus Indicators
- **Visible Focus**: High contrast focus rings
- **Skip Links**: Hidden navigation aids
- **Color Contrast**: WCAG AA compliance
- **Interactive Size**: Minimum 44px touch targets

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive labels for complex UI
- **Alt Text**: All images have descriptive alt text
- **Form Labels**: Explicit label associations

This comprehensive design guide provides every visual detail needed to recreate the Script Expert interface with pixel-perfect accuracy, including all color values, typography specs, spacing measurements, and responsive behaviors.