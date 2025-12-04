# PDF Editor Layout Components

Reusable layout system for PDF editing interfaces (Organize PDF, Rotate PDF, Delete Pages, Extract Pages, etc.)

## 📁 Components

### 1. **EditorLayout**
Main container that wraps the entire editing interface.

### 2. **EditorToolbar**
Sticky toolbar with navigation, actions, and save button.

### 3. **EditorPageGrid**
Responsive grid displaying PDF pages with selection and actions.

---

## 🚀 Quick Start

### Basic Usage

```tsx
import { 
  EditorLayout, 
  EditorToolbar, 
  EditorPageGrid 
} from "../../../components/tool/pdf-editor";
import { Download, RotateCw, Trash2 } from "lucide-react";

function MyPdfTool() {
  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          onBack={() => setStep("upload")}
          actionGroups={[
            {
              id: "actions",
              actions: [
                { id: "rotate", label: "Rotate", icon: RotateCw, onClick: handleRotate },
                { id: "delete", label: "Delete", icon: Trash2, onClick: handleDelete, variant: "destructive" }
              ]
            }
          ]}
          primaryAction={{
            label: "Save PDF",
            icon: Download,
            onClick: handleSave
          }}
        />
      }
    >
      <EditorPageGrid
        pages={pages}
        selectedPageIds={selectedPages}
        onSelectionChange={setSelectedPages}
        pageActions={[
          { id: "rotate", icon: RotateCw, label: "Rotate", onClick: handleRotate },
          { id: "delete", icon: Trash2, label: "Delete", onClick: handleDelete, variant: "destructive" }
        ]}
      />
    </EditorLayout>
  );
}
```

---

## 📖 Component APIs

### EditorLayout Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `toolbar` | `ReactNode` | ✅ Yes | - | Toolbar component |
| `children` | `ReactNode` | ✅ Yes | - | Main content (usually EditorPageGrid) |
| `mobileFooter` | `ReactNode` | No | - | Mobile sticky footer (usually save button) |
| `backgroundColor` | `string` | No | `"bg-gray-50"` | Background color class |
| `padding` | `string` | No | `"p-4 sm:p-6 lg:p-8"` | Padding classes |
| `maxWidth` | `string` | No | `"max-w-[1600px]"` | Max width class |

---

### EditorToolbar Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onBack` | `() => void` | ✅ Yes | - | Back button handler |
| `backLabel` | `string` | No | `"Back to Upload"` | Back button text |
| `actions` | `ToolbarAction[]` | No | `[]` | Flat array of toolbar actions |
| `actionGroups` | `ToolbarActionGroup[]` | No | `[]` | Grouped toolbar actions (with separators) |
| `primaryAction` | `PrimaryAction` | No | - | Main action button (right side) |
| `middleContent` | `ReactNode` | No | - | Custom content in toolbar center |
| `statusText` | `string` | No | - | Status text (e.g., "3 of 10 selected") |

**ToolbarAction Interface:**
```tsx
interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  onClick: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline";
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  hideOnMobile?: boolean;
}
```

**ToolbarActionGroup Interface:**
```tsx
interface ToolbarActionGroup {
  id: string;
  actions: ToolbarAction[];
}
```

---

### EditorPageGrid Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `pages` | `PageInfo[]` | ✅ Yes | - | Array of page data |
| `selectedPageIds` | `string[]` | No | `[]` | Selected page IDs |
| `onSelectionChange` | `(ids: string[]) => void` | No | - | Selection change handler |
| `multiSelect` | `boolean` | No | `true` | Enable multi-select (Ctrl/Shift+Click) |
| `pageActions` | `PageAction[]` | No | `[]` | Actions shown on each page card |
| `onReorder` | `(from: number, to: number) => void` | No | - | Drag-drop reorder handler |
| `showReorderHandle` | `boolean` | No | `false` | Show drag handle on pages |
| `columns` | `GridColumns` | No | `{sm:2, md:3, lg:5, xl:6}` | Responsive column config |
| `onPageClick` | `(id: string, e: MouseEvent) => void` | No | - | Custom page click handler |
| `renderPageOverlay` | `(page: PageInfo) => ReactNode` | No | - | Custom overlay on page |
| `renderPageFooter` | `(page: PageInfo) => ReactNode` | No | - | Custom footer in page card |
| `emptyState` | `ReactNode` | No | - | Empty state UI |

