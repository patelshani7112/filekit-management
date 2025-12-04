import { Files } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig, getCopyrightText } from "../../lib/config/siteConfig";

const footerLinks = {
  "PDF Tools": [
    "Merge PDF",
    "PDF to Word",
    "Compress PDF",
    "Split PDF",
    "OCR PDF",
    "Edit PDF",
    "Sign PDF",
    "Protect PDF",
  ],
  "Image Tools": [
    "Edit Image",
    "JPG to PNG",
    "Convert HEIC",
    "Resize Image",
    "Compress Image",
    "PNG to WEBP",
    "Image to Word",
    "Add Watermark",
  ],
  "Video & Audio": [
    "MP4 to MP3",
    "MOV to MP4",
    "Video to GIF",
    "WAV to MP3",
    "Trim Video",
    "MP4 to WEBM",
    "Compress Video",
    "Video Converter",
  ],
  "Converters": [
    "DOCX to DOC",
    "PPTX to PPT",
    "HTML to DOCX",
    "RAR to ZIP",
    "Unit Converter",
    "XLSX to XLS",
    "Archive Converter",
    "Time Converter",
  ],
  "Company": [
    "Help Center",
    "Privacy Policy",
    "Terms of Use",
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        {/* Brand Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Files className="w-5 h-5 text-white" />
            </div>
            <span className="tracking-tight text-white">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-sm text-white/60 max-w-md">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    {link === "Help Center" ? (
                      <Link
                        to="/help-center"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    ) : link === "Privacy Policy" ? (
                      <Link
                        to="/privacy-policy"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    ) : link === "Terms of Use" ? (
                      <Link
                        to="/terms-of-use"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/60 text-center md:text-left">
            {getCopyrightText()}
          </p>
        </div>
      </div>
    </footer>
  );
}