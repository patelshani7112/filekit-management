interface AdPlaceholderProps {
  width?: number;
  height?: number;
  position?: "left" | "right";
}

export function AdPlaceholder({ width = 160, height = 600, position = "left" }: AdPlaceholderProps) {
  return (
    <div
      className="hidden lg:block bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px` }}
    >
      {/* Google AdSense Code - Replace with your actual ad code */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      
      {/* Placeholder text - Remove when using real ads */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center text-gray-400 space-y-2">
          <p className="text-xs">Google AdSense</p>
          <p className="text-xs">{width} x {height}</p>
          <p className="text-xs capitalize">{position} Side</p>
        </div>
      </div>
    </div>
  );
}