**PageInfo Interface:**
```tsx
interface PageInfo {
  id: string;
  thumbnail: string;
  pageNumber: number;
  fileName?: string;
  rotation?: number;
  isBlank?: boolean;
  metadata?: Record<string, any>;
}
```

**PageAction Interface:**
```tsx
interface PageAction {
  id: string;
  icon: React.ComponentType;
  label: string;
  onClick: (pageId: string) => void;
  variant?: "default" | "destructive" | "ghost";
  showAlways?: boolean;  // Show without hover
}
```

---

## 💡 Usage Examples

### Example 1: Simple Rotate PDF Tool

```tsx
import { EditorLayout, EditorToolbar, EditorPageGrid } from "../../../components/tool/pdf-editor";
import { RotateCw, RotateCcw, Download } from "lucide-react";

function RotatePdfTool() {
  const [pages, setPages] = useState<PageInfo[]>([...]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  
  const handleRotateLeft = () => {
    // Rotate selected pages -90 degrees
  };
  
  const handleRotateRight = () => {
    // Rotate selected pages +90 degrees
  };
  
  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          onBack={() => setStep("upload")}
          backLabel="Back to Upload"
          actions={[
            { 
              id: "rotate-left", 
              label: "Rotate Left", 
              icon: RotateCcw, 
              onClick: handleRotateLeft,
              disabled: selectedPages.length === 0 
            },
            { 
              id: "rotate-right", 
              label: "Rotate Right", 
              icon: RotateCw, 
              onClick: handleRotateRight,
              disabled: selectedPages.length === 0 
            },
          ]}
          primaryAction={{
            label: "Save PDF",
            icon: Download,
            onClick: handleSave
          }}
        />
      }
    >
      <EditorPageGrid
        pages={pages}
        selectedPageIds={selectedPages}
        onSelectionChange={setSelectedPages}
        pageActions={[
          { 
            id: "rotate", 
            icon: RotateCw, 
            label: "Rotate Right", 
            onClick: (pageId) => rotatePage(pageId, 90) 
          }
        ]}
      />
    </EditorLayout>
  );
}
```

### Example 2: Delete Pages Tool

```tsx
function DeletePagesTool() {
  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          onBack={() => setStep("upload")}
          actions={[
            { 
              id: "select-all", 
              label: "Select All", 
              icon: Check, 
              onClick: () => setSelectedPages(pages.map(p => p.id)) 
            },
            { 
              id: "delete", 
              label: "Delete Selected", 
              icon: Trash2, 
              onClick: handleDelete,
              disabled: selectedPages.length === 0,
              variant: "destructive"
            },
          ]}
          primaryAction={{
            label: "Save PDF",
            icon: Download,
            onClick: handleSave,
            disabled: pages.length === 0
          }}
          statusText={`${selectedPages.length} page(s) marked for deletion`}
        />
      }
    >
      <EditorPageGrid
        pages={pages}
        selectedPageIds={selectedPages}
        onSelectionChange={setSelectedPages}
        pageActions={[
          { 
            id: "delete", 
            icon: Trash2, 
            label: "Delete", 
            onClick: (pageId) => deletePage(pageId),
            variant: "destructive"
          }
        ]}
      />
    </EditorLayout>
  );
}
```

### Example 3: Advanced Organize PDF (with grouped actions)

```tsx
function OrganizePdfTool() {
  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          onBack={() => setStep("upload")}
          actionGroups={[
            {
              id: "selection",
              actions: [
                { id: "select-all", label: "Select All", icon: Check, onClick: handleSelectAll },
                { id: "deselect", label: "Deselect", icon: X, onClick: handleDeselect }
              ]
            },
            {
              id: "rotation",
              actions: [
                { id: "rotate-left", label: "Rotate Left", icon: RotateCcw, onClick: handleRotateLeft },
                { id: "rotate-right", label: "Rotate Right", icon: RotateCw, onClick: handleRotateRight }
              ]
            },
            {
              id: "editing",
              actions: [
                { id: "duplicate", label: "Duplicate", icon: Copy, onClick: handleDuplicate },
                { id: "delete", label: "Delete", icon: Trash2, onClick: handleDelete, variant: "destructive" }
              ]
            },
            {
              id: "advanced",
              actions: [
                { id: "shuffle", label: "Shuffle", icon: Shuffle, onClick: handleShuffle },
                { id: "reverse", label: "Reverse", icon: ArrowUpDown, onClick: handleReverse }
              ]
            }
          ]}
          primaryAction={{
            label: "Save PDF",
            icon: Download,
            onClick: handleSave
          }}
        />
      }
    >
      <EditorPageGrid
        pages={pages}
        selectedPageIds={selectedPages}
        onSelectionChange={setSelectedPages}
        onReorder={handleReorder}
        showReorderHandle={true}
        pageActions={[
          { id: "rotate", icon: RotateCw, label: "Rotate", onClick: handlePageRotate },
          { id: "duplicate", icon: Copy, label: "Duplicate", onClick: handlePageDuplicate },
          { id: "delete", icon: Trash2, label: "Delete", onClick: handlePageDelete, variant: "destructive" }
        ]}
      />
    </EditorLayout>
  );
}
```

