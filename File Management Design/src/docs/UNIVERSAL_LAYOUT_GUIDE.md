# Universal Layout System Guide

## 📋 Overview

This guide shows how to use the universal layout system across all 200+ tool pages in WorkflowPro.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  [← Back to Upload]  20 pages total • 47.48 MB         │  ← Outside content
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│  LEFT SIDE (Universal)       │  RIGHT SIDE (Custom)     │
│  PageGrid Component          │  Tool-Specific Sidebar   │
│                              │                          │
│  • Same across all tools     │  • MergePdfSidebar       │
│  • Rotate, Copy, Delete      │  • SplitPdfSidebar       │
│  • Drag to reorder           │  • CompressPdfSidebar    │
│  • Click to preview          │  • RotatePdfSidebar      │
│  • Color badges              │  • etc...                │
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
```

---

## 🧩 Component Stack

### **1. EditPageLayout** (Wrapper)
- Handles overall 2-column layout
- Shows "Back to Upload" button
- Supports ads (optional)
- Full-width optimization

### **2. PageGrid** (Left Side - Universal)
- Displays page thumbnails
- Rotate, Copy, Delete actions
- Drag & drop reordering
- Click to preview
- Responsive grid

### **3. Tool Sidebars** (Right Side - Custom)
- `MergePdfSidebar` - For merge tools
- `SplitPdfSidebar` - For split tools
- `CompressPdfSidebar` - For compress tools
- Create more as needed!

### **4. Button Components** (UI Components)

#### **OutlineButton**
- Solid purple outline button style
- Used for "Back to Upload" navigation
- Hover effect (fills with purple)
- Three variants: primary, danger, success

#### **DottedButton** 
- Dotted purple border button style
- Used for "Add Files" and additive actions
- Hover effect (dotted → solid + filled)
- Perfect for upload/add actions

---

## 📖 Usage Examples

### **Example 1: Merge PDF Page**

```tsx
import { EditPageLayout } from '@/components/tool/layout/EditPageLayout';
import { PageGrid } from '@/components/tool/page-grid/PageGrid';
import { MergePdfSidebar } from '@/components/tool/sidebars/MergePdfSidebar';

export function MergePdfPage() {
  const [pdfPages, setPdfPages] = useState([...]);
  const [sourceFiles, setSourceFiles] = useState([...]);

  return (
    <EditPageLayout
      fullWidth={true}
      onBack={handleBackToUpload}
      totalPages={pdfPages.length}
      totalSize="47.48 MB"
      
      // RIGHT SIDE: Merge-specific settings
      sidebar={
        <MergePdfSidebar
          sourceFiles={sourceFiles}
          totalPages={pdfPages.length}
          totalSize="47.48 MB"
          outputFilename="merged.pdf"
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onOutputFilenameChange={setOutputFilename}
          onMerge={handleMerge}
          isProcessing={isProcessing}
        />
      }
    >
      {/* LEFT SIDE: Universal page grid */}
      <PageGrid
        pages={pdfPages}
        gridSize="medium"
        breakpoint="md"
        onReorder={handleReorderPages}
        onRotate={handleRotatePage}
        onCopy={handleDuplicatePage}
        onDelete={handleDeletePage}
        onPreview={setPreviewPage}
        showActions={{ rotate: true, copy: true, delete: true }}
        showBadges={true}
        draggable={true}
      />
    </EditPageLayout>
  );
}
```

---

### **Example 2: Split PDF Page**

```tsx
import { EditPageLayout } from '@/components/tool/layout/EditPageLayout';
import { PageGrid } from '@/components/tool/page-grid/PageGrid';
import { SplitPdfSidebar } from '@/components/tool/sidebars/SplitPdfSidebar';

