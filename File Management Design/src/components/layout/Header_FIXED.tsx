import { useState, useRef, useEffect } from "react";
import { 
  Menu, 
  X, 
  Files,
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
  FileSpreadsheet,
  Info,
  FileText,
  Trash2,
  Eye,
  Shield,
  FileCheck,
  Layers,
  Maximize,
  RotateCw,
  Droplet,
  Palette,
  Wand2,
  Home,
  MoreHorizontal,
  Zap,
  Copy,
  FileOutput,
  FileInput,
  Hash,
  EyeOff,
  GitCompare,
  Eraser,
  Languages,
  PenTool,
  Wrench,
  Minimize2,
  FlipHorizontal,
  ZoomIn,
  Pipette,
  Smile,
  Headphones,
  Scissors,
  Calculator,
  Settings,
  ArrowRightLeft,
  FileType,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  type LucideIcon
} from "lucide-react";
import { getToolConfigByName } from "../../lib/config/toolConfigs";
import { ToolConfig } from "../dialogs/FileUploadDialog";
import { siteConfig } from "../../lib/config/siteConfig";

interface MenuItem {
  name: string;
  icon: LucideIcon;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MegaMenuProps {
  title: string;
  sections: MenuSection[];
  hasMegaMenu?: boolean;
}

const megaMenuData: MegaMenuProps[] = [
  {
    title: "PDF Tools",
    hasMegaMenu: true,
    sections: [
      {
        title: "Organize / Manage PDF",
        items: [
          { name: "Merge PDF", icon: Merge },
          { name: "Split PDF", icon: Split },
          { name: "Delete Pages", icon: Trash2 },
          { name: "Remove Pages", icon: X },
          { name: "Extract Pages", icon: Copy },
          { name: "Organize PDF", icon: Layers },
          { name: "Flatten PDF", icon: Minimize2 },
          { name: "Scan to PDF", icon: ScanText },
          { name: "Compress PDF", icon: Archive },
          { name: "Repair PDF", icon: Wrench },
          { name: "OCR PDF", icon: ScanText },
          { name: "Translate PDF", icon: Languages },
          { name: "Fill PDF", icon: PenTool },
        ],
      },
      {
        title: "Edit PDF",
        items: [
          { name: "Edit PDF", icon: FileEdit },
          { name: "Add Watermark", icon: Droplet },
          { name: "Add Page Numbers", icon: Hash },
          { name: "Crop PDF", icon: Crop },
          { name: "Rotate PDF", icon: RotateCw },
          { name: "Redact PDF", icon: EyeOff },
          { name: "Compare PDF", icon: GitCompare },
          { name: "Sign PDF", icon: Signature },
          { name: "Remove Watermark", icon: Eraser },
        ],
      },
      {
        title: "PDF Security",
        items: [
          { name: "Unlock PDF", icon: Unlock },
          { name: "Protect PDF", icon: Lock },
        ],
      },
      {
        title: "Convert TO PDF",
        items: [
          { name: "Word to PDF", icon: RefreshCw },
          { name: "Excel to PDF", icon: RefreshCw },
          { name: "PowerPoint to PDF", icon: RefreshCw },
          { name: "HTML to PDF", icon: RefreshCw },
          { name: "RTF to PDF", icon: RefreshCw },
          { name: "TXT to PDF", icon: RefreshCw },
          { name: "JPG to PDF", icon: RefreshCw },
          { name: "PNG to PDF", icon: RefreshCw },
          { name: "SVG to PDF", icon: RefreshCw },
          { name: "TIFF to PDF", icon: RefreshCw },
          { name: "WEBP to PDF", icon: RefreshCw },
          { name: "BMP to PDF", icon: RefreshCw },
          { name: "GIF to PDF", icon: RefreshCw },
        ],
      },
      {
        title: "Convert FROM PDF",
        items: [
          { name: "PDF to Word", icon: RefreshCw },
          { name: "PDF to Excel", icon: RefreshCw },
          { name: "PDF to PowerPoint", icon: RefreshCw },
          { name: "PDF to PPTX", icon: RefreshCw },
          { name: "PDF to HTML", icon: RefreshCw },
          { name: "PDF to Text", icon: RefreshCw },
          { name: "PDF to JPG", icon: RefreshCw },
          { name: "PDF to PNG", icon: RefreshCw },
          { name: "PDF to WEBP", icon: RefreshCw },
          { name: "PDF to TIFF", icon: RefreshCw },
          { name: "PDF to SVG", icon: RefreshCw },
        ],
      },
    ],
  },
  {
    title: "Image Tools",
    hasMegaMenu: true,
    sections: [
      {
        title: "Image Editing",
        items: [
          { name: "Edit Image", icon: FileEdit },
          { name: "Resize Image", icon: Maximize },
          { name: "Bulk Resize", icon: Layers },
          { name: "Resize PNG", icon: Maximize },
          { name: "Resize JPG", icon: Maximize },
          { name: "Resize WEBP", icon: Maximize },
          { name: "Crop Image", icon: Crop },
          { name: "Rotate Image", icon: RotateCw },
          { name: "Flip Image", icon: RefreshCw },
          { name: "Image Enlarger", icon: Maximize },
          { name: "Color Picker", icon: Palette },
          { name: "Add Watermark", icon: Droplet },
          { name: "Meme Generator", icon: Wand2 },
        ],
      },
      {
        title: "Image Compression",
        items: [
          { name: "Compress Image", icon: Archive },
          { name: "Compress JPG", icon: Archive },
          { name: "Compress PNG", icon: Archive },
          { name: "Compress GIF", icon: Archive },
        ],
      },
      {
        title: "Image Conversions",
        items: [
          { name: "JPG to PNG", icon: RefreshCw },
          { name: "PNG to JPG", icon: RefreshCw },
          { name: "PNG to WEBP", icon: RefreshCw },
          { name: "WEBP to PNG", icon: RefreshCw },
          { name: "JPG to WEBP", icon: RefreshCw },
          { name: "WEBP to JPG", icon: RefreshCw },
          { name: "PNG to SVG", icon: RefreshCw },
          { name: "JPG to SVG", icon: RefreshCw },
          { name: "SVG to PNG", icon: RefreshCw },
          { name: "SVG to JPG", icon: RefreshCw },
          { name: "HEIC to JPG", icon: RefreshCw },
          { name: "HEIC to PNG", icon: RefreshCw },
          { name: "AVIF to JPG", icon: RefreshCw },
          { name: "AVIF to PNG", icon: RefreshCw },
          { name: "TIFF to JPG", icon: RefreshCw },
          { name: "TIFF to PNG", icon: RefreshCw },
          { name: "BMP to JPG", icon: RefreshCw },
          { name: "BMP to PNG", icon: RefreshCw },
          { name: "GIF to PNG", icon: RefreshCw },
          { name: "GIF to JPG", icon: RefreshCw },
        ],
      },
      {
        title: "Image to Document",
        items: [
          { name: "Image to Word", icon: RefreshCw },
          { name: "Image to Excel", icon: RefreshCw },
        ],
      },
    ],
  },
  {
    title: "Video & Audio",
    hasMegaMenu: true,
    sections: [
      {
        title: "Audio Conversions",
        items: [
          { name: "MP4 to MP3", icon: Music },
          { name: "MP3 to WAV", icon: Music },
          { name: "WAV to MP3", icon: Music },
          { name: "M4A to MP3", icon: Music },
          { name: "AAC to MP3", icon: Music },
          { name: "OGG to MP3", icon: Music },
          { name: "OPUS to MP3", icon: Music },
          { name: "FLAC to MP3", icon: Music },
        ],
      },
      {
        title: "Video Conversion",
        items: [
          { name: "MOV to MP4", icon: Video },
          { name: "MP4 to MOV", icon: Video },
          { name: "MKV to MP4", icon: Video },
          { name: "AVI to MP4", icon: Video },
          { name: "MP4 to AVI", icon: Video },
          { name: "MPEG to MP4", icon: Video },
          { name: "FLV to MP4", icon: Video },
          { name: "WMV to MP4", icon: Video },
          { name: "WEBM to MP4", icon: Video },
          { name: "MP4 to WEBM", icon: Video },
        ],
      },
      {
        title: "Video to Audio",
        items: [
          { name: "Video to MP3", icon: Music },
          { name: "MP4 to WAV", icon: Music },
        ],
      },
      {
        title: "GIF / Animation Tools",
        items: [
          { name: "MP4 to GIF", icon: Film },
          { name: "MOV to GIF", icon: Film },
          { name: "AVI to GIF", icon: Film },
          { name: "WEBM to GIF", icon: Film },
          { name: "GIF to MP4", icon: Film },
          { name: "Image to GIF", icon: Film },
        ],
      },
      {
        title: "Video Editing",
        items: [
          { name: "Crop Video", icon: Crop },
          { name: "Trim Video", icon: Split },
        ],
      },
    ],
  },
  {
    title: "Compressors",
    hasMegaMenu: true,
    sections: [
      {
        title: "Document Compressors",
        items: [
          { name: "PDF Compressor", icon: Archive },
        ],
      },
      {
        title: "Image Compressors",
        items: [
          { name: "Image Compressor", icon: Archive },
          { name: "JPEG Compressor", icon: Archive },
          { name: "PNG Compressor", icon: Archive },
        ],
      },
      {
        title: "Audio & Video Compressors",
        items: [
          { name: "Video Compressor", icon: Archive },
          { name: "MP3 Compressor", icon: Archive },
          { name: "WAV Compressor", icon: Archive },
        ],
      },
    ],
  },
  {
    title: "Converters",
    hasMegaMenu: true,
    sections: [
      {
        title: "Document to Document",
        items: [
          { name: "DOC to DOCX", icon: RefreshCw },
          { name: "DOCX to DOC", icon: RefreshCw },
          { name: "XLS to XLSX", icon: RefreshCw },
          { name: "XLSX to XLS", icon: RefreshCw },
          { name: "PPT to PPTX", icon: RefreshCw },
          { name: "PPTX to PPT", icon: RefreshCw },
          { name: "HTML to DOCX", icon: RefreshCw },
          { name: "DOCX to HTML", icon: RefreshCw },
          { name: "TXT to EPUB", icon: RefreshCw },
          { name: "EPUB to TXT", icon: RefreshCw },
        ],
      },
      {
        title: "Archive & File",
        items: [
          { name: "RAR to ZIP", icon: FileArchive },
          { name: "ZIP to RAR", icon: FileArchive },
          { name: "Archive Converter", icon: FileArchive },
        ],
      },
      {
        title: "Other Converters",
        items: [
          { name: "Unit Converter", icon: RefreshCw },
          { name: "Time Converter", icon: RefreshCw },
        ],
      },
    ],
  },
  {
    title: "More",
    hasMegaMenu: true,
    sections: [
      {
        title: "Popular Tools",
        items: [
          { name: "Merge PDF", icon: Merge },
          { name: "Split PDF", icon: Split },
          { name: "Compress PDF", icon: Archive },
          { name: "Edit PDF", icon: FileEdit },
          { name: "Sign PDF", icon: Signature },
        ],
      },
      {
        title: "Quick Actions",
        items: [
          { name: "PDF to Word", icon: RefreshCw },
          { name: "Word to PDF", icon: RefreshCw },
          { name: "JPG to PDF", icon: RefreshCw },
          { name: "PDF to JPG", icon: RefreshCw },
        ],
      },
    ],
  },
];

interface HeaderProps {
  onToolClick: (toolConfig: ToolConfig) => void;
  onNavigateToHelp?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
}

export function Header({ onToolClick, onNavigateToHelp, onNavigateToHome, onNavigateToPrivacy, onNavigateToTerms }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const getDropdownAnimation = (toolName: string) => {
    if (toolName.includes("Edit")) return "group-hover:animate-[edit-writing_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Compress")) return "group-hover:animate-[compress-squeeze_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Merge")) return "group-hover:animate-[merge-combine_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Split") || toolName.includes("Trim")) return "group-hover:animate-[split-separate_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Convert") || toolName.includes("to")) return "group-hover:animate-[rotate-convert_1s_linear_infinite]";
    if (toolName.includes("Sign")) return "group-hover:animate-[sign-draw_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Lock") || toolName.includes("Unlock") || toolName.includes("Protect")) return "group-hover:animate-[lock-secure_0.8s_ease-in-out_infinite]";
    if (toolName.includes("OCR") || toolName.includes("Scan")) return "group-hover:animate-[scan-move_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Crop") || toolName.includes("Resize")) return "group-hover:animate-[crop-trim_0.8s_ease-in-out_infinite]";
    if (toolName.includes("Image") || toolName.includes("JPG") || toolName.includes("PNG")) return "group-hover:animate-[image-process_0.8s_ease-in-out_infinite]";
    return "group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]";
  };

  const handleMenuEnter = (menuTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuTitle);
  };

  const handleMenuLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={onNavigateToHome}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300">
                <Files className="w-5 h-5 text-white animate-[float-gentle_4s_ease-in-out_infinite] group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]" />
              </div>
              <span className="text-lg tracking-tight">
                {siteConfig.name}
              </span>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
              {megaMenuData.map((menu) => (
                <div
                  key={menu.title}
                  className="relative"
                >
                  <button 
                    className="px-4 py-2 text-sm hover:text-primary transition-colors"
                    onMouseEnter={() => handleMenuEnter(menu.title)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {menu.title}
                  </button>
                  
                  {activeMenu === menu.title && (() => {
                    const isExpanded = expandedMenus.has(menu.title);
                    const maxItemsPerSection = 10;
                    
                    // Calculate total hidden items
                    let totalHiddenItems = 0;
                    menu.sections.forEach(section => {
                      if (section.items.length > maxItemsPerSection) {
                        totalHiddenItems += section.items.length - maxItemsPerSection;
                      }
                    });
                    
                    return (
                      <div 
                        className="fixed z-50"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleMenuLeave}
                        style={{
                          left: '50%',
                          top: '64px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="bg-white rounded-xl shadow-2xl border border-border animate-[dropdown-slide-in_0.2s_ease-out]">
                          <div className="overflow-y-auto thin-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                            <div className={`p-6 grid gap-x-8 gap-y-6 ${
                              menu.sections.length <= 2 ? 'grid-cols-2' :
                              menu.sections.length === 3 ? 'grid-cols-3' :
                              menu.sections.length === 4 ? 'grid-cols-4' :
                              'grid-cols-5'
                            }`} style={{ 
                              width: menu.sections.length <= 2 ? '500px' : 
                                     menu.sections.length === 3 ? '720px' : 
                                     menu.sections.length === 4 ? '920px' : '1100px' 
                            }}>
                              {menu.sections.map((section) => {
                                const displayItems = isExpanded ? section.items : section.items.slice(0, maxItemsPerSection);
                                
                                return (
                                  <div key={section.title} className="space-y-3">
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/50 font-semibold">
                                      {section.title}
                                    </h4>
                                    <div className="space-y-0.5">
                                      {displayItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                          <button
                                            key={item.name}
                                            className="group flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-sm hover:bg-secondary rounded-lg transition-all duration-200"
                                            onClick={() => {
                                              const config = getToolConfigByName(item.name);
                                              if (config) {
                                                onToolClick(config);
                                                setActiveMenu(null);
                                              }
                                            }}
                                          >
                                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                                              <Icon className={`w-3.5 h-3.5 text-primary ${getDropdownAnimation(item.name)}`} />
                                            </div>
                                            <span className="flex-1 text-sm leading-snug">{item.name}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Single Show More/Less Button at Bottom */}
                            {totalHiddenItems > 0 && (
                              <div className="px-6 pb-6">
                                <button
                                  onClick={() => {
                                    setExpandedMenus(prev => {
                                      const newSet = new Set(prev);
                                      if (isExpanded) {
                                        newSet.delete(menu.title);
                                      } else {
                                        newSet.add(menu.title);
                                      }
                                      return newSet;
                                    });
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      Show More
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </nav>

            {/* Desktop - Explore All Tools Button */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={() => document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-sm border-2 border-purple-400 text-foreground rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:text-primary"
              >
                Explore All Tools →
              </button>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto overscroll-contain thin-scrollbar">
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-white border-b border-border p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                  <Files className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg tracking-tight">
                  FileKit Pro
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <nav className="p-4 pb-20">
            <div className="space-y-6">
              {megaMenuData.map((menu) => (
                <div key={menu.title} className="space-y-4">
                  <h3 className="px-2 uppercase tracking-wider text-muted-foreground">
                    {menu.title}
                  </h3>
                  {menu.sections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <h4 className="px-2 text-xs uppercase tracking-wider text-muted-foreground/70">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.name}
                              className="group flex items-center gap-3 w-full text-left px-3 py-3 text-sm hover:bg-secondary rounded-xl transition-all duration-200"
                              onClick={() => {
                                const config = getToolConfigByName(item.name);
                                if (config) {
                                  onToolClick(config);
                                  setIsMenuOpen(false);
                                }
                              }}
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                                <Icon className={`w-4 h-4 text-primary ${getDropdownAnimation(item.name)}`} />
                              </div>
                              <span className="flex-1">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