### Example 4: With Mobile Footer

```tsx
function MyPdfTool() {
  return (
    <EditorLayout
      toolbar={<EditorToolbar ... />}
      mobileFooter={
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12"
            size="lg"
          >
            Save PDF
            <Download className="w-5 h-5 ml-2" />
          </Button>
        </div>
      }
    >
      <EditorPageGrid ... />
    </EditorLayout>
  );
}
```

---

## 🎨 Responsive Behavior

### Desktop (md and up)
- Full toolbar with all actions visible
- Action labels show on lg+ screens
- Grid: 3-6 columns based on screen size
- Hover effects on page cards

### Mobile (< md)
- Compact toolbar with dropdown menu
- Actions collapsed into "⋮" menu
- Grid: 2 columns
- Touch-friendly buttons
- Optional sticky footer for primary action

---

## ✅ Features

- ✅ **Responsive Layout**: Adapts to mobile, tablet, and desktop
- ✅ **Multi-Select**: Ctrl+Click, Shift+Click support
- ✅ **Drag & Drop**: Reorder pages with visual feedback
- ✅ **Grouped Actions**: Organize toolbar actions with separators
- ✅ **Page Actions**: Per-page actions (rotate, delete, etc.)
- ✅ **Selection State**: Visual feedback for selected pages
- ✅ **Mobile Menu**: Collapsible actions menu on mobile
- ✅ **Sticky Toolbar**: Always visible while scrolling
- ✅ **Empty State**: Customizable empty state UI
- ✅ **Custom Overlays**: Add custom content to page cards

---

## 🔧 Customization

### Custom Grid Columns
```tsx
<EditorPageGrid
  columns={{
    sm: 2,   // Mobile: 2 columns
    md: 4,   // Tablet: 4 columns
    lg: 6,   // Desktop: 6 columns
    xl: 8    // Large: 8 columns
  }}
/>
```

### Custom Page Overlay
```tsx
<EditorPageGrid
  renderPageOverlay={(page) => (
    <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs">
      {page.isBlank ? "Blank" : "Content"}
    </div>
  )}
/>
```

### Custom Page Footer
```tsx
<EditorPageGrid
  renderPageFooter={(page) => (
    <div className="text-xs text-gray-500 mt-1">
      Size: {page.metadata?.width} x {page.metadata?.height}
    </div>
  )}
/>
```

---

## 📦 File Structure

```
/components/tool/pdf-editor/
├── EditorLayout.tsx          # Main layout wrapper
├── EditorToolbar.tsx         # Sticky toolbar component
├── EditorPageGrid.tsx        # Page grid with selection
├── EditorLayoutExample.tsx   # Full working example
├── index.ts                  # Barrel exports
└── README.md                 # This file
```

---

## 🚀 Migration Guide

### Before (Inline Layout)
```tsx
function MyTool() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b">
        {/* Custom toolbar code */}
      </div>
      <div className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {/* Custom page grid code */}
        </div>
      </div>
    </div>
  );
}
```

### After (Using EditorLayout)
```tsx
import { EditorLayout, EditorToolbar, EditorPageGrid } from "../../../components/tool/pdf-editor";

function MyTool() {
  return (
    <EditorLayout
      toolbar={<EditorToolbar ... />}
    >
      <EditorPageGrid ... />
    </EditorLayout>
  );
}
```

---

## 📝 Notes

- All components are fully typed with TypeScript
- Mobile-first responsive design
- Follows WorkflowPro design system (purple gradient theme)
- Optimized for performance with React.memo where appropriate
- Accessible with proper ARIA labels and keyboard navigation

---

## 🤝 Contributing

When adding new features to the PDF Editor Layout:
1. Keep components generic and reusable
2. Follow existing naming conventions
3. Update TypeScript interfaces
4. Add examples to this README
5. Test on mobile, tablet, and desktop