export function SplitPdfPage() {
  const [pdfPages, setPdfPages] = useState([...]);
  const [splitMode, setSplitMode] = useState<'range' | 'every' | 'bookmarks' | 'pages'>('range');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  return (
    <EditPageLayout
      fullWidth={true}
      onBack={handleBackToUpload}
      totalPages={pdfPages.length}
      totalSize="12.5 MB"
      
      sidebar={
        <SplitPdfSidebar
          splitMode={splitMode}
          onSplitModeChange={setSplitMode}
          pageRanges={pageRanges}
          onPageRangesChange={setPageRanges}
          everyNPages={everyNPages}
          onEveryNPagesChange={setEveryNPages}
          selectedPages={selectedPages}
          totalPages={pdfPages.length}
          onSplit={handleSplit}
          isProcessing={isProcessing}
        />
      }
    >
      <PageGrid
        pages={pdfPages}
        gridSize="medium"
        onPreview={setPreviewPage}
        onSelect={(index) => {
          // Toggle selection for "pages" mode
          setSelectedPages(prev =>
            prev.includes(index)
              ? prev.filter(i => i !== index)
              : [...prev, index]
          );
        }}
        showActions={{ rotate: false, copy: false, delete: false }}
        showBadges={false}
        draggable={false}
        selectable={splitMode === 'pages'}
      />
    </EditPageLayout>
  );
}
```

---

### **Example 3: Compress PDF Page**

```tsx
import { EditPageLayout } from '@/components/tool/layout/EditPageLayout';
import { PageGrid } from '@/components/tool/page-grid/PageGrid';
import { CompressPdfSidebar } from '@/components/tool/sidebars/CompressPdfSidebar';

export function CompressPdfPage() {
  const [pdfPages, setPdfPages] = useState([...]);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium');

  return (
    <EditPageLayout
      fullWidth={true}
      onBack={handleBackToUpload}
      totalPages={pdfPages.length}
      totalSize="10.5 MB"
      
      sidebar={
        <CompressPdfSidebar
          compressionLevel={compressionLevel}
          onCompressionLevelChange={setCompressionLevel}
          originalSize="10.5 MB"
          estimatedSize="2.8 MB"
          onCompress={handleCompress}
          isProcessing={isProcessing}
        />
      }
    >
      <PageGrid
        pages={pdfPages}
        gridSize="large"
        onPreview={setPreviewPage}
        showActions={{ rotate: false, copy: false, delete: false }}
        showBadges={false}
        draggable={false}
      />
    </EditPageLayout>
  );
}
```

---

### **Example 4: Delete Pages Tool**

```tsx
import { EditPageLayout } from '@/components/tool/layout/EditPageLayout';
import { PageGrid } from '@/components/tool/page-grid/PageGrid';
import { Button } from '@/components/ui/button';

export function DeletePagesPage() {
  const [pdfPages, setPdfPages] = useState([...]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  // Custom sidebar for Delete Pages tool
  const DeletePagesSidebar = () => (
    <div className="space-y-6">
      <h2 className="text-xl">Delete Pages</h2>
      
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600">Selection Tools</h3>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSelectedPages(pdfPages.map((_, i) => i))}
        >
          Select All
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSelectedPages([])}
        >
          Deselect All
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const allIndices = pdfPages.map((_, i) => i);
            setSelectedPages(allIndices.filter(i => !selectedPages.includes(i)));
          }}
        >
          Invert Selection
        </Button>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-sm text-red-900">
          <strong>{selectedPages.length}</strong> page{selectedPages.length !== 1 ? 's' : ''} will be deleted
        </div>
      </div>
      
      <Button
        onClick={handleDelete}
        disabled={selectedPages.length === 0}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
      >
        Delete Selected Pages
      </Button>
    </div>
  );

  return (
    <EditPageLayout
      fullWidth={true}
      onBack={handleBackToUpload}
      totalPages={pdfPages.length}
      totalSize="8.2 MB"
      sidebar={<DeletePagesSidebar />}
    >
      <PageGrid
        pages={pdfPages.map((page, i) => ({
          ...page,
          selected: selectedPages.includes(i)
        }))}
        gridSize="medium"
        onSelect={(index) => {
          setSelectedPages(prev =>
            prev.includes(index)
              ? prev.filter(i => i !== index)
              : [...prev, index]
          );
        }}
        onPreview={setPreviewPage}
        showActions={{ rotate: false, copy: false, delete: false }}
        showBadges={false}
        draggable={false}
        selectable={true}
      />
    </EditPageLayout>
  );
}
```

---

## 🎨 PageGrid Customization

### **Grid Sizes**

```tsx
// Small thumbnails - More pages visible
<PageGrid gridSize="small" />   // 3-4-6-8-10-12 columns

// Medium thumbnails - Balanced (DEFAULT)
<PageGrid gridSize="medium" />  // 2-3-4-6-8-10 columns

// Large thumbnails - Better preview
<PageGrid gridSize="large" />   // 1-2-3-4-5-6 columns

// Extra large - Comparison view
<PageGrid gridSize="xlarge" />  // 1-2-2-3-4-5 columns
```

### **Action Buttons**

```tsx
// Show all actions
<PageGrid
  showActions={{ rotate: true, copy: true, delete: true }}
  onRotate={handleRotate}
  onCopy={handleCopy}
  onDelete={handleDelete}
