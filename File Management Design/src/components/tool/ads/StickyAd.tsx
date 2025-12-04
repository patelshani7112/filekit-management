/**
 * Sticky Ad Component
 * 
 * A sticky advertisement that stays visible during scroll
 * Perfect for displaying ads without disrupting the user experience
 */

interface StickyAdProps {
  position?: "left" | "right";
  className?: string;
}

export function StickyAd({ position = "right", className = "" }: StickyAdProps) {
  return (
    <div 
      className={`sticky top-20 hidden lg:block ${className}`}
    >
      <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-2 min-h-[250px]">
          <div className="text-xs text-gray-400 mb-2">Advertisement</div>
          <div className="w-full h-[200px] bg-gray-50 rounded flex items-center justify-center">
            <p className="text-sm text-gray-400">Ad Space 300x250</p>
          </div>
        </div>
      </div>
    </div>
  );
}
