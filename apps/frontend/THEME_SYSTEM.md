# Theme System Refactoring Guide

## Overview

The app has been refactored to support light and dark modes without altering layout displays. The theme system uses CSS variables and Tailwind's `class` mode for manual theme control.

## Key Changes

### 1. CSS Variables (`globals.css`)

We've defined comprehensive CSS variables for theming:

**Light Mode (Default):**

- `--page-bg: #F8F9FB` - Main page background
- `--card-bg: #ffffff` - Card backgrounds
- `--border: #E5E7EB` - Border colors
- `--text-primary: #353535` - Primary text
- `--text-secondary: #848484` - Secondary text
- `--text-muted: #BEBEBE` - Muted text

**Dark Mode:**

- `--page-bg: #1a1a1a` - Main page background
- `--card-bg: #2a2a2a` - Card backgrounds
- `--border: #404040` - Border colors
- `--text-primary: #ededed` - Primary text
- `--text-secondary: #a0a0a0` - Secondary text
- `--text-muted: #707070` - Muted text

**Brand Colors (Consistent across themes):**

- `--brand-primary: #037F44` - Primary brand color
- `--brand-primary-hover: #026835` - Hover state
- `--brand-light: #CCDCD4` - Light variant
- `--brand-lighter: #e6f9f0` - Lighter variant

### 2. Tailwind Configuration

Updated `tailwind.config.js`:

- Changed `darkMode` from `"media"` to `"class"` for manual control
- Added custom color utilities that reference CSS variables
- Colors automatically adapt when `.dark` class is applied to `<html>`

### 3. Theme Provider

Created `ThemeProvider.tsx` component that:

- Manages theme state (light/dark/system)
- Persists theme preference to localStorage
- Applies `.dark` class to `<html>` element
- Provides `useTheme()` hook for components

### 4. Theme Toggle

Created `ThemeToggle.tsx` component:

- Simple button to switch between light and dark modes
- Shows sun/moon icon based on current theme
- Added to navbar for easy access

## Migration Guide

### Before (Hardcoded Colors):

```tsx
<div className="bg-[#F8F9FB] text-[#353535]">
  <div className="bg-white border border-[#E5E7EB]">
    <span className="text-[#848484]">Secondary text</span>
  </div>
</div>
```

### After (Theme-Aware):

```tsx
<div className="bg-page-bg text-text-primary">
  <div className="bg-card-bg border border-border-color">
    <span className="text-text-secondary">Secondary text</span>
  </div>
</div>
```

### Color Mapping Reference

| Old Hardcoded Color  | New Tailwind Class       | CSS Variable            |
| -------------------- | ------------------------ | ----------------------- |
| `bg-[#F8F9FB]`       | `bg-page-bg`             | `var(--page-bg)`        |
| `bg-white` (cards)   | `bg-card-bg`             | `var(--card-bg)`        |
| `border-[#E5E7EB]`   | `border-border-color`    | `var(--border)`         |
| `text-[#353535]`     | `text-text-primary`      | `var(--text-primary)`   |
| `text-[#848484]`     | `text-text-secondary`    | `var(--text-secondary)` |
| `text-[#BEBEBE]`     | `text-text-muted`        | `var(--text-muted)`     |
| `bg-[#037F44]`       | `bg-brand-primary`       | `var(--brand-primary)`  |
| `text-[#037F44]`     | `text-brand-primary`     | `var(--brand-primary)`  |
| `hover:bg-[#e6f9f0]` | `hover:bg-brand-lighter` | `var(--brand-lighter)`  |

## Using the Theme System

### 1. In Components

```tsx
import { useTheme } from "@/components/ThemeProvider";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="bg-page-bg text-text-primary">
      Current theme: {resolvedTheme}
    </div>
  );
}
```

### 2. Conditional Dark Mode Styles

Use Tailwind's `dark:` prefix for dark mode specific styles:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  This adapts to theme
</div>
```

### 3. Brand Colors

Brand colors remain consistent across themes:

```tsx
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white">
  Primary Action
</button>
```

## Layout Stability

The refactoring ensures layout stability by:

1. **Fixed body styles** - Corrected the swapped background/foreground in `globals.css`
2. **CSS variables** - Colors change via variables, not layout properties
3. **Class-based control** - Theme changes only affect color values, not dimensions
4. **Consistent spacing** - All padding, margins, and sizing remain unchanged

## Testing

To test the theme system:

1. Look for the theme toggle button in the navbar (sun/moon icon)
2. Click to switch between light and dark modes
3. Verify that:
   - Layout remains stable (no shifts or jumps)
   - Colors change appropriately
   - Theme preference persists on page reload
   - All text remains readable

## Next Steps

To complete the migration:

1. Update remaining components to use new color classes
2. Replace hardcoded colors with theme-aware variables
3. Test all pages in both light and dark modes
4. Ensure accessibility (contrast ratios) in both themes

## Files Modified

- `src/app/globals.css` - Added CSS variables and fixed body styles
- `tailwind.config.js` - Updated dark mode config and color utilities
- `src/components/ThemeProvider.tsx` - New theme context provider
- `src/components/ui/ThemeToggle.tsx` - New theme toggle component
- `src/components/GlobalLayoutContent.tsx` - Wrapped with ThemeProvider
- `src/components/ui/nav.tsx` - Added ThemeToggle to navbar
