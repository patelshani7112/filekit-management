/**
 * EditorLayout Usage Example
 * 
 * This example shows how to use the PDF Editor Layout components
 * to create a consistent editing interface like Organize PDF, Rotate PDF, etc.
 * 
 * Copy this pattern to any PDF editing tool page!
 */

import { useState } from "react";
import { 
  EditorLayout, 
  EditorToolbar, 
  EditorPageGrid,
  type ToolbarAction,
  type ToolbarActionGroup,
  type PageInfo,
  type PageAction
} from "./index";
import {
  Check, X, RotateCw, RotateCcw, Trash2, Copy, Download,
  ArrowUp, ArrowDown, Shuffle, Plus, Settings
} from "lucide-react";
import { Button } from "../../ui/button";

export function EditorLayoutExample() {
  const [pages, setPages] = useState<PageInfo[]>([
    { id: "1", thumbnail: "https://via.placeholder.com/300x400", pageNumber: 1, fileName: "document.pdf" },
    { id: "2", thumbnail: "https://via.placeholder.com/300x400", pageNumber: 2, fileName: "document.pdf" },
    { id: "3", thumbnail: "https://via.placeholder.com/300x400", pageNumber: 3, fileName: "document.pdf" },
  ]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

  // Handle back navigation
  const handleBack = () => {
    console.log("Back to upload");
  };

  // Define toolbar actions (OPTION 1: Flat array)
  const toolbarActionsFlat: ToolbarAction[] = [
    {
      id: "rotate-left",
      label: "Rotate Left",
      icon: RotateCcw,
      onClick: () => console.log("Rotate left"),
      disabled: selectedPageIds.length === 0,
    },
    {
      id: "rotate-right",
      label: "Rotate Right",
      icon: RotateCw,
      onClick: () => console.log("Rotate right"),
      disabled: selectedPageIds.length === 0,
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: Copy,
      onClick: () => console.log("Duplicate"),
      disabled: selectedPageIds.length === 0,
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      onClick: () => console.log("Delete"),
      disabled: selectedPageIds.length === 0,
      variant: "destructive",
    },
  ];

  // Define toolbar actions (OPTION 2: Grouped with separators)
  const toolbarActionGroups: ToolbarActionGroup[] = [
    {
      id: "page-actions",
      actions: [
        {
          id: "select-all",
          label: "Select All",
          icon: Check,
          onClick: () => setSelectedPageIds(pages.map(p => p.id)),
        },
        {
          id: "deselect",
          label: "Deselect",
          icon: X,
          onClick: () => setSelectedPageIds([]),
          disabled: selectedPageIds.length === 0,
        },
      ],
    },
    {
      id: "rotation",
      actions: [
        {
          id: "rotate-left",
          label: "Rotate Left",
          icon: RotateCcw,
          onClick: () => console.log("Rotate left"),
          disabled: selectedPageIds.length === 0,
        },
        {
          id: "rotate-right",
          label: "Rotate Right",
          icon: RotateCw,
          onClick: () => console.log("Rotate right"),
          disabled: selectedPageIds.length === 0,
        },
      ],
    },
    {
      id: "editing",
      actions: [
        {
          id: "duplicate",
          label: "Duplicate",
          icon: Copy,
          onClick: () => console.log("Duplicate"),
          disabled: selectedPageIds.length === 0,
        },
        {
          id: "delete",
          label: "Delete",
          icon: Trash2,
          onClick: () => console.log("Delete"),
          disabled: selectedPageIds.length === 0,
          variant: "destructive",
        },
      ],
    },
    {
      id: "advanced",
      actions: [
        {
          id: "shuffle",
          label: "Shuffle",
          icon: Shuffle,
          onClick: () => console.log("Shuffle"),
        },
        {
          id: "add-blank",
          label: "Add Blank",
          icon: Plus,
          onClick: () => console.log("Add blank"),
        },
      ],
    },
  ];

  // Define page actions (show on each page card)
  const pageActions: PageAction[] = [
    {
      id: "rotate",
      label: "Rotate",
      icon: RotateCw,
      onClick: (pageId) => console.log("Rotate page", pageId),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: Copy,
      onClick: (pageId) => console.log("Duplicate page", pageId),
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      onClick: (pageId) => console.log("Delete page", pageId),
      variant: "destructive",
    },
  ];

  // Handle reorder
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newPages = [...pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    setPages(newPages);
  };

  // Handle save
  const handleSave = () => {
    console.log("Save PDF");
  };

  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          onBack={handleBack}
          backLabel="Back to Upload"
          // OPTION 1: Use flat actions
          // actions={toolbarActionsFlat}
          // OPTION 2: Use grouped actions (recommended for many actions)
          actionGroups={toolbarActionGroups}
          primaryAction={{
            label: "Save PDF",
            icon: Download,
            onClick: handleSave,
            disabled: pages.length === 0,
          }}
          statusText={`${selectedPageIds.length} of ${pages.length} selected`}
        />
      }
      mobileFooter={
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 gap-2"
            size="lg"
          >
            Save PDF
            <Download className="w-5 h-5" />
          </Button>
        </div>
      }
    >
      {/* Page Grid */}
      <EditorPageGrid
        pages={pages}
        selectedPageIds={selectedPageIds}
        onSelectionChange={setSelectedPageIds}
        multiSelect={true}
        pageActions={pageActions}
        onReorder={handleReorder}
        showReorderHandle={true}
        columns={{ sm: 2, md: 3, lg: 5, xl: 6 }}
      />
    </EditorLayout>
  );
}
