import { Shield, Lock, Eye, Users, Bell, FileText, Mail, Calendar } from "lucide-react";
import { Card } from "../../components/ui/card";
import { siteConfig } from "../../lib/config/siteConfig";

export function PrivacyPolicyPage() {
  const sections = [
    {
      icon: FileText,
      title: "Introduction",
      content: `Welcome to ${siteConfig.name}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website and tell you about your privacy rights.`,
    },
    {
      icon: Eye,
      title: "Information We Collect",
      content: `We collect minimal information to provide our services:`,
      list: [
        "Usage data: Information about how you use our website and services",
        "Device information: Browser type, IP address, and device identifiers",
        "Cookies: Small text files stored on your device for functionality",
        "Contact information: Only if you voluntarily provide it through our contact form",
      ],
    },
    {
      icon: Users,
      title: "How We Use Your Information",
      content: `We use your information for the following purposes:`,
      list: [
        "To provide and maintain our file conversion services",
        "To improve and optimize our website and user experience",
        "To respond to your inquiries and support requests",
        "To analyze usage patterns and improve our services",
        "To comply with legal obligations and protect our rights",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal data:`,
      list: [
        "All file processing is done locally in your browser",
        "We do not store your files on our servers",
        "Secure HTTPS connection for all communications",
        "Regular security assessments and updates",
        "Limited access to personal data by authorized personnel only",
      ],
    },
    {
      icon: Bell,
      title: "Browser-Based Processing",
      content: `${siteConfig.name} is designed with privacy in mind:`,
      list: [
        "All file conversions and processing happen in your browser",
        "Your files never leave your device",
        "No uploads to external servers required",
        "Complete control over your data at all times",
      ],
    },
    {
      icon: Shield,
      title: "Third-Party Services",
      content: `We may use trusted third-party services for:`,
      list: [
        "Website analytics to understand user behavior",
        "Content delivery networks (CDN) for faster loading",
        "Error tracking to improve service reliability",
        "These services have their own privacy policies",
      ],
    },
    {
      icon: Users,
      title: "Your Privacy Rights",
      content: `You have the following rights regarding your personal data:`,
      list: [
        "Right to access: Request copies of your personal data",
        "Right to rectification: Request correction of inaccurate data",
        "Right to erasure: Request deletion of your personal data",
        "Right to restrict processing: Request limitation of data use",
        "Right to data portability: Request transfer of your data",
        "Right to object: Object to processing of your personal data",
      ],
    },
    {
      icon: FileText,
      title: "Cookies Policy",
      content: `We use cookies to enhance your experience:`,
      list: [
        "Essential cookies: Required for website functionality",
        "Analytics cookies: Help us understand how you use our site",
        "Preference cookies: Remember your settings and preferences",
        "You can control cookies through your browser settings",
      ],
    },
    {
      icon: Calendar,
      title: "Data Retention",
      content: `We retain your data only as long as necessary:`,
      list: [
        "Files processed: Not stored on our servers (browser-based)",
        "Contact inquiries: Retained for support and legal purposes",
        "Analytics data: Aggregated and anonymized after 24 months",
        "You can request deletion of your data at any time",
      ],
    },
    {
      icon: Bell,
      title: "Changes to This Policy",
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50/40">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-purple-600 mb-4">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Your Privacy Matters</span>
            </div>
            <h1 className="mb-6 text-gray-900">Privacy Policy</h1>
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
                <h2 className="mb-3 text-gray-900">Questions About Privacy?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  If you have any questions about this privacy policy or how we
                  handle your data, please don't hesitate to contact us.
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
                    Privacy-First Design
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {siteConfig.name} is built with privacy at its core. All file
                    processing happens directly in your browser, ensuring your
                    files never leave your device. We don't store, access, or
                    have any visibility into the files you process.
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
