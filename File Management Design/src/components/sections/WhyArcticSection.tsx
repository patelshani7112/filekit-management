import { Zap, Lock, Grid3x3 } from "lucide-react";
import { Card } from "../ui/card";
import { siteConfig } from "../../lib/config/siteConfig";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Zap,
    title: "Fast & Offline",
    desc: "All conversions run locally in your browser. No server delays, no waiting.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Private",
    desc: "Your files never leave your device. No uploads, no data collection, complete privacy.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Grid3x3,
    title: "All-in-One",
    desc: "PDF, Image, Video, Audio, and more. Everything you need in one powerful platform.",
    color: "from-blue-500 to-purple-500",
  },
];

export function WhyArcticSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-slide for mobile devices
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
    <section className="py-12 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl">Why {siteConfig.name}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for privacy, speed, and simplicity — your files never leave your browser
            </p>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50 bg-white/80 backdrop-blur-sm"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
                    <Icon className="w-8 h-8 text-white animate-[float-gentle_3s_ease-in-out_infinite]" />
                  </div>
                  <h3 className="mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.desc}
                  </p>
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
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="w-full flex-shrink-0 px-2">
                      <Card
                        className="p-8 text-center border-2 bg-white/80 backdrop-blur-sm shadow-lg"
                      >
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white animate-[float-gentle_3s_ease-in-out_infinite]" />
                        </div>
                        <h3 className="mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground">
                          {feature.desc}
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* SEO Text */}
          <div className="hidden md:block text-center mt-8 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              WorkflowPro combines speed, privacy, and versatility. All conversions run directly in your browser, keeping your files secure and private. With no registration, no installation, and no limits, WorkflowPro is the easiest way to convert and manage files online.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}