import { FileText, ImageIcon, Video, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

const conversions = [
  {
    icon: FileText,
    title: "PDF ↔ Documents",
    formats: ["PDF", "Word", "Excel", "PowerPoint"],
    color: "from-red-100 to-orange-100",
    iconColor: "text-red-500",
    baseAnimation: "animate-[rotate-convert_4s_linear_infinite]",
    hoverAnimation: "group-hover:animate-[rotate-convert_1.5s_linear_infinite]",
  },
  {
    icon: ImageIcon,
    title: "Images ↔ PDF",
    formats: ["JPG", "PNG", "WEBP", "PDF"],
    color: "from-purple-100 to-pink-100",
    iconColor: "text-purple-500",
    baseAnimation: "animate-[image-process_2.5s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[rotate-convert_1.5s_linear_infinite]",
  },
  {
    icon: Video,
    title: "Video ↔ Audio / GIF",
    formats: ["MP4", "MP3", "GIF", "WEBM"],
    color: "from-blue-100 to-cyan-100",
    iconColor: "text-blue-500",
    baseAnimation: "animate-[float-gentle_3s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[rotate-convert_1.5s_linear_infinite]",
  },
];

export function ConvertAnythingSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-slide for mobile devices
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % conversions.length);
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
      setCurrentSlide((prev) => (prev + 1) % conversions.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + conversions.length) % conversions.length);
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-secondary to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl">Convert Anything</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Support for all major file formats with instant conversion
            </p>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {conversions.map((conversion) => {
              const Icon = conversion.icon;
              return (
                <Card
                  key={conversion.title}
                  className={`group p-8 bg-gradient-to-br ${conversion.color} border-0 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-2`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 mb-4 ${conversion.iconColor}`}>
                      <Icon className={`w-full h-full ${conversion.baseAnimation} ${conversion.hoverAnimation}`} />
                    </div>
                    <h3 className="mb-6">{conversion.title}</h3>
                    
                    {/* Format Flow */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
                      {conversion.formats.map((format, idx) => (
                        <div key={format} className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-white rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                            <span className="text-xs">{format}</span>
                          </div>
                          {idx < conversion.formats.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:animate-[arrow-pulse_1s_ease-in-out_infinite] transition-colors" />
                          )}
                        </div>
                      ))}
                    </div>
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
                {conversions.map((conversion) => {
                  const Icon = conversion.icon;
                  return (
                    <div key={conversion.title} className="w-full flex-shrink-0 px-2">
                      <Card
                        className={`p-6 bg-gradient-to-br ${conversion.color} border-0 shadow-lg`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-14 h-14 mb-3 ${conversion.iconColor}`}>
                            <Icon className={`w-full h-full ${conversion.baseAnimation}`} />
                          </div>
                          <h3 className="mb-4 text-base">{conversion.title}</h3>
                          
                          {/* Format Flow */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
                            {conversion.formats.map((format, idx) => (
                              <div key={format} className="flex items-center gap-2">
                                <div className="px-2.5 py-1 bg-white rounded-lg shadow-sm">
                                  <span className="text-xs">{format}</span>
                                </div>
                                {idx < conversion.formats.length - 1 && (
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {conversions.map((_, idx) => (
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
              Convert any file format instantly. Transform PDFs into Word, Excel, or PowerPoint; convert images into PDF or other formats; and extract audio from videos. WorkflowPro supports cross-format conversion for all major document, image, and media types.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}