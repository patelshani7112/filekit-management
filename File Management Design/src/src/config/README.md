# Shared Configuration Files

This directory contains shared configuration that should be consistent across all tool pages.

## Files

### `whyChooseConfig.ts`

Contains the "Why Choose WorkflowPro?" section content that appears on all tool pages.

**Usage:**

```tsx
import { WHY_CHOOSE_WORKFLOWPRO } from "../src/config/whyChooseConfig";

// In your component
<WhyChooseSection
  title={WHY_CHOOSE_WORKFLOWPRO.title}
  subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle}
  introText={WHY_CHOOSE_WORKFLOWPRO.introText}
  features={WHY_CHOOSE_WORKFLOWPRO.features}
/>
```

**Benefits:**

- ✅ Single source of truth - update once, applies to all pages
- ✅ Consistent messaging across the entire application
- ✅ Easy to maintain and update
- ✅ No duplication of content

**What's included:**

- Title: "Why Choose WorkflowPro?"
- Subtitle: Platform description
- Intro text: Value proposition
- 6 Feature cards:
  1. Lightning Fast Processing
  2. 100% Secure & Private
  3. Works Everywhere
  4. Unlimited File Processing
  5. No Registration Needed
  6. Intuitive Drag & Drop

## Adding New Shared Config

When you have content that should be consistent across multiple pages:

1. Create a new config file in this directory (e.g., `footerConfig.ts`)
2. Export a constant with the shared data
3. Import and use it in your pages
4. Document it here in this README

## Example: Adding Footer Config

```tsx
// src/config/footerConfig.ts
export const FOOTER_LINKS = {
  tools: [...],
  company: [...],
  legal: [...]
};

// In your component
import { FOOTER_LINKS } from "../src/config/footerConfig";
```
