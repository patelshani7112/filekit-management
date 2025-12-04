import { FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 -z-10" />
      
      {/* Abstract Shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10 animate-[float-gentle_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10 animate-[float-gentle_10s_ease-in-out_infinite]" />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
                  Your Complete{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">File Toolkit</span>{" "}
                  in One Place
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  <span className="inline-block">Convert, compress, edit, and manage all your files — </span>
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-medium">PDFs, images, videos, audio, and more.</span>
                  <span className="block mt-1">Fast, secure, and 100% browser-based.</span>
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-500 text-foreground hover:border-purple-600 hover:bg-purple-50 hover:text-primary"
                  onClick={() => document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore All Tools →
                </Button>
              </div>

              {/* SEO Text */}
              <div className="hidden md:block pt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
                <p>
                  WorkflowPro is your all-in-one free file conversion and editing platform. Convert PDF, images, videos, audio files, documents, and more instantly in your browser with no signup or limits. Upload your file and start converting within seconds.
                </p>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square">
                {/* Animated File Icons */}
                <motion.div
                  className="absolute top-0 right-20 w-24 h-24 bg-white border-2 border-red-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-red-400 cursor-pointer"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                >
                  <FileText className="w-full h-full text-red-500 animate-[edit-writing_2s_ease-in-out_infinite]" />
                </motion.div>

                <motion.div
                  className="absolute top-1/3 left-10 w-28 h-28 bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-purple-400 cursor-pointer"
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  whileHover={{ scale: 1.15, rotate: -10 }}
                >
                  <ImageIcon className="w-full h-full text-purple-500 animate-[image-process_2.5s_ease-in-out_infinite]" />
                </motion.div>

                <motion.div
                  className="absolute bottom-20 right-10 w-32 h-32 bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-blue-400 cursor-pointer"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <Video className="w-full h-full text-blue-500 animate-[float-gentle_3s_ease-in-out_infinite]" />
                </motion.div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                  <motion.path
                    d="M 150 80 Q 200 150 120 200"
                    stroke="#3BAFDA"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    animate={{
                      strokeDashoffset: [0, 20],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}