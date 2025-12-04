# DottedButton Component Usage Guide

## 📋 Overview

The `DottedButton` is a reusable UI component for additive actions throughout WorkflowPro. It features a distinctive dotted border that becomes solid and fills with color on hover.

**Design Pattern:**
- **Default:** Transparent background with dotted/dashed border and colored text
- **Hover:** Filled with color, solid border, white text
- **Visual Effect:** Creates an engaging "upgrade" transition on hover

---

## 🎨 Visual Design

```
DEFAULT STATE:               HOVER STATE:
┌ ─ ─ ─ ─ ─ ─ ─ ┐           ┌──────────────┐
│  + Add Files  │      →    │  + Add Files │
└ ─ ─ ─ ─ ─ ─ ─ ┘           └──────────────┘
Dotted border               Solid border
Purple text                 Purple background
No background              White text
```

---

## 📦 Import

```tsx
import { DottedButton } from '@/components/ui/dotted-button';
```

---

## 🚀 Usage Examples

### **Basic Usage**

```tsx
<DottedButton onClick={handleClick}>
  Click Me
</DottedButton>
```

### **Add Files Button (Most Common)**

```tsx
import { Plus } from 'lucide-react';

<DottedButton onClick={handleAddFiles} size="sm">
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>
```

### **Different Sizes**

```tsx
// Small (most common for sidebars)
<DottedButton size="sm" onClick={...}>
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>

// Medium
<DottedButton size="md" onClick={...}>
  <Plus className="w-5 h-5" />
  Add Items
</DottedButton>

// Large (for prominent actions)
<DottedButton size="lg" onClick={...}>
  <Plus className="w-5 h-5" />
  Upload More
</DottedButton>
```

### **Different Variants**

```tsx
// Primary (purple) - DEFAULT
<DottedButton variant="primary" onClick={...}>
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>

// Secondary (gray) - for less prominent actions
<DottedButton variant="secondary" onClick={...}>
  <Plus className="w-4 h-4" />
  Add Optional
</DottedButton>

// Success (green) - for positive additions
<DottedButton variant="success" onClick={...}>
  <Plus className="w-4 h-4" />
  Add to Favorites
</DottedButton>
```

### **Disabled State**

```tsx
<DottedButton 
  onClick={handleAdd} 
  disabled={maxReached || isProcessing}
>
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>
```

### **With Different Icons**

```tsx
import { Upload, Plus, FolderPlus, FilePlus } from 'lucide-react';

// Upload files
<DottedButton onClick={handleUpload}>
  <Upload className="w-4 h-4" />
  Upload Files
</DottedButton>

// Add folder
<DottedButton onClick={handleAddFolder}>
  <FolderPlus className="w-4 h-4" />
  Add Folder
</DottedButton>

// Create new
<DottedButton onClick={handleNew}>
  <FilePlus className="w-4 h-4" />
  New Document
</DottedButton>
```

---

## 🎯 Common Use Cases

### **1. Sidebar Actions**

```tsx
// Merge PDF Sidebar
<div className="flex items-center justify-between">
  <h2 className="text-xl">Merge Settings</h2>
  <DottedButton onClick={handleAddFiles} size="sm">
    <Plus className="w-4 h-4" />
    Add Files
  </DottedButton>
</div>
```

### **2. Add More Content**

```tsx
// Add more pages
<DottedButton onClick={addMorePages} size="md">
  <Plus className="w-5 h-5" />
  Add More Pages
</DottedButton>

// Add another section
<DottedButton onClick={addSection}>
  <Plus className="w-4 h-4" />
  Add Section
</DottedButton>
```

### **3. Upload Areas**

```tsx
// Empty state with upload prompt
<div className="text-center py-8">
  <p className="text-gray-600 mb-4">No files uploaded yet</p>
  <DottedButton onClick={openFileDialog} size="lg">
    <Upload className="w-5 h-5" />
    Upload Your First File
  </DottedButton>
</div>
```

### **4. List Actions**

```tsx
// At the end of a list
<div className="space-y-2">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
  
  <DottedButton onClick={addItem} className="w-full">
    <Plus className="w-4 h-4" />
    Add Another Item
  </DottedButton>
</div>
```

---

## 📐 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary'` \| `'secondary'` \| `'success'` | `'primary'` | Color scheme of the button |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'sm'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Button content (text, icons, etc.) |
| `...props` | `HTMLButtonAttributes` | - | All standard button props |

---

## 🎨 Size Specifications

| Size | Padding | Text Size | Border Radius | Use Case |
|------|---------|-----------|---------------|----------|
| `sm` | `px-3 py-1.5` | `text-sm` | `rounded-lg` | Sidebars, compact UI |
| `md` | `px-4 py-2` | `text-base` | `rounded-lg` | Standard additive actions |
| `lg` | `px-6 py-2.5` | `text-base` | `rounded-xl` | Prominent upload/add actions |

---

## 🎨 Variant Color Schemes

