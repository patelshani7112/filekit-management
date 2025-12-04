// src/config/whyChooseConfig.ts
import { Zap, Shield, Globe, Sparkles, LockOpen, Smartphone } from "lucide-react";

/**
 * Shared "Why Choose WorkflowPro?" configuration
 * 
 * This is used across all tool pages to maintain consistency.
 * Update once here and it applies to all pages.
 */

export const WHY_CHOOSE_WORKFLOWPRO = {
  title: "Why Choose WorkflowPro?",
  subtitle: "The most powerful and user-friendly PDF merger available online",
  introText: "WorkflowPro delivers fast, private, and watermark-free PDF merging trusted by professionals, students, and businesses. No signup required.",
  features: [
    {
      title: "Lightning Fast Processing",
      description: "Advanced algorithms ensure your PDFs are merged in seconds, not minutes. Experience blazing-fast performance with files of any size.",
      icon: Zap,
      iconBgColor: "from-orange-400 to-orange-500",
    },
    {
      title: "100% Secure & Private",
      description: "Your files are processed directly in your browser. We never upload or store your documents on our servers, ensuring complete privacy.",
      icon: Shield,
      iconBgColor: "from-blue-400 to-blue-500",
    },
    {
      title: "Works Everywhere",
      description: "No software installation required. Use WorkflowPro on any device - Windows, Mac, iOS, Android, or Linux - right from your browser.",
      icon: Globe,
      iconBgColor: "from-green-400 to-green-500",
    },
    {
      title: "Unlimited File Processing",
      description: "Merge as many PDFs as you want with no restrictions. No file size limits, no daily quotas, completely free forever.",
      icon: Sparkles,
      iconBgColor: "from-purple-400 to-purple-500",
    },
    {
      title: "No Registration Needed",
      description: "Start merging PDFs immediately without creating an account. No email required, no passwords to remember, just instant access.",
      icon: LockOpen,
      iconBgColor: "from-red-400 to-red-500",
    },
    {
      title: "Intuitive Drag & Drop",
      description: "Our user-friendly interface makes merging PDFs effortless. Simply drag, drop, arrange, and download - it's that easy.",
      icon: Smartphone,
      iconBgColor: "from-purple-400 to-pink-500",
    },
  ],
};
