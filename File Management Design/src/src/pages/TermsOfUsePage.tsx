import { FileCheck, AlertCircle, Scale, Ban, Shield, UserCheck, Gavel, FileText, Mail, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { siteConfig } from "../../lib/config/siteConfig";

export function TermsOfUsePage() {
  const sections = [
    {
      icon: FileCheck,
      title: "Acceptance of Terms",
      content: `By accessing and using ${siteConfig.name}, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.`,
    },
    {
      icon: UserCheck,
      title: "Use of Services",
      content: `${siteConfig.name} provides online file conversion, compression, and editing tools. You agree to use our services only for lawful purposes and in accordance with these terms.`,
      list: [
        "You must be at least 13 years old to use our services",
        "You are responsible for maintaining the security of your files",
        "You must not use our services for any illegal or unauthorized purpose",
        "You must not violate any laws in your jurisdiction while using our services",
      ],
    },
    {
      icon: Shield,
      title: "Browser-Based Processing",
      content: `Our services are designed with privacy in mind. All file processing occurs directly in your browser:`,
      list: [
        "Files are processed locally on your device",
        "We do not upload your files to our servers",
        "We do not store, access, or view your files",
        "You maintain complete control over your data",
        "No file content is transmitted to external servers during processing",
      ],
    },
    {
      icon: Ban,
      title: "Prohibited Uses",
      content: `You agree not to use ${siteConfig.name} for any of the following purposes:`,
      list: [
        "Processing files containing illegal, harmful, or offensive content",
        "Violating any intellectual property rights or copyrights",
        "Distributing malware, viruses, or harmful code",
        "Attempting to gain unauthorized access to our systems",
        "Interfering with or disrupting the service or servers",
        "Using automated systems to access the service without permission",
        "Impersonating any person or entity",
        "Collecting information about other users without consent",
      ],
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: `All content, features, and functionality of ${siteConfig.name} are owned by us and are protected by international copyright, trademark, and other intellectual property laws.`,
      list: [
        "You retain all rights to files you process using our services",
        "Our logo, design, and software are protected by intellectual property rights",
        "You may not copy, modify, or distribute our software without permission",
        "User-generated content remains your property",
      ],
    },
    {
      icon: AlertCircle,
      title: "Disclaimer of Warranties",
      content: `${siteConfig.name} is provided on an "as is" and "as available" basis without any warranties of any kind:`,
      list: [
        "We do not guarantee uninterrupted or error-free service",
        "We do not warrant that our services will meet your requirements",
        "We are not responsible for any data loss or file corruption",
        "Results may vary depending on your browser and device capabilities",
        "We make no warranties regarding the accuracy or reliability of our services",
      ],
    },
    {
      icon: Gavel,
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law, ${siteConfig.name} shall not be liable for any damages arising from your use of our services:`,
      list: [
        "We are not liable for any direct, indirect, or consequential damages",
        "We are not responsible for loss of profits, data, or business opportunities",
        "Our liability is limited to the amount you paid for our services (if any)",
        "Some jurisdictions do not allow limitation of liability, so these may not apply to you",
      ],
    },
    {
      icon: FileText,
      title: "User Content and Responsibility",
      content: `You are solely responsible for the files you process using our services:`,
      list: [
        "Ensure you have the right to process and convert the files you upload",
        "Do not process files containing sensitive personal information",
        "We are not responsible for any copyright or legal issues related to your files",
        "You must comply with all applicable laws regarding the content you process",
        "We reserve the right to refuse service if we suspect illegal activity",
      ],
    },
    {
      icon: Shield,
      title: "Service Availability",
      content: `We strive to provide reliable service, but cannot guarantee continuous availability:`,
      list: [
        "Services may be temporarily unavailable due to maintenance or updates",
        "We may modify or discontinue features without prior notice",
        "We are not liable for service interruptions or downtime",
        "Browser compatibility may vary across different platforms",
      ],
    },
    {
      icon: FileCheck,
      title: "Third-Party Links and Services",
      content: `Our website may contain links to third-party websites or services:`,
      list: [
        "We are not responsible for the content of external websites",
        "Third-party services have their own terms and privacy policies",
        "We do not endorse or guarantee third-party services",
        "Use third-party services at your own risk",
      ],
    },
    {
      icon: AlertCircle,
      title: "Indemnification",
      content: `You agree to indemnify and hold ${siteConfig.name} harmless from any claims, damages, or expenses arising from:`,
      list: [
        "Your use of our services",
        "Your violation of these terms",
        "Your violation of any rights of another person or entity",
        "Any content you process through our services",
      ],
    },
    {
      icon: Scale,
      title: "Governing Law",
      content: `These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration or in the courts of appropriate jurisdiction.`,
    },
    {
      icon: FileText,
      title: "Changes to Terms",
      content: `We reserve the right to modify these terms at any time:`,
      list: [
        "Changes will be posted on this page with an updated date",
        "Continued use of our services constitutes acceptance of new terms",
        "Material changes will be communicated through our website",
        "We encourage you to review these terms periodically",
      ],
    },
    {
      icon: CheckCircle2,
      title: "Severability",
      content: `If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these terms will otherwise remain in full force and effect.`,
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50/40">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-purple-600 mb-4">
              <Scale className="w-5 h-5" />
              <span className="text-sm">Terms & Conditions</span>
            </div>
            <h1 className="mb-6 text-gray-900">Terms of Use</h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Last Updated: November 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="p-8 bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="mb-3">{section.title}</h2>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        {section.content}
                      </p>
                      {section.list && (
                        <ul className="space-y-2 mt-4">
                          {section.list.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-gray-600"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Contact Section */}
            <Card className="p-8 bg-purple-100/60 border-0">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-3 text-gray-900">Questions About These Terms?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Use or need
                  clarification on any point, please contact us.
                </p>
                <a
                  href="mailto:support@workflowpro.com"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
                >
                  Contact Us
                </a>
              </div>
            </Card>

            {/* Important Note */}
            <Card className="p-6 bg-blue-50 border-0">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2 text-gray-900 text-base">
                    Your Rights and Safety
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    These terms are designed to protect both you and {siteConfig.name}. 
                    By using our browser-based file processing services, you maintain 
                    complete control over your files and data. We're committed to 
                    providing a safe, reliable, and privacy-focused platform.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
