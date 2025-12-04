# OutlineButton Component Usage Guide

## 📋 Overview

The `OutlineButton` is a reusable UI component that provides consistent styling for all outline-style buttons throughout WorkflowPro.

**Design Pattern:**
- **Default:** Transparent background with colored border and text
- **Hover:** Filled with the border color, white text
- **Smooth transition** between states

---

## 🎨 Visual Design

```
DEFAULT STATE:           HOVER STATE:
┌──────────────┐        ┌──────────────┐
│  ← Button    │   →    │  ← Button    │
│   (outline)  │        │   (filled)   │
└──────────────┘        └──────────────┘
Purple border           Purple background
Purple text             White text
```

---

## 📦 Import

```tsx
import { OutlineButton } from '@/components/ui/outline-button';
```

---

## 🚀 Usage Examples

### **Basic Usage**

```tsx
<OutlineButton onClick={handleClick}>
  Click Me
</OutlineButton>
```

### **With Icon**

```tsx
import { ArrowLeft, Plus, Save } from 'lucide-react';

// Back button
<OutlineButton onClick={handleBack}>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>

// Add button
<OutlineButton onClick={handleAdd}>
  <Plus className="w-4 h-4" />
  Add Files
</OutlineButton>

// Save button
<OutlineButton onClick={handleSave}>
  <Save className="w-4 h-4" />
  Save Changes
</OutlineButton>
```

### **Different Sizes**

```tsx
// Small (for compact UI, sidebars)
<OutlineButton size="sm" onClick={...}>
  <Plus className="w-4 h-4" />
  Add Files
</OutlineButton>

// Medium (default)
<OutlineButton size="md" onClick={...}>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>

// Large (for prominent actions)
<OutlineButton size="lg" onClick={...}>
  <Check className="w-5 h-5" />
  Confirm Selection
</OutlineButton>
```

### **Different Variants**

```tsx
// Primary (purple) - DEFAULT
<OutlineButton variant="primary" onClick={...}>
  Continue
</OutlineButton>

// Danger (red) - for destructive actions
<OutlineButton variant="danger" onClick={handleDelete}>
  <Trash2 className="w-4 h-4" />
  Delete All
</OutlineButton>

// Success (green) - for positive actions
<OutlineButton variant="success" onClick={handleComplete}>
  <Check className="w-4 h-4" />
  Mark Complete
</OutlineButton>
```

### **Disabled State**

```tsx
<OutlineButton 
  onClick={handleSubmit} 
  disabled={isProcessing || !isValid}
>
  Submit
</OutlineButton>
```

### **Full Width**

```tsx
<OutlineButton 
  onClick={handleAction}
  className="w-full"
>
  Full Width Button
</OutlineButton>
```

---

## 🎯 Common Use Cases

### **1. Navigation Buttons**

```tsx
// Back to previous page
<OutlineButton onClick={() => router.back()}>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>

// Go to next step
<OutlineButton onClick={handleNextStep}>
  Continue
  <ArrowRight className="w-5 h-5" />
</OutlineButton>
```

### **2. Add/Create Actions**

```tsx
// Add files
<OutlineButton onClick={openFileDialog}>
  <Plus className="w-4 h-4" />
  Add Files
</OutlineButton>

// Create new
<OutlineButton onClick={createNew}>
  <Plus className="w-4 h-4" />
  Create New Document
</OutlineButton>
```

### **3. Toolbar Actions**

```tsx
// Select all
<OutlineButton size="sm" onClick={selectAll}>
  Select All
</OutlineButton>

// Deselect all
<OutlineButton size="sm" onClick={deselectAll}>
  Deselect All
</OutlineButton>

// Invert selection
<OutlineButton size="sm" onClick={invertSelection}>
  Invert Selection
</OutlineButton>
```

### **4. Confirmation Dialogs**

```tsx
<div className="flex gap-3 justify-end">
  <OutlineButton onClick={handleCancel}>
    Cancel
  </OutlineButton>
  <OutlineButton variant="danger" onClick={handleConfirm}>
    Delete Permanently
  </OutlineButton>
</div>
```

---

