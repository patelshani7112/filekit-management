import { LucideIcon } from "lucide-react";
import { Card } from "../../ui/card";
import { useState, useEffect } from "react";

export interface WhyChooseFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string; // e.g., "from-orange-400 to-orange-500"
}

interface WhyChooseSectionProps {
  title?: string;
  subtitle?: string;
  features: WhyChooseFeature[];
  introText?: string;
}

export function WhyChooseSection({
  title = "Why Choose WorkflowPro?",
  subtitle = "The most powerful and user-friendly PDF merger available online",
  features,
  introText,
}: WhyChooseSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-slide for mobile devices
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [features.length]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl text-[#ec4899] mb-2">{title}</h2>
          {/* Subtitle - Show on mobile too */}
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-2">
            {subtitle}
          </p>
          {introText && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl mx-auto mt-3">
              {introText}
            </p>
          )}
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-5 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.iconBgColor} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mobile Carousel - Visible only on mobile */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card
                      className="p-6 text-center border-2 bg-white shadow-lg"
                    >
                      {/* Icon - Centered on mobile */}
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.iconBgColor} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="mb-3">{feature.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'bg-[#ec4899] w-6' 
                    : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}