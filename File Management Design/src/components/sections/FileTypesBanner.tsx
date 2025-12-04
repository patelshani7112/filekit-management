import { FileText, Image, Video, Music, FileArchive, FileSpreadsheet, File, Presentation, Code, Database, Mic, Camera } from "lucide-react";

const fileTypes = [
  {
    icon: FileText,
    name: "PDF",
    formats: "PDF, DOCX, TXT",
    color: "from-red-400 to-orange-400",
  },
  {
    icon: Image,
    name: "Images",
    formats: "JPG, PNG, WEBP, SVG",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: Video,
    name: "Video",
    formats: "MP4, AVI, MOV, MKV",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: Music,
    name: "Audio",
    formats: "MP3, WAV, AAC, FLAC",
    color: "from-green-400 to-emerald-400",
  },
  {
    icon: FileArchive,
    name: "Archives",
    formats: "ZIP, RAR, 7Z, TAR",
    color: "from-amber-400 to-yellow-400",
  },
  {
    icon: FileSpreadsheet,
    name: "Data",
    formats: "XLSX, CSV, JSON",
    color: "from-indigo-400 to-blue-400",
  },
  {
    icon: Presentation,
    name: "Presentations",
    formats: "PPT, PPTX, KEY",
    color: "from-rose-400 to-pink-400",
  },
  {
    icon: Code,
    name: "Code",
    formats: "HTML, CSS, JS, XML",
    color: "from-slate-400 to-gray-400",
  },
  {
    icon: Database,
    name: "Database",
    formats: "SQL, DB, MDB",
    color: "from-teal-400 to-cyan-400",
  },
  {
    icon: File,
    name: "Documents",
    formats: "DOC, RTF, ODT",
    color: "from-violet-400 to-purple-400",
  },
];

export function FileTypesBanner() {
  // Duplicate the array to create seamless loop
  const duplicatedFileTypes = [...fileTypes, ...fileTypes];

  return (
    <section className="py-12 bg-white border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Supporting All Major File Formats
          </p>
          <h3 className="text-foreground">Work With Any File Type</h3>
        </div>
        
        {/* Auto-scrolling carousel container */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling wrapper - faster animation */}
          <div className="flex animate-[scroll-left_20s_linear_infinite] sm:animate-[scroll-left_25s_linear_infinite] hover:[animation-play-state:paused]">
            {duplicatedFileTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={`${type.name}-${index}`}
                  className="group flex-shrink-0 flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-secondary transition-all duration-300 cursor-pointer hover:scale-105 border border-transparent hover:border-primary/20 mx-2 sm:mx-3 w-[140px] sm:w-[180px]"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-[float-gentle_3s_ease-in-out_infinite]" />
                  </div>
                  <h4 className="mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">{type.name}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{type.formats}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO Text */}
        <div className="hidden md:block text-center mt-8 max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            WorkflowPro supports all major file formats including PDF, JPG, PNG, WEBP, SVG, MP4, MP3, MOV, WAV, ZIP, RAR, DOCX, XLSX, PPTX, and many others. Work seamlessly with documents, images, videos, audio, presentations, archives, and code files.
          </p>
        </div>
      </div>
    </section>
  );
}