## 📐 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary'` \| `'danger'` \| `'success'` | `'primary'` | Color scheme of the button |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Button content (text, icons, etc.) |
| `...props` | `HTMLButtonAttributes` | - | All standard button props |

---

## 🎨 Size Specifications

| Size | Padding | Text Size | Border Radius | Use Case |
|------|---------|-----------|---------------|----------|
| `sm` | `px-3 py-1.5` | `text-sm` | `rounded-lg` | Compact UI, sidebars, toolbars |
| `md` | `px-4 py-2` | `text-base` | `rounded-lg` | Standard buttons, forms |
| `lg` | `px-6 py-2.5` | `text-base` | `rounded-xl` | Prominent actions, hero buttons |

---

## 🎨 Variant Color Schemes

| Variant | Border Color | Text Color | Hover Background | Hover Text |
|---------|--------------|------------|------------------|------------|
| `primary` | Purple 600 | Purple 600 | Purple 600 | White |
| `danger` | Red 500 | Red 500 | Red 500 | White |
| `success` | Green 500 | Green 500 | Green 500 | White |

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

**Use OutlineButton when:**
- ✅ You need a secondary action (not the primary CTA)
- ✅ You want to emphasize an action without heavy visual weight
- ✅ You're creating navigation buttons
- ✅ You need a destructive action button (danger variant)
- ✅ You want consistent styling across the app

**Use standard Button when:**
- ❌ You need a filled primary action button
- ❌ You need ghost buttons
- ❌ You need link-style buttons

---

## 🔗 Related Components

- `Button` - Standard filled buttons
- `PageGrid` - Uses OutlineButton internally for actions
- `EditPageLayout` - Uses OutlineButton for "Back to Upload"
- `MergePdfSidebar` - Uses OutlineButton for "Add Files"

---

## 📝 Best Practices

1. **Icon Sizing**
   - Use `w-4 h-4` for `size="sm"`
   - Use `w-5 h-5` for `size="md"` and `size="lg"`

2. **Icon Placement**
   - Leading icons for navigation (← Back)
   - Leading icons for add actions (+ Add)
   - Trailing icons for next/forward (Next →)

3. **Variant Selection**
   - `primary` for most actions
   - `danger` only for destructive actions
   - `success` for confirmation/completion actions

4. **Disabled State**
   - Always provide visual feedback
   - Don't hide buttons, disable them instead
   - Provide tooltips explaining why it's disabled

5. **Loading State**
   - Use `disabled={isLoading}` during async operations
   - Show loading spinner inside button text

---

## 💡 Examples in Context

### **Edit Page Header**

```tsx
<div className="flex items-center justify-between">
  <OutlineButton onClick={handleBack} size="md">
    <ArrowLeft className="w-5 h-5" />
    Back to Upload
  </OutlineButton>
  
  <div className="text-sm text-gray-600">
    49 pages total • 59.34 MB
  </div>
</div>
```

### **Sidebar Header**

```tsx
<div className="flex items-center justify-between">
  <h2 className="text-xl">Merge Settings</h2>
  <OutlineButton onClick={handleAddFiles} size="sm">
    <Plus className="w-4 h-4" />
    Add Files
  </OutlineButton>
</div>
```

### **Action Toolbar**

```tsx
<div className="flex gap-2">
  <OutlineButton size="sm" onClick={selectAll}>
    Select All
  </OutlineButton>
  <OutlineButton size="sm" onClick={deselectAll}>
    Deselect All
  </OutlineButton>
  <OutlineButton size="sm" onClick={invertSelection}>
    Invert
  </OutlineButton>
</div>
```

---

## 🚀 Migration Guide

If you have existing buttons with custom styles, replace them with OutlineButton:

**Before:**
```tsx
<Button
  onClick={handleBack}
  className="bg-transparent hover:bg-purple-600 text-purple-600 hover:text-white border-2 border-purple-600 gap-2 px-6 py-5 text-base rounded-xl"
>
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</Button>
```

**After:**
```tsx
<OutlineButton onClick={handleBack} size="md">
  <ArrowLeft className="w-5 h-5" />
  Back to Upload
</OutlineButton>
```

Much cleaner! 🎉
