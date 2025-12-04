# Upload Structure & Layout Standardization Guide

## Overview
This document standardizes the file upload area layout, ads placement, and responsive design patterns across all 200+ tools in WorkflowPro. All pages should follow the exact structure used in **Merge PDF** and **Remove Watermark** pages.

## ✅ Standardized Upload Section Structure

### 1. FileUploader Component
All pages MUST use the `FileUploader` component with consistent props:

```tsx
<FileUploader
  onFilesSelected={handleFilesSelected}
  acceptedTypes=".pdf"  // or appropriate file types
  multiple={true}       // or false for single file
  maxFiles={10}         // appropriate limit
  maxFileSize={50}      // in MB
  fileTypeLabel="PDF"   // or "Image", "Video", etc.
  helperText="Optional custom text"
  validationMessage={validationMessage}  // inline validation
  validationType={validationType}        // "warning" | "error" | "info"
/>
```

### 2. Consistent Visual Design
The FileUploader provides:
- ✅ **Pink/purple dashed border** (`border-2 border-dashed border-pink-200`)
- ✅ **Gradient background** (`bg-gradient-to-br from-pink-50/50 to-purple-50/50`)
- ✅ **Circular upload icon** with pink/purple gradient background
- ✅ **"Click or Drop Files"** main text
- ✅ **Helper text** below (e.g., "Supports PDF file, each up to 524288000MB in size.")
- ✅ **Inline validation messages** (no toasts/alerts)
- ✅ **Responsive sizing** - works on mobile, tablet, desktop

### 3. Standard Helper Text Format
Follow this pattern for helper text:

**Remove Watermark Example:**
```
"Supports PDF file, each up to 524288000MB in size."
```

**Merge PDF Example:**
```
"PDF files only · Up to 10 files · 50MB each"
```

**General Pattern:**
```
"[File Type] only · Up to [N] files · [Size]MB each"
```

## 🎨 Layout & Ads Structure

### Upload Step Layout (3-Column)

```tsx
<ToolPageLayout>  {/* Provides 3-column layout with side ads */}
  <ToolPageHero
    title={HERO_CONTENT.title}
    description={HERO_CONTENT.description}
  />
  
  <FileUploader
    // ... props
  />
  
  {files.length > 0 && (
    <FileListWithValidation
      files={fileValidations}
      onRemove={handleRemoveFile}
      // ... other props
    />
  )}
  
  <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
  <WhyChooseSection features={WHY_CHOOSE_CONTENT.features} />
  <UseCasesSection useCases={USE_CASES} />
  <ToolFAQSection faqs={FAQ_ITEMS} />
  <ToolDefinitionSection term={DEFINITION.term} definition={DEFINITION.definition} />
  <RelatedToolsSection tools={RELATED_TOOLS} />
  <ToolSEOFooter />
</ToolPageLayout>
```

### Edit Step Layout (Full Width)

```tsx
<EditPageLayout
  fullWidth={true}
  showInlineAd={true}  // Shows horizontal ad at bottom
  onBack={handleBackToUpload}
  totalPages={pdfPages.length}
  totalSize={totalSizeFormatted}
  sidebar={
    <>
      {/* Sidebar content */}
    </>
  }
>
  {/* Main edit content */}
</EditPageLayout>
```

### Complete Step Layout (3-Column)

```tsx
<ToolPageLayout>
  <SuccessHeader
    title="Success!"
    description="Your files have been processed."
  />
  
  <ToolSuccessSection
    fileName={processedFileName}
    fileSize={fileSize}
    onDownload={handleDownload}
    onStartOver={handleStartOver}
  />
  
  <RelatedToolsSection tools={RELATED_TOOLS} />
</ToolPageLayout>
```

## 📱 Responsive Design

### Mobile Sticky Ad
```tsx
<MobileStickyAd />  {/* Shows on mobile/tablet only */}
```

### Desktop Side Ads
```tsx
<ToolPageLayout>  {/* Automatically includes 2 side ads on desktop (160x600) */}
  {/* Content */}
</ToolPageLayout>
```

### Responsive Upload Area
The FileUploader component is fully responsive:
- **Mobile**: Single column, smaller icon (w-20 h-20), smaller text (text-lg)
- **Tablet**: Medium sizing (w-24 h-24, text-xl)
- **Desktop**: Full sizing with hover effects

## 🔄 3-Step Architecture

All tools follow this consistent flow:

### Step 1: Upload
- Show `ToolPageHero` with title/description
- Show `FileUploader` component
- Show `FileListWithValidation` when files added
- Show all SEO sections (HowItWorks, WhyChoose, UseCases, FAQ, etc.)
- **Layout**: 3-column with side ads (ToolPageLayout)
- **Mobile Ad**: MobileStickyAd at top

### Step 2: Edit (Optional - for tools that need editing)
- Show `EditPageLayout` (full width)
- Show sidebar with settings
- Show main content area
- **Layout**: Full width, no side ads
- **Mobile Ad**: Inline horizontal ad at bottom

