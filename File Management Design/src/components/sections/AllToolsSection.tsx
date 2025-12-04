import {
  FileText,
  FileEdit,
  Archive,
  Merge,
  Split,
  RefreshCw,
  Signature,
  Lock,
  Unlock,
  ScanText,
  ImageIcon,
  Crop,
  Video,
  Music,
  Film,
  FileArchive,
  Trash2,
  X,
  Copy,
  Layers,
  Minimize2,
  Wrench,
  Languages,
  PenTool,
  Hash,
  EyeOff,
  GitCompare,
  Eraser,
  Maximize,
  RotateCw,
  Droplet,
  Palette,
  Wand2,
  FlipHorizontal,
  Calculator,
} from "lucide-react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getToolConfigByName } from "../../lib/config/toolConfigs";
import { ToolConfig } from "../dialogs/FileUploadDialog";

const allTools = {
  PDF: [
    // Organize / Manage PDF
    { icon: Merge, name: "Merge PDF", desc: "Combine multiple PDFs" },
    { icon: Split, name: "Split PDF", desc: "Extract pages" },
    { icon: Trash2, name: "Delete Pages", desc: "Remove unwanted pages" },
    { icon: Copy, name: "Extract Pages", desc: "Extract specific pages" },
    { icon: Layers, name: "Organize PDF", desc: "Reorder pages" },
    { icon: Minimize2, name: "Flatten PDF", desc: "Flatten layers" },
    { icon: ScanText, name: "Scan to PDF", desc: "Create PDF from scans" },
    { icon: Archive, name: "Compress PDF", desc: "Reduce file size" },
    { icon: Wrench, name: "Repair PDF", desc: "Fix corrupted PDFs" },
    { icon: ScanText, name: "OCR PDF", desc: "Extract text from scans" },
    { icon: Languages, name: "Translate PDF", desc: "Translate documents" },
    { icon: PenTool, name: "Fill PDF", desc: "Fill forms" },
    
    // Edit PDF
    { icon: FileEdit, name: "Edit PDF", desc: "Add text & images" },
    { icon: Droplet, name: "Add Watermark", desc: "Add watermark" },
    { icon: Hash, name: "Add Page Numbers", desc: "Number your pages" },
    { icon: Crop, name: "Crop PDF", desc: "Trim PDF pages" },
    { icon: RotateCw, name: "Rotate PDF", desc: "Rotate pages" },
    { icon: EyeOff, name: "Redact PDF", desc: "Hide sensitive info" },
    { icon: GitCompare, name: "Compare PDF", desc: "Compare documents" },
    { icon: Signature, name: "Sign PDF", desc: "Add digital signature" },
    { icon: Eraser, name: "Remove Watermark", desc: "Remove watermarks" },
    
    // PDF Security
    { icon: Unlock, name: "Unlock PDF", desc: "Remove password" },
    { icon: Lock, name: "Protect PDF", desc: "Add password" },
    
    // Convert TO PDF
    { icon: RefreshCw, name: "Word to PDF", desc: "DOCX to PDF" },
    { icon: RefreshCw, name: "Excel to PDF", desc: "XLSX to PDF" },
    { icon: RefreshCw, name: "PowerPoint to PDF", desc: "PPTX to PDF" },
    { icon: RefreshCw, name: "HTML to PDF", desc: "Web to PDF" },
    { icon: RefreshCw, name: "RTF to PDF", desc: "RTF to PDF" },
    { icon: RefreshCw, name: "TXT to PDF", desc: "Text to PDF" },
    { icon: RefreshCw, name: "JPG to PDF", desc: "Image to PDF" },
    { icon: RefreshCw, name: "PNG to PDF", desc: "Image to PDF" },
    { icon: RefreshCw, name: "SVG to PDF", desc: "Vector to PDF" },
    { icon: RefreshCw, name: "TIFF to PDF", desc: "TIFF to PDF" },
    { icon: RefreshCw, name: "WEBP to PDF", desc: "WEBP to PDF" },
    { icon: RefreshCw, name: "BMP to PDF", desc: "BMP to PDF" },
    { icon: RefreshCw, name: "GIF to PDF", desc: "GIF to PDF" },
    
    // Convert FROM PDF
    { icon: RefreshCw, name: "PDF to Word", desc: "PDF to DOCX" },
    { icon: RefreshCw, name: "PDF to Excel", desc: "PDF to XLSX" },
    { icon: RefreshCw, name: "PDF to PowerPoint", desc: "PDF to PPTX" },
    { icon: RefreshCw, name: "PDF to PPTX", desc: "PDF to PPTX" },
    { icon: RefreshCw, name: "PDF to HTML", desc: "PDF to Web" },
    { icon: RefreshCw, name: "PDF to Text", desc: "Extract text" },
    { icon: RefreshCw, name: "PDF to JPG", desc: "PDF to Image" },
    { icon: RefreshCw, name: "PDF to PNG", desc: "PDF to Image" },
    { icon: RefreshCw, name: "PDF to WEBP", desc: "PDF to WEBP" },
    { icon: RefreshCw, name: "PDF to TIFF", desc: "PDF to TIFF" },
    { icon: RefreshCw, name: "PDF to SVG", desc: "PDF to Vector" },
  ],
  Images: [
    // Image Editing
    { icon: FileEdit, name: "Edit Image", desc: "Edit images online" },
    { icon: Maximize, name: "Resize Image", desc: "Change dimensions" },
    { icon: Layers, name: "Bulk Resize", desc: "Resize multiple" },
    { icon: Maximize, name: "Resize PNG", desc: "Resize PNG files" },
    { icon: Maximize, name: "Resize JPG", desc: "Resize JPG files" },
    { icon: Maximize, name: "Resize WEBP", desc: "Resize WEBP files" },
    { icon: Crop, name: "Crop Image", desc: "Trim your images" },
    { icon: RotateCw, name: "Rotate Image", desc: "Rotate images" },
    { icon: FlipHorizontal, name: "Flip Image", desc: "Flip horizontally/vertically" },
    { icon: Maximize, name: "Image Enlarger", desc: "Enlarge images" },
    { icon: Palette, name: "Color Picker", desc: "Pick colors" },
    { icon: Droplet, name: "Add Watermark", desc: "Add watermark" },
    { icon: Wand2, name: "Meme Generator", desc: "Create memes" },
    
    // Image Compression
    { icon: Archive, name: "Compress Image", desc: "Reduce image size" },
    { icon: Archive, name: "Compress JPG", desc: "Compress JPEG" },
    { icon: Archive, name: "Compress PNG", desc: "Compress PNG" },
    { icon: Archive, name: "Compress GIF", desc: "Compress GIF" },
    
    // Image Conversions
    { icon: RefreshCw, name: "JPG to PNG", desc: "Convert to PNG" },
    { icon: RefreshCw, name: "PNG to JPG", desc: "Convert to JPG" },
    { icon: RefreshCw, name: "PNG to WEBP", desc: "Convert to WEBP" },
    { icon: RefreshCw, name: "WEBP to PNG", desc: "Convert to PNG" },
    { icon: RefreshCw, name: "JPG to WEBP", desc: "Convert to WEBP" },
    { icon: RefreshCw, name: "WEBP to JPG", desc: "Convert to JPG" },
    { icon: RefreshCw, name: "PNG to SVG", desc: "Convert to vector" },
    { icon: RefreshCw, name: "JPG to SVG", desc: "Convert to vector" },
    { icon: RefreshCw, name: "SVG to PNG", desc: "Convert to PNG" },
    { icon: RefreshCw, name: "SVG to JPG", desc: "Convert to JPG" },
    { icon: RefreshCw, name: "HEIC to JPG", desc: "Apple format to JPG" },
    { icon: RefreshCw, name: "HEIC to PNG", desc: "Apple format to PNG" },
    { icon: RefreshCw, name: "AVIF to JPG", desc: "AVIF to JPG" },
    { icon: RefreshCw, name: "AVIF to PNG", desc: "AVIF to PNG" },
    { icon: RefreshCw, name: "TIFF to JPG", desc: "TIFF to JPG" },
    { icon: RefreshCw, name: "TIFF to PNG", desc: "TIFF to PNG" },
    { icon: RefreshCw, name: "BMP to JPG", desc: "BMP to JPG" },
    { icon: RefreshCw, name: "BMP to PNG", desc: "BMP to PNG" },
    { icon: RefreshCw, name: "GIF to PNG", desc: "GIF to PNG" },
    { icon: RefreshCw, name: "GIF to JPG", desc: "GIF to JPG" },
    
    // Image to Document
    { icon: RefreshCw, name: "Image to Word", desc: "Convert to Word" },
    { icon: RefreshCw, name: "Image to Excel", desc: "Convert to Excel" },
  ],
  Video: [
    // Video Conversion
    { icon: Video, name: "MOV to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "MP4 to MOV", desc: "Convert to MOV" },
    { icon: Video, name: "MKV to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "AVI to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "MP4 to AVI", desc: "Convert to AVI" },
    { icon: Video, name: "MPEG to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "FLV to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "WMV to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "WEBM to MP4", desc: "Convert to MP4" },
    { icon: Video, name: "MP4 to WEBM", desc: "Convert to WEBM" },
    
    // Video to Audio
    { icon: Music, name: "Video to MP3", desc: "Extract audio" },
    { icon: Music, name: "MP4 to WAV", desc: "Extract audio" },
    
    // GIF Tools
    { icon: Film, name: "MP4 to GIF", desc: "Create GIF" },
    { icon: Film, name: "MOV to GIF", desc: "Create GIF" },
    { icon: Film, name: "AVI to GIF", desc: "Create GIF" },
    { icon: Film, name: "WEBM to GIF", desc: "Create GIF" },
    { icon: Film, name: "GIF to MP4", desc: "Convert to video" },
    { icon: Film, name: "Image to GIF", desc: "Create animated GIF" },
    
    // Video Editing
    { icon: Crop, name: "Crop Video", desc: "Crop video" },
    { icon: Split, name: "Trim Video", desc: "Cut video clips" },
    
    // Video Compression
    { icon: Archive, name: "Video Compressor", desc: "Reduce video size" },
  ],
  Audio: [
    // Audio Conversions
    { icon: Music, name: "MP4 to MP3", desc: "Extract audio" },
    { icon: Music, name: "MP3 to WAV", desc: "Convert to WAV" },
    { icon: Music, name: "WAV to MP3", desc: "Convert to MP3" },
    { icon: Music, name: "M4A to MP3", desc: "Convert to MP3" },
    { icon: Music, name: "AAC to MP3", desc: "Convert to MP3" },
    { icon: Music, name: "OGG to MP3", desc: "Convert to MP3" },
    { icon: Music, name: "OPUS to MP3", desc: "Convert to MP3" },
    { icon: Music, name: "FLAC to MP3", desc: "Convert to MP3" },
    
    // Audio Compression
    { icon: Archive, name: "MP3 Compressor", desc: "Compress MP3" },
    { icon: Archive, name: "WAV Compressor", desc: "Compress WAV" },
  ],
  Compressors: [
    // Document Compressors
    { icon: Archive, name: "PDF Compressor", desc: "Reduce PDF size" },
    
    // Image Compressors
    { icon: Archive, name: "Image Compressor", desc: "Compress images" },
    { icon: Archive, name: "JPEG Compressor", desc: "Compress JPEG files" },
    { icon: Archive, name: "PNG Compressor", desc: "Compress PNG files" },
    
    // Audio & Video Compressors
    { icon: Archive, name: "Video Compressor", desc: "Compress videos" },
    { icon: Archive, name: "MP3 Compressor", desc: "Compress MP3 files" },
    { icon: Archive, name: "WAV Compressor", desc: "Compress WAV files" },
  ],
  Converters: [
    // Document to Document
    { icon: RefreshCw, name: "DOC to DOCX", desc: "Convert to DOCX" },
    { icon: RefreshCw, name: "DOCX to DOC", desc: "Convert to DOC" },
    { icon: RefreshCw, name: "XLS to XLSX", desc: "Convert to XLSX" },
    { icon: RefreshCw, name: "XLSX to XLS", desc: "Convert to XLS" },
    { icon: RefreshCw, name: "PPT to PPTX", desc: "Convert to PPTX" },
    { icon: RefreshCw, name: "PPTX to PPT", desc: "Convert to PPT" },
    { icon: RefreshCw, name: "HTML to DOCX", desc: "Convert to Word" },
    { icon: RefreshCw, name: "DOCX to HTML", desc: "Convert to HTML" },
    { icon: RefreshCw, name: "TXT to EPUB", desc: "Convert to EPUB" },
    { icon: RefreshCw, name: "EPUB to TXT", desc: "Convert to text" },
    
    // Archive & File
    { icon: FileArchive, name: "RAR to ZIP", desc: "Convert archive" },
    { icon: FileArchive, name: "ZIP to RAR", desc: "Convert archive" },
    { icon: FileArchive, name: "Archive Converter", desc: "Convert archives" },
    
    // Other Converters
    { icon: Calculator, name: "Unit Converter", desc: "Convert units" },
    { icon: RefreshCw, name: "Time Converter", desc: "Convert time" },
  ],
};

// Animation mapping for different tool types
const getToolAnimation = (toolName: string) => {
  if (toolName.includes("Edit")) return { base: "animate-[edit-writing_2s_ease-in-out_infinite]", hover: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]" };
  if (toolName.includes("Compress")) return { base: "animate-[compress-squeeze_2s_ease-in-out_infinite]", hover: "group-hover:animate-[compress-squeeze_0.8s_ease-in-out_infinite]" };
  if (toolName.includes("Merge")) return { base: "animate-[merge-combine_2s_ease-in-out_infinite]", hover: "group-hover:animate-[merge-combine_0.8s_ease-in-out_infinite]" };
  if (toolName.includes("Split") || toolName.includes("Trim")) return { base: "animate-[split-separate_2s_ease-in-out_infinite]", hover: "group-hover:animate-[split-separate_0.8s_ease-in-out_infinite]" };
  if (toolName.includes("Convert") || toolName.includes("to")) return { base: "animate-[rotate-convert_4s_linear_infinite]", hover: "group-hover:animate-[rotate-convert_1s_linear_infinite]" };
  if (toolName.includes("Sign")) return { base: "animate-[sign-draw_2s_ease-in-out_infinite]", hover: "group-hover:animate-[sign-draw_0.8s_ease-in-out_infinite]" };
  if (toolName.includes("Lock") || toolName.includes("Unlock") || toolName.includes("Protect")) return { base: "animate-[lock-secure_2.5s_ease-in-out_infinite]", hover: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]" };
  if (toolName.includes("OCR") || toolName.includes("Scan")) return { base: "animate-[scan-move_2s_ease-in-out_infinite]", hover: "group-hover:animate-[scan-move_0.8s_ease-in-out_infinite]" };
  if (toolName.includes("Image") || toolName.includes("Crop") || toolName.includes("Resize")) return { base: "animate-[image-process_2.5s_ease-in-out_infinite]", hover: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]" };
  return { base: "animate-[float-gentle_3s_ease-in-out_infinite]", hover: "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]" };
};

const categoryColors = {
  PDF: {
    gradient: "from-red-400 to-orange-400",
    bg: "bg-red-100",
    text: "text-red-500",
  },
  Images: {
    gradient: "from-purple-400 to-pink-400",
    bg: "bg-purple-100",
    text: "text-purple-500",
  },
  Video: {
    gradient: "from-blue-400 to-cyan-400",
    bg: "bg-blue-100",
    text: "text-blue-500",
  },
  Audio: {
    gradient: "from-green-400 to-emerald-400",
    bg: "bg-green-100",
    text: "text-green-500",
  },
  Compressors: {
    gradient: "from-indigo-400 to-purple-400",
    bg: "bg-indigo-100",
    text: "text-indigo-500",
  },
  Converters: {
    gradient: "from-amber-400 to-yellow-400",
    bg: "bg-amber-100",
    text: "text-amber-500",
  },
};

interface AllToolsSectionProps {
  onToolClick: (toolConfig: ToolConfig) => void;
}

export function AllToolsSection({ onToolClick }: AllToolsSectionProps) {
  return (
    <section id="all-tools" className="py-16 bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl">All Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of file conversion and editing tools
            </p>
          </div>

          <Tabs defaultValue="PDF" className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6 mb-8 h-auto p-1 gap-1">
              {Object.keys(allTools).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white py-2.5"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(allTools).map(([category, tools]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const colors = categoryColors[category as keyof typeof categoryColors];
                    return (
                      <Card
                        key={tool.name}
                        className="group p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary/50 hover:-translate-y-0.5"
                        onClick={() => {
                          const config = getToolConfigByName(tool.name);
                          if (config) onToolClick(config);
                        }}
                      >
                        <div className="flex flex-col items-center text-center gap-2.5">
                          {(() => {
                            const animation = getToolAnimation(tool.name);
                            return (
                              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                                <Icon className={`w-5 h-5 text-white ${animation.base} ${animation.hover}`} />
                              </div>
                            );
                          })()}
                          <h4 className="leading-tight font-medium">{tool.name}</h4>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* SEO Text */}
          <div className="hidden md:block text-center mt-10 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse WorkflowPro's complete collection of more than 150 free online tools for PDFs, images, videos, audio, documents, compressors, and general file conversions. Organized into categories for easy navigation, every tool works instantly in your browser.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}