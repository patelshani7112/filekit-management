# PDF Editor Layout - Quick Usage Guide

## 🎯 When to Use This Layout

Use the PDF Editor Layout components when building tools that need to:
- ✅ Display PDF pages in a grid
- ✅ Allow page selection (single or multi)
- ✅ Provide page-level actions (rotate, delete, duplicate, etc.)
- ✅ Show a toolbar with editing actions
- ✅ Support drag-and-drop reordering

**Perfect for:** Organize PDF, Rotate PDF, Delete Pages, Extract Pages, Crop PDF, Split PDF, etc.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Import Components
```tsx
import { 
  EditorLayout, 
  EditorToolbar, 
  EditorPageGrid,
  type PageInfo,
  type ToolbarAction,
  type PageAction
} from "../../../components/tool/pdf-editor";
```

### Step 2: Define Your Data & Actions
```tsx
// Your page data
const [pages, setPages] = useState<PageInfo[]>([
  { id: "1", thumbnail: "...", pageNumber: 1, fileName: "doc.pdf" },
  { id: "2", thumbnail: "...", pageNumber: 2, fileName: "doc.pdf" },
]);

// Selected pages
const [selectedPages, setSelectedPages] = useState<string[]>([]);

// Toolbar actions
const toolbarActions: ToolbarAction[] = [
  { id: "rotate", label: "Rotate", icon: RotateCw, onClick: handleRotate },
  { id: "delete", label: "Delete", icon: Trash2, onClick: handleDelete, variant: "destructive" }
];

// Page actions (shown on each card)
const pageActions: PageAction[] = [
  { id: "rotate", icon: RotateCw, label: "Rotate", onClick: (id) => rotatePage(id) },
];
```

### Step 3: Render Layout
```tsx
return (
  <EditorLayout
    toolbar={
      <EditorToolbar
        onBack={() => setStep("upload")}
        actions={toolbarActions}
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
      pageActions={pageActions}
    />
  </EditorLayout>
);
```

---

## 📋 Common Patterns

### Pattern 1: Simple Tool (2-3 Actions)
**Use Case:** Rotate PDF, Crop PDF

```tsx
<EditorToolbar
  onBack={handleBack}
  actions={[
    { id: "rotate", label: "Rotate", icon: RotateCw, onClick: handleRotate }
  ]}
  primaryAction={{ label: "Save", icon: Download, onClick: handleSave }}
/>
```

### Pattern 2: Complex Tool (Many Actions with Groups)
**Use Case:** Organize PDF (10+ actions)

```tsx
<EditorToolbar
  onBack={handleBack}
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
    // ... more groups
  ]}
  primaryAction={{ label: "Save PDF", icon: Download, onClick: handleSave }}
/>
```

### Pattern 3: With Drag-Drop Reordering
**Use Case:** Organize PDF, Merge PDF

```tsx
<EditorPageGrid
  pages={pages}
  onReorder={(fromIndex, toIndex) => {
    const newPages = [...pages];
    const [moved] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, moved);
    setPages(newPages);
  }}
  showReorderHandle={true}
/>
```

### Pattern 4: With Mobile Sticky Footer
**Use Case:** All tools (better mobile UX)

```tsx
<EditorLayout
  toolbar={<EditorToolbar ... />}
  mobileFooter={
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
      <Button onClick={handleSave} className="w-full">
        Save PDF
      </Button>
    </div>
  }
>
  <EditorPageGrid ... />
</EditorLayout>
```

---

## 🎨 Styling Tips

### Custom Grid Spacing
```tsx
<EditorPageGrid
  pages={pages}
  columns={{ sm: 2, md: 3, lg: 5, xl: 6 }}  // Default
  columns={{ sm: 1, md: 2, lg: 4, xl: 5 }}  // Larger cards
  columns={{ sm: 3, md: 4, lg: 6, xl: 8 }}  // Smaller cards
/>
```

### Custom Background
```tsx
<EditorLayout
  toolbar={<EditorToolbar ... />}
  backgroundColor="bg-white"           // White background
  backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"  // Gradient
>
  ...
</EditorLayout>
```

### Conditional Actions
```tsx
const toolbarActions: ToolbarAction[] = [
  {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    onClick: handleDelete,
    disabled: selectedPages.length === 0,  // Disable if nothing selected
    variant: "destructive"
  }
];
```

---

## ⚡ Advanced Features

### Custom Page Overlay
Show custom badges/labels on pages:
```tsx
<EditorPageGrid
  renderPageOverlay={(page) => (
    page.isBlank ? (
      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
        Blank
      </div>
    ) : null
  )}
/>
```

### Status Text in Toolbar
Show selection count or other info:
```tsx
<EditorToolbar
  statusText={`${selectedPages.length} of ${pages.length} selected`}
  statusText={`Total pages: ${pages.length}`}
  statusText={pages.length > 0 ? "Ready to save" : "No pages"}
/>
```

### Custom Page Click Handler
Override default selection behavior:
```tsx
<EditorPageGrid
  onPageClick={(pageId, event) => {
    // Custom logic (e.g., open preview modal)
    setPreviewPage(pageId);
  }}
/>
```

### Empty State
Show message when no pages:
```tsx
<EditorPageGrid
  pages={pages}
  emptyState={
    <div className="text-center p-8">
      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-600">No pages to display</p>
    </div>
  }
/>
```

---

## 🔄 Migration Checklist

Migrating existing PDF tool to use EditorLayout:

- [ ] Install/import EditorLayout components
- [ ] Extract toolbar code into EditorToolbar props
- [ ] Convert page grid to EditorPageGrid format
- [ ] Move page data to PageInfo[] format
- [ ] Convert action handlers to ToolbarAction[] format
- [ ] Add mobile footer if needed
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Test multi-select (Ctrl+Click, Shift+Click)
- [ ] Test drag-drop (if enabled)
- [ ] Remove old custom layout code

---

## 📱 Responsive Behavior

| Screen Size | Toolbar | Grid Columns | Actions |
|------------|---------|--------------|---------|
| **Mobile** (`< 768px`) | Compact with menu | 2 columns | In dropdown |
| **Tablet** (`768-1024px`) | Full toolbar | 3 columns | Icons only |
| **Desktop** (`1024-1280px`) | Full toolbar | 5 columns | Icons + labels |
| **Large** (`> 1280px`) | Full toolbar | 6 columns | Icons + labels |

---

## 🐛 Common Issues

### Issue: Actions not showing on mobile
**Solution:** Remove `hideOnMobile: true` or add them to mobile menu

### Issue: Pages too small/large
**Solution:** Adjust `columns` prop with custom values

### Issue: Selection not working
**Solution:** Ensure `onSelectionChange` is provided and updates state

### Issue: Drag-drop not working
**Solution:** Set `showReorderHandle={true}` and provide `onReorder` handler

---

## 📚 Full Example

See `EditorLayoutExample.tsx` for a complete working implementation.

---

## 🎓 Learning Resources

1. **EditorLayout.tsx** - Main layout wrapper
2. **EditorToolbar.tsx** - Toolbar implementation
3. **EditorPageGrid.tsx** - Grid implementation  
4. **EditorLayoutExample.tsx** - Full working example
5. **README.md** - Complete API documentation

---

## 💬 Need Help?

Check the example files:
- `/components/tool/pdf-editor/EditorLayoutExample.tsx` - Complete example
- `/components/tool/pdf-editor/README.md` - Full documentation
- `/pages/pdf-tools/organize-manage-pdf/OrganizePdfPage.tsx` - Real implementation

---

**Happy coding! 🚀**
