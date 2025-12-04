/**
 * EditorLayout Component
 * 
 * Complete layout wrapper for PDF editing interfaces
 * Combines toolbar and content area
 * 
 * Usage:
 * <EditorLayout
 *   toolbar={<EditorToolbar ... />}
 *   mobileFooter={<MobileFooter ... />}
 * >
 *   <EditorPageGrid pages={pages} ... />
 * </EditorLayout>
 */

interface EditorLayoutProps {
  // Toolbar (required)
  toolbar: React.ReactNode;
  
  // Main content (children)
  children: React.ReactNode;
  
  // Optional: Mobile sticky footer
  mobileFooter?: React.ReactNode;
  
  // Optional: Custom background
  backgroundColor?: string;
  
  // Optional: Custom padding
  padding?: string;
  
  // Optional: Max width container
  maxWidth?: string;
}

export function EditorLayout({
  toolbar,
  children,
  mobileFooter,
  backgroundColor = "bg-gray-50",
  padding = "p-4 sm:p-6 lg:p-8",
  maxWidth = "max-w-[1600px]",
}: EditorLayoutProps) {
  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      {/* Toolbar */}
      {toolbar}

      {/* Main content */}
      <div className={`${padding} mx-auto ${maxWidth} pb-20 md:pb-8`}>
        {children}
      </div>

      {/* Mobile sticky footer (optional) */}
      {mobileFooter && (
        <div className="md:hidden">
          {mobileFooter}
        </div>
      )}
    </div>
  );
}