/>

// Show only rotate
<PageGrid
  showActions={{ rotate: true, copy: false, delete: false }}
  onRotate={handleRotate}
/>

// Custom actions
<PageGrid
  showActions={{
    rotate: true,
    custom: [
      {
        icon: <Star className="w-3 h-3" />,
        label: "Mark as important",
        onClick: (index) => markImportant(index),
        className: "hover:bg-yellow-500 hover:text-white"
      }
    ]
  }}
/>

// No actions (view only)
<PageGrid
  showActions={{ rotate: false, copy: false, delete: false }}
/>
```

### **Features Toggle**

```tsx
<PageGrid
  draggable={true}      // Enable drag to reorder
  selectable={true}     // Enable click to select
  showBadges={true}     // Show source file badges
  onReorder={...}       // Required when draggable
  onSelect={...}        // Required when selectable
/>
```

---

## 🎯 Creating Custom Sidebars

For tools not covered by pre-built sidebars, create your own:

```tsx
// /components/tool/sidebars/YourToolSidebar.tsx
export function YourToolSidebar({
  // Your custom props
  onProcess,
  isProcessing,
}: YourToolSidebarProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl">Your Tool Settings</h2>
      
      {/* Your custom settings UI */}
      <div className="space-y-3">
        {/* ... */}
      </div>
      
      {/* Action button */}
      <Button
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
      >
        Process
      </Button>
    </div>
  );
}
```

Then use it:

```tsx
<EditPageLayout
  sidebar={<YourToolSidebar {...} />}
>
  <PageGrid {...} />
</EditPageLayout>
```

---

## 📱 Responsive Behavior

### **Mobile (< 768px)**
- Sidebar appears ABOVE page grid
- Single column layout
- Touch-friendly buttons

### **Tablet (768px - 1024px)**
- Side-by-side layout
- 3-4 columns grid

### **Desktop (> 1024px)**
- Full 2-column layout
- 6-10 columns grid
- Maximum space efficiency

---

## ✅ Benefits

1. **Consistency** - Same look and feel across all 200+ pages
2. **Maintainability** - Update one component, fix everywhere
3. **Flexibility** - Customize per-tool without duplicating code
4. **Performance** - Optimized responsive grids
5. **Developer Experience** - Easy to use, hard to misuse

---

## 🚀 Quick Start Checklist

- [ ] Import `EditPageLayout`
- [ ] Import `PageGrid`
- [ ] Import or create tool-specific sidebar
- [ ] Pass `fullWidth={true}` for optimal space
- [ ] Configure `showActions` based on tool needs
- [ ] Set appropriate `gridSize`
- [ ] Implement handlers (onRotate, onDelete, etc.)
- [ ] Add preview modal (optional)
- [ ] Test on mobile/tablet/desktop

---

## 📚 Component Reference

### **EditPageLayout Props**
- `fullWidth` - Use full viewport width (recommended: `true`)
- `onBack` - Back button handler
- `totalPages` - Total page count
- `totalSize` - Total file size (optional)
- `sidebar` - Right sidebar content (ReactNode)
- `children` - Left side content (PageGrid)

### **PageGrid Props**
- `pages` - Array of page objects
- `gridSize` - 'small' | 'medium' | 'large' | 'xlarge'
- `onReorder` - Drag & drop handler
- `onRotate` - Rotate button handler
- `onCopy` - Copy button handler
- `onDelete` - Delete button handler
- `onPreview` - Click to preview handler
- `onSelect` - Click to select handler
- `showActions` - Which action buttons to show
- `showBadges` - Show source file badges
- `draggable` - Enable drag & drop
- `selectable` - Enable selection mode

---

## 🎓 Best Practices

1. **Always use `fullWidth={true}`** for edit pages
2. **Choose appropriate grid size** based on tool purpose
3. **Hide unused actions** to reduce clutter
4. **Provide clear labels** in custom sidebars
5. **Show loading states** during processing
6. **Include file size info** when relevant
7. **Test on different screen sizes**
8. **Keep sidebars scrollable** for long settings

---

## 🔗 Related Files

- `/components/tool/layout/EditPageLayout.tsx`
- `/components/tool/page-grid/PageGrid.tsx`
- `/components/tool/sidebars/MergePdfSidebar.tsx`
- `/components/tool/sidebars/SplitPdfSidebar.tsx`
- `/components/tool/sidebars/CompressPdfSidebar.tsx`
- `/src/utils/gridUtils.ts`
