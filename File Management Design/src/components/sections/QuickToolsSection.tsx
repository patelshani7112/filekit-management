import { Signature, Unlock, ScanText, Archive, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import { getToolConfigByName } from "../../lib/config/toolConfigs";
import { ToolConfig } from "../dialogs/FileUploadDialog";

const quickTools = [
  { 
    icon: Signature, 
    name: "Sign PDF", 
    color: "text-purple-500 bg-purple-100",
    baseAnimation: "animate-[sign-draw_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[sign-draw_0.8s_ease-in-out_infinite]",
  },
  { 
    icon: Unlock, 
    name: "Unlock / Protect PDF", 
    color: "text-green-500 bg-green-100",
    baseAnimation: "animate-[lock-secure_2.5s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]",
  },
  { 
    icon: ScanText, 
    name: "OCR PDF", 
    color: "text-blue-500 bg-blue-100",
    baseAnimation: "animate-[scan-move_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[scan-move_0.8s_ease-in-out_infinite]",
  },
  { 
    icon: Archive, 
    name: "ZIP / Unzip Files", 
    color: "text-orange-500 bg-orange-100",
    baseAnimation: "animate-[compress-squeeze_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[compress-squeeze_0.8s_ease-in-out_infinite]",
  },
];

interface QuickToolsSectionProps {
  onToolClick: (toolConfig: ToolConfig) => void;
}

export function QuickToolsSection({ onToolClick }: QuickToolsSectionProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="mb-1 text-2xl sm:text-3xl md:text-4xl">Quick Tools</h2>
            <p className="text-muted-foreground">
              Essential utilities for everyday tasks
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.name}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 border-2 hover:border-primary/30"
                  onClick={() => {
                    const config = getToolConfigByName(tool.name);
                    if (config) onToolClick(config);
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${tool.baseAnimation} ${tool.hoverAnimation}`} />
                    </div>
                    <h4 className="text-sm">{tool.name.replace(" / Unzip Files", "").replace(" / Protect PDF", "")}</h4>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* SEO Text */}
          <div className="hidden md:block text-center mt-8 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access essential one-click tools like Sign PDF, Unlock PDF, Protect PDF, OCR PDF (Text Extraction), and ZIP/Unzip utilities. These fast tools help you complete common daily tasks in seconds with no complexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}