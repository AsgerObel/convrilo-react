# Convrilo React - Styling Guide

## Overview
This document outlines the styling conventions and guidelines for the Convrilo React application.

## CSS Framework
- **Primary**: Tailwind CSS
- **Custom CSS**: Component-specific CSS files for complex styling

## Typography

### Fonts
- **Headings (H1-H6)**: Bebas Neue (Google Fonts)
- **Paragraphs (p)**: Open Sans (Google Fonts) - weights 300, 400, 500, 600, 700
- **Other Text**: Default system font stack via Tailwind

### Font Implementation
Both fonts are imported via Google Fonts in `src/index.css`:
- Bebas Neue is applied to all heading elements (h1-h6)
- Open Sans is applied to all paragraph elements (p)

## Component Structure

### CSS File Organization
Each major component has its own CSS file:
- `src/App.css` - Global app styles
- `src/index.css` - Base styles with Tailwind imports
- `src/components/FileConverter.css` - File converter component
- `src/components/Navbar.css` - Navigation component
- `src/components/AuthModal.css` - Authentication modal
- `src/pages/Auth.css` - Auth page styles
- `src/pages/Pricing.css` - Pricing page styles
- `src/pages/Profile.css` - Profile page styles
- `src/pages/Updates.css` - Updates page styles

### Color Scheme
- **Primary Colors**: Defined through Tailwind CSS utility classes
- **Interactive Elements**: Consistent hover and focus states
- **Subscription Badges**:
  - Pro: Highlighted with accent colors
  - Free: Neutral styling

### Layout Patterns
- **Container**: Consistent max-width and centering
- **Cards**: Uniform padding and border radius
- **Buttons**: Consistent sizing and state variations
- **Forms**: Standardized input styling and validation states

## Tailwind Configuration
The project uses Tailwind CSS with default configuration extended for:
- Custom color palette
- Typography scale
- Spacing system
- Component utilities

## Responsive Design
All components follow mobile-first responsive design principles using Tailwind's responsive utilities.

## Component-Specific Styling Notes

### Pricing Page
- Two-column card layout for Free vs Pro plans
- Highlighted "Most Popular" badge for Pro plan
- Billing toggle with active state indication
- Feature lists with checkmarks and X marks

### Profile Page
- Success banner for payment confirmations
- Subscription status badges
- Account information fields with icons
- Action buttons for editing and cancellation

### File Converter
- Drag and drop area styling
- Progress indicators
- File type support badges
- Conversion status feedback

## Best Practices
1. Use Tailwind utilities first before custom CSS
2. Keep component-specific styles in their respective CSS files
3. Maintain consistent spacing using Tailwind's spacing scale
4. Use semantic color names and maintain accessibility contrast ratios
5. Test responsive behavior across all breakpoints