# Quick Upload Implementation Reference Card

## 🚀 TL;DR - Copy & Paste Template

### Step 1: Import Components
```tsx
import { useState } from "react";
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
  NavigationBlocker,
} from "../../../components/tool";
import type { FileValidationInfo } from "../../../components/tool";
```

### Step 2: State Setup
```tsx
const [files, setFiles] = useState<File[]>([]);
const [fileValidations, setFileValidations] = useState<FileValidationInfo[]>([]);
const [currentStep, setCurrentStep] = useState<"upload" | "complete">("upload");
```

### Step 3: Upload Section (Copy This Exactly!)
```tsx
{currentStep === "upload" && (
  <>
    <ToolPageHero
      title={HERO_CONTENT.title}
      description={HERO_CONTENT.description}
    />

    <FileUploader
      onFilesSelected={handleFilesSelected}
      acceptedTypes=".pdf"           // or ".jpg,.png" or ".mp4" etc.
      multiple={true}                // or false for single file
      maxFiles={10}                  // your limit
      maxFileSize={50}               // in MB
      fileTypeLabel="PDF"            // or "Image", "Video", etc.
      validationMessage={validationMessage}
      validationType={validationType}
    />

    {files.length > 0 && (
      <FileListWithValidation
        files={fileValidations}
        onRemove={handleRemoveFile}
        onContinue={handleContinue}
        continueText="Continue"
        showContinueButton={true}
        minFiles={1}
      />
    )}

    <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
    <WhyChooseSection features={WHY_CHOOSE_CONTENT.features} />
    <UseCasesSection useCases={USE_CASES} />
    <ToolFAQSection faqs={FAQ_ITEMS} />
    <ToolDefinitionSection term={DEFINITION.term} definition={DEFINITION.definition} />
    <RelatedToolsSection tools={RELATED_TOOLS} />
    <ToolSEOFooter />
  </>
)}
```

### Step 4: Wrap in Layout
```tsx
<ToolPageLayout>
  <MobileStickyAd />
  {/* Your upload section from Step 3 */}
</ToolPageLayout>
```

---

## ✅ Common File Type Configurations

### PDF Only
```tsx
<FileUploader
  acceptedTypes=".pdf"
  multiple={true}
  maxFiles={10}
  maxFileSize={50}
  fileTypeLabel="PDF"
/>
```

### Images Only
```tsx
<FileUploader
  acceptedTypes=".jpg,.jpeg,.png,.gif,.webp"
  multiple={true}
  maxFiles={20}
  maxFileSize={10}
  fileTypeLabel="Image"
/>
```

### Single PDF
```tsx
<FileUploader
  acceptedTypes=".pdf"
  multiple={false}
  maxFiles={1}
  maxFileSize={50}
  fileTypeLabel="PDF"
/>
```

### Video Files
```tsx
<FileUploader
  acceptedTypes=".mp4,.mov,.avi,.mkv"
  multiple={false}
  maxFiles={1}
  maxFileSize={500}
  fileTypeLabel="Video"
/>
```

---

## ⚠️ DO NOT Do These Things

### ❌ DON'T: Create Custom Upload Area
```tsx
// WRONG - Don't do this!
<div className="upload-area">
  <input type="file" />
  <p>Upload files here</p>
</div>
```

### ✅ DO: Use FileUploader Component
```tsx
// CORRECT - Always use this!
<FileUploader
  onFilesSelected={handleFilesSelected}
  acceptedTypes=".pdf"
  // ... other props
/>
```

---

### ❌ DON'T: Show Toast Notifications
```tsx
// WRONG - Don't do this!
toast.error("File size too large!");
alert("Invalid file type!");
```

### ✅ DO: Use Inline Validation
```tsx
// CORRECT - Use inline messages!
const [validationMessage, setValidationMessage] = useState("");
const [validationType, setValidationType] = useState<"warning" | "error">("warning");

<FileUploader
  validationMessage={validationMessage}
  validationType={validationType}
  // ... other props
/>
```

---

### ❌ DON'T: Use Different Colors
```tsx
// WRONG - Don't change colors!
<div className="border-blue-500 bg-blue-100">
```

### ✅ DO: Use Standard Pink/Purple
```tsx
// CORRECT - Already built into FileUploader!
// Just use the component as-is
<FileUploader ... />
```

---

### ❌ DON'T: Skip Layout Components
```tsx
// WRONG - Missing layout wrapper!
<div>
  <FileUploader ... />
</div>
```

### ✅ DO: Always Use ToolPageLayout
```tsx
// CORRECT - Proper layout with ads!
<ToolPageLayout>
  <FileUploader ... />
</ToolPageLayout>
```

---

## 🎯 Helper Text Format Guide

### Single File
```
"Supports PDF file, up to 50MB in size."
"Supports Image file, up to 10MB in size."
```

### Multiple Files (Same Type)
```
"PDF files only · Up to 10 files · 50MB each"
"Image files only · Up to 20 files · 10MB each"
"Video files only · Up to 5 files · 500MB each"
```

### Multiple Files (Mixed Types)
```
"Supports up to 10 files, 50MB each"
```

---

## 🔧 File Validation Handler Template

```tsx
const handleFilesSelected = async (selectedFiles: File[]) => {
  setFiles(selectedFiles);

  // Validate files
  const validations = await Promise.all(
    selectedFiles.map(async (file) => {
      const validation: FileValidationInfo = {
        name: file.name,
        size: file.size,
        isValid: true,
        errorMessage: "",
      };

      // Check file type
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        validation.isValid = false;
        validation.errorMessage = "Invalid file type";
        return validation;
      }

      // Check file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        validation.isValid = false;
        validation.errorMessage = "File too large (max 50MB)";
        return validation;
      }

      // Get PDF info (pages count)
      try {
        const pdfInfo = await getPdfInfo(file);
        validation.pages = pdfInfo.pages;
      } catch (error) {
        validation.isValid = false;
        validation.errorMessage = "Invalid PDF file";
      }

      return validation;
    })
  );

  setFileValidations(validations);
};
```