| Variant | Border Color | Text Color | Hover Background | Hover Text |
|---------|--------------|------------|------------------|------------|
| `primary` | Purple 600 (dotted) | Purple 600 | Purple 600 (solid) | White |
| `secondary` | Gray 400 (dotted) | Gray 600 | Gray 600 (solid) | White |
| `success` | Green 500 (dotted) | Green 500 | Green 500 (solid) | White |

---

## 🎨 Border Animation

The button features a **smooth transition** from dotted to solid border:

- **Default:** `border-dashed` (dotted/dashed appearance)
- **Hover:** `border-solid` (solid line appearance)
- **Transition:** `duration-200` (smooth 200ms animation)

This creates a subtle but noticeable "upgrade" effect when users hover.

---

## ⚡ Performance Notes

- Uses CSS transitions for smooth hover effects
- No JavaScript animations
- Lightweight component (~1KB)
- Fully accessible (keyboard navigation, focus states)

---

## ♿ Accessibility

The component includes:
- ✅ Keyboard navigation support
- ✅ Focus ring indicators
- ✅ Proper disabled state handling
- ✅ Screen reader friendly
- ✅ ARIA-compliant

---

## 🎯 When to Use

**Use DottedButton when:**
- ✅ You need an "add more" or "upload more" action
- ✅ You want to visually distinguish additive actions
- ✅ You need a button that feels inviting and non-intrusive
- ✅ You're creating upload/input areas
- ✅ You want to encourage user interaction

**Use OutlineButton when:**
- ❌ You need standard navigation (back, continue)
- ❌ You need destructive actions (delete)
- ❌ You need a solid outlined button

**Use standard Button when:**
- ❌ You need a filled primary action button
- ❌ You need ghost buttons

---

## 🔗 Related Components

- `OutlineButton` - Solid outline buttons for navigation
- `Button` - Standard filled/ghost buttons
- `MergePdfSidebar` - Uses DottedButton for "Add Files"

---

## 📝 Best Practices

1. **Icon Sizing**
   - Use `w-4 h-4` for `size="sm"`
   - Use `w-5 h-5` for `size="md"` and `size="lg"`

2. **Icon Placement**
   - Always use leading icons (+ Add, ↑ Upload)
   - Use Plus icon for most "add" actions
   - Use Upload icon for file uploads

3. **Variant Selection**
   - `primary` for most additive actions (default)
   - `secondary` for optional/less important additions
   - `success` for positive additions (favorites, collections)

4. **Button Text**
   - Keep it short and action-oriented
   - "Add Files", "Upload More", "Add Another"
   - Avoid long descriptions

5. **Disabled State**
   - Show disabled state when maximum items reached
   - Provide tooltips explaining why it's disabled
   - Don't hide the button, just disable it

---

## 💡 Examples in Context

### **Sidebar Header**

```tsx
<div className="flex items-center justify-between">
  <h2 className="text-xl">Merge Settings</h2>
  <DottedButton onClick={handleAddFiles} size="sm">
    <Plus className="w-4 h-4" />
    Add Files
  </DottedButton>
</div>
```

### **Empty State**

```tsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  <h3 className="text-lg mb-2">No files uploaded</h3>
  <p className="text-gray-600 mb-6">
    Upload PDF files to get started
  </p>
  <DottedButton onClick={openFileDialog} size="lg">
    <Upload className="w-5 h-5" />
    Upload Files
  </DottedButton>
</div>
```

### **List Footer**

```tsx
<div className="space-y-2">
  {files.map(file => (
    <FileItem key={file.id} {...file} />
  ))}
  
  <DottedButton onClick={addMore} className="w-full justify-center">
    <Plus className="w-4 h-4" />
    Add More Files
  </DottedButton>
</div>
```

### **Inline Addition**

```tsx
<div className="flex items-center gap-2">
  <span className="text-sm text-gray-600">3 files selected</span>
  <DottedButton onClick={selectMore} size="sm">
    <Plus className="w-3 h-3" />
    Add More
  </DottedButton>
</div>
```

---

## 🚀 Migration Guide

If you have existing "Add Files" or similar buttons, replace them with DottedButton:

**Before:**
```tsx
<Button
  onClick={handleAddFiles}
  className="border-2 border-dashed border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-transparent"
>
  <Plus className="w-4 h-4" />
  Add Files
</Button>
```

**After:**
```tsx
<DottedButton onClick={handleAddFiles} size="sm">
  <Plus className="w-4 h-4" />
  Add Files
</DottedButton>
```

Much cleaner and consistent! 🎉

---

## 🎨 Design Philosophy

The dotted border serves a specific UX purpose:

1. **Visual Distinction** - Stands out from solid buttons
2. **Invitation** - The dotted style feels more inviting/less formal
3. **Action Clarity** - Clearly communicates "add something here"
4. **Hover Reward** - The transition to solid/filled provides satisfying feedback

This makes it perfect for actions that:
- Add more content
- Upload additional files
- Create new items
- Expand collections

The design communicates: "This is optional, but you can add more if you want!" 🎯
