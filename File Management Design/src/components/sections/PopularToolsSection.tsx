import { FileText, Archive, Merge, Split, FileEdit, ImageIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { getToolConfigByName } from "../../lib/config/toolConfigs";
import { ToolConfig } from "../dialogs/FileUploadDialog";

const popularTools = [
  {
    icon: FileEdit,
    name: "Edit PDF",
    desc: "Add text, images, and annotations to your PDF",
    color: "from-red-400 to-orange-400",
    baseAnimation: "animate-[edit-writing_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]",
  },
  {
    icon: Archive,
    name: "Compress PDF",
    desc: "Reduce PDF file size without quality loss",
    color: "from-blue-400 to-cyan-400",
    baseAnimation: "animate-[compress-squeeze_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[compress-squeeze_0.8s_ease-in-out_infinite]",
  },
  {
    icon: Merge,
    name: "Merge PDF",
    desc: "Combine multiple PDF files into one",
    color: "from-purple-400 to-pink-400",
    baseAnimation: "animate-[merge-combine_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[merge-combine_0.8s_ease-in-out_infinite]",
  },
  {
    icon: Split,
    name: "Split PDF",
    desc: "Extract pages from your PDF documents",
    color: "from-green-400 to-emerald-400",
    baseAnimation: "animate-[split-separate_2s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[split-separate_0.8s_ease-in-out_infinite]",
  },
  {
    icon: FileText,
    name: "Convert PDF to Word",
    desc: "Convert PDF to editable DOCX format",
    color: "from-indigo-400 to-blue-400",
    baseAnimation: "animate-[rotate-convert_4s_linear_infinite]",
    hoverAnimation: "group-hover:animate-[rotate-convert_1s_linear_infinite]",
  },
  {
    icon: ImageIcon,
    name: "JPG ↔ PNG",
    desc: "Convert between image formats instantly",
    color: "from-amber-400 to-yellow-400",
    baseAnimation: "animate-[image-process_2.5s_ease-in-out_infinite]",
    hoverAnimation: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]",
  },
];

interface PopularToolsSectionProps {
  onToolClick: (toolConfig: ToolConfig) => void;
}

export function PopularToolsSection({ onToolClick }: PopularToolsSectionProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <span className="px-4 py-1.5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-primary rounded-full text-sm shadow-sm">
                ⭐ Most Popular
              </span>
            </div>
            <h2 className="mb-3">Start with These Essential Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The tools our users love most — edit, compress, merge, and convert files in seconds
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.name}
                  className="group p-3 sm:p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 hover:-translate-y-2 bg-white"
                  onClick={() => {
                    const config = getToolConfigByName(tool.name);
                    if (config) onToolClick(config);
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 sm:mb-4 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all`}>
                      <Icon className={`w-5 h-5 sm:w-7 sm:h-7 text-white ${tool.baseAnimation} ${tool.hoverAnimation}`} />
                    </div>
                    <h4 className="mb-1.5 sm:mb-2 text-sm sm:text-base">{tool.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 flex-1">
                      {tool.desc}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full border border-gray-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-colors text-xs sm:text-sm py-1.5 sm:py-2"
                    >
                      Try now
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* SEO Text */}
          <div className="hidden md:block text-center mt-8 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use our most popular tools including Merge PDF, Compress PDF, PDF to Word, PNG to JPG, JPG to PNG, and MP4 to MP3. Each tool is free, fast, and optimized for high-quality results with no watermarks or signup required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}