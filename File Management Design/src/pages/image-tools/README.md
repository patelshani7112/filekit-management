# Image Tools

This directory contains all image-related tool pages organized by functionality.

## Folder Structure

```
/pages/image-tools/
├── image-compression/
│   ├── CompressImagePage.tsx
│   └── components/
│       ├── HeroSection.tsx
│       ├── CompressionOptions.tsx
│       ├── HowItWorksSteps.tsx
│       ├── FeaturesSection.tsx
│       ├── UseCasesSection.tsx
│       ├── FAQSection.tsx
│       └── RelatedTools.tsx
├── image-editing/
│   └── (future tools)
├── image-conversions/
│   └── (future tools)
└── image-to-document/
    └── (future tools)
```

## Implemented Tools

### Image Compression
- **Compress Image** (`/compress-image`) - Main image compression tool with quality settings, format conversion, and batch processing

## Planned Tools

### Image Editing
- Edit Image
- Resize Image
- Bulk Resize
- Crop Image
- Rotate Image
- Flip Image
- Image Enlarger
- Color Picker
- Add Watermark
- Meme Generator

### Image Conversions
- JPG to PNG
- PNG to JPG
- PNG to WEBP
- WEBP to PNG
- JPG to WEBP
- WEBP to JPG
- And more...

### Image to Document
- Image to Word
- Image to Excel

## Content Structure

Content for each tool is stored in:
```
/content/tools/image-tools/[category]/[tool-name]-content.ts
```

Example:
```
/content/tools/image-tools/image-compression/compress-image-content.ts
```

## Component Reusability

All image tools use shared components from:
- `/components/tool/file-management/` - File upload and management
- `/components/tool/success/` - Download and success screens
- `/components/tool/seo-sections/` - SEO sections (FAQ, Features, etc.)
- `/components/tool/ads/` - Advertisement components

## Naming Conventions

- **Page Files**: `[ToolName]Page.tsx` (PascalCase)
- **Route Paths**: `/[tool-name]` (kebab-case)
- **Component Files**: `[ComponentName].tsx` (PascalCase)
- **Content Files**: `[tool-name]-content.ts` (kebab-case)