---

## 📱 Responsive Ad Placement

### Desktop (1024px+)
```
┌─────┬──────────┬─────┐
│ AD  │ Content  │ AD  │
│160  │          │160  │
│×600 │          │×600 │
└─────┴──────────┴─────┘
```
**Automatically handled by ToolPageLayout**

### Mobile/Tablet (<1024px)
```
┌─────────────────────┐
│   MobileStickyAd    │
│      300x100        │
├─────────────────────┤
│      Content        │
│    (Full Width)     │
└─────────────────────┘
```
**Add MobileStickyAd component**

---

## 🎨 Quick Visual Checklist

Before deploying, verify:

- [ ] Pink dashed border visible? 
- [ ] Circular gradient icon visible?
- [ ] "Click or Drop Files" text visible?
- [ ] Helper text below icon?
- [ ] Border changes to pink-400 on drag?
- [ ] Background lightens on hover?
- [ ] Validation messages inline (not toast)?
- [ ] Side ads show on desktop?
- [ ] Mobile ad shows on mobile?
- [ ] Responsive on all screen sizes?

---

## 🚨 Common Mistakes

### Mistake #1: Wrong Import
```tsx
// ❌ WRONG
import FileUploader from "../components/FileUploader";

// ✅ CORRECT
import { FileUploader } from "../../../components/tool";
```

### Mistake #2: Missing ToolPageLayout
```tsx
// ❌ WRONG
return (
  <div>
    <FileUploader ... />
  </div>
);

// ✅ CORRECT
return (
  <ToolPageLayout>
    <FileUploader ... />
  </ToolPageLayout>
);
```

### Mistake #3: Custom Styling
```tsx
// ❌ WRONG
<FileUploader 
  className="bg-blue-500"  // Don't add custom classes!
  ... 
/>

// ✅ CORRECT
<FileUploader 
  // No className prop - component handles all styling!
  ... 
/>
```

### Mistake #4: Wrong File Size Format
```tsx
// ❌ WRONG
maxFileSize={50000000}  // Bytes

// ✅ CORRECT
maxFileSize={50}  // Megabytes
```

### Mistake #5: Missing Validation State
```tsx
// ❌ WRONG
<FileUploader ... />
// No validation message state!

// ✅ CORRECT
const [validationMessage, setValidationMessage] = useState("");
const [validationType, setValidationType] = useState<"warning" | "error">("warning");

<FileUploader
  validationMessage={validationMessage}
  validationType={validationType}
  ...
/>
```

---

## 📋 Pre-Deployment Checklist

Before merging any tool page:

1. **Visual**
   - [ ] Upload area has pink dashed border
   - [ ] Icon is circular with gradient
   - [ ] Text follows standard format
   - [ ] Colors match reference pages

2. **Functional**
   - [ ] Drag and drop works
   - [ ] Click to browse works
   - [ ] File validation works
   - [ ] Inline errors display
   - [ ] Multiple files work (if enabled)

3. **Responsive**
   - [ ] Mobile layout correct
   - [ ] Tablet layout correct
   - [ ] Desktop layout correct
   - [ ] Ads show correctly on all devices

4. **Layout**
   - [ ] Uses ToolPageLayout
   - [ ] MobileStickyAd present
   - [ ] All SEO sections included
   - [ ] Related tools at bottom

5. **Code Quality**
   - [ ] No console errors
   - [ ] No TypeScript errors
   - [ ] FileUploader imported correctly
   - [ ] Props match examples
   - [ ] No custom styling added

---

## 🎓 Learning Resources

### Reference Pages (Perfect Examples)
1. `/pages/pdf-tools/organize-manage-pdf/MergePdfPage.tsx`
2. `/pages/pdf-tools/edit-annotate/RemoveWatermarkPage.tsx`

### Component Docs
1. `/components/tool/file-management/FileUploader.tsx`
2. `/components/tool/file-management/FileListWithValidation.tsx`
3. `/components/tool/layout/ToolPageLayout.tsx`

### Full Guides
1. `/docs/UPLOAD_STRUCTURE_STANDARDIZATION.md` - Complete guide
2. `/docs/VISUAL_UPLOAD_COMPARISON.md` - Visual reference
3. `/docs/QUICK_UPLOAD_REFERENCE.md` - This document

---

## 💡 Pro Tips

1. **Copy from Merge PDF**: It's the cleanest example
2. **Test on Mobile First**: Easier to catch layout issues
3. **Use Browser DevTools**: Check responsive breakpoints
4. **Verify Colors**: Use browser color picker
5. **Check Console**: Look for TypeScript errors
6. **Test Drag & Drop**: Don't just click to upload
7. **Try Invalid Files**: Make sure validation works
8. **Check All Ads**: Desktop side ads + mobile banner

---

## 📞 Need Help?

If something doesn't look right:

1. Compare side-by-side with Merge PDF page
2. Check browser console for errors
3. Verify all imports are correct
4. Make sure props match examples
5. Review visual comparison doc
6. Check that you're using ToolPageLayout

**Remember: Your upload section should be IDENTICAL to Merge PDF and Remove Watermark pages!**

---

**Last Updated**: December 2, 2025  
**Version**: 1.0  
**Status**: Standard for all 200+ tools ✅