### Step 3: Complete
- Show `SuccessHeader`
- Show `ToolSuccessSection` with download
- Show `RelatedToolsSection`
- **Layout**: 3-column with side ads (ToolPageLayout)
- **Mobile Ad**: None (success state)

## 🎯 File Validation

### Use FileListWithValidation Component

```tsx
<FileListWithValidation
  files={fileValidations}           // FileValidationInfo[]
  onRemove={handleRemoveFile}       // (index: number) => void
  onReorder={handleReorderFiles}    // Optional
  onClearAll={handleClearAll}       // Optional
  onContinue={handleContinue}       // Continue button handler
  continueText="Continue"           // Custom button text
  continueDisabled={false}          // Disable button
  showReorder={true}                // Show reorder controls
  onRetry={handleRetry}             // Retry validation
  minFiles={1}                      // Minimum files required
  showContinueButton={true}         // Show continue button
/>
```

### FileValidationInfo Type

```tsx
interface FileValidationInfo {
  file: File;
  isValidating?: boolean;   // Shows progress animation
  isValid: boolean;         // Pass/fail validation
  pageCount?: number;       // For PDFs
  error?: string;           // Error message
  uploadProgress?: number;  // 0-100 progress
}
```

## 🚫 What NOT to Use

### ❌ DON'T Use:
- `toast()` notifications - Use inline validation messages instead
- `alert()` dialogs - Use inline validation messages instead
- Custom upload areas - Always use `FileUploader` component
- Inconsistent helper text formats
- Different border styles or colors
- Custom validation displays outside FileUploader

### ✅ DO Use:
- `FileUploader` component for all file uploads
- Inline `validationMessage` prop for errors
- Consistent pink/purple color scheme
- Standard helper text format
- FileListWithValidation for file display

## 📋 Implementation Checklist

When creating or updating a tool page:

- [ ] Use `FileUploader` component with all required props
- [ ] Set appropriate `maxFiles` and `maxFileSize` limits
- [ ] Provide clear `fileTypeLabel` (e.g., "PDF", "Image", "Video")
- [ ] Follow standard helper text format
- [ ] Use `FileListWithValidation` for uploaded files
- [ ] Implement inline validation (no toasts/alerts)
- [ ] Use `ToolPageLayout` for 3-column layout with side ads
- [ ] Use `EditPageLayout` for full-width edit mode
- [ ] Add `MobileStickyAd` for mobile devices
- [ ] Follow 3-step architecture (Upload → Edit → Complete)
- [ ] Include all SEO sections on upload step
- [ ] Use `NavigationBlocker` to warn about unsaved changes
- [ ] Use `ProcessingModal` for async operations

## 📦 Import Statements

```tsx
import { useState } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  FileUploader,
  FileListWithValidation,
  ToolSuccessSection,
  SuccessHeader,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
  EditPageLayout,
  NavigationBlocker,
  ProcessingModal,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
```

## 🎨 Color Scheme Consistency

### Upload Area Colors
- **Border**: `border-pink-200` (default), `border-pink-400` (dragging)
- **Background**: `bg-gradient-to-br from-pink-50/50 to-purple-50/50`
- **Icon Background**: `bg-gradient-to-br from-pink-100 to-purple-100`
- **Icon Color**: `text-pink-500` (default), `text-pink-600` (dragging)
- **Text**: `text-gray-800` (default), `text-pink-600` (dragging)

### Validation Message Colors
- **Warning**: `bg-yellow-50 border-yellow-300 text-yellow-800`
- **Error**: `bg-red-50 border-red-300 text-red-800`
- **Info**: `bg-blue-50 border-blue-300 text-blue-800`

## 🔍 Example: Merge PDF vs Remove Watermark

### Similarities (MUST be consistent across ALL tools):
✅ Both use `FileUploader` component  
✅ Both have pink/purple dashed border  
✅ Both use "Click or Drop Files" text  
✅ Both show helper text below upload icon  
✅ Both use inline validation messages  
✅ Both use `ToolPageLayout` for 3-column ads  
✅ Both use `EditPageLayout` for edit mode  
✅ Both use `MobileStickyAd` on mobile  
✅ Both follow 3-step architecture  

### Differences (Tool-specific customization):
- Helper text content (file type, limits)
- Maximum file count
- File type restrictions
- Edit mode UI (Merge shows file grid, Remove shows watermark selection)
- Processing steps

## 🎯 Key Takeaway

**Every tool page should look and function identically in the upload section.**  
Users should feel familiar with the upload experience across all 200+ tools.  
The only differences should be tool-specific limits and file types.

---

**Reference Pages:**
- `/pages/pdf-tools/organize-manage-pdf/MergePdfPage.tsx` ✅
- `/pages/pdf-tools/edit-annotate/RemoveWatermarkPage.tsx` ✅

**Component Locations:**
- `/components/tool/file-management/FileUploader.tsx`
- `/components/tool/file-management/FileListWithValidation.tsx`
- `/components/tool/layout/ToolPageLayout.tsx`
- `/components/tool/layout/EditPageLayout.tsx`
- `/components/tool/ads/MobileStickyAd.tsx`
