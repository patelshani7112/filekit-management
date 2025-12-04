import { useState } from "react";
import { Mail, Send, Clock, CheckCircle2, HelpCircle } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { toast } from "sonner@2.0.3";
import { siteConfig } from "../../lib/config/siteConfig";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const faqs = [
  {
    question: "What is WorkflowPro?",
    answer: "WorkflowPro is a free online platform offering 150+ tools to convert, compress, edit, and manage PDF, image, video, audio, and document files instantly in your browser.",
  },
  {
    question: "Is WorkflowPro free?",
    answer: "Yes. All tools on WorkflowPro are completely free with no sign-up required, no watermarks, and no file size limits.",
  },
  {
    question: "How secure is WorkflowPro?",
    answer: "WorkflowPro uses local processing, meaning your files stay on your device and are never uploaded or stored on servers.",
  },
  {
    question: "Do files stay private?",
    answer: "Absolutely. Everything happens in your browser, making WorkflowPro one of the most private solutions for file conversion and editing.",
  },
  {
    question: "Does WorkflowPro work on mobile?",
    answer: "Yes. WorkflowPro is fully responsive and works on all mobile devices, tablets, and desktops.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation required. WorkflowPro works entirely in your web browser, so you can start using it immediately without downloading anything.",
  },
  {
    question: "Are there any file size limits?",
    answer: "No. WorkflowPro doesn't impose any file size limits. You can process files of any size, limited only by your browser's capabilities.",
  },
  {
    question: "Do converted files have watermarks?",
    answer: "No. All files converted with WorkflowPro are completely free of watermarks. You get clean, professional results every time.",
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Create mailto link with form data
    const mailtoLink = `mailto:support@workflowpro.com?subject=${encodeURIComponent(
      formData.subject || `Contact from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    toast.success("Opening your email client...");

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-purple-50/40">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-purple-600 mb-4">
              <Mail className="w-5 h-5" />
              <span className="text-sm">We're Here to Help</span>
            </div>
            <h1 className="mb-6 text-gray-900">Get in Touch</h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need assistance? We'd love to hear from you. Fill out the form below or reach us directly via email.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-10 bg-white border-0 shadow-sm">
                  <div className="mb-8">
                    <h2 className="mb-2">Send us a Message</h2>
                    <p className="text-gray-500 text-sm">
                      Fill out the form and we'll get back to you as soon as possible
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-11 bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none rounded-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg shadow-sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Email Card */}
                <Card className="p-6 bg-white border-0 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base">Email Us</h3>
                      <p className="text-sm mb-1 text-gray-900">support@workflowpro.com</p>
                      <p className="text-xs text-gray-500">
                        Send us an email anytime!
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Response Time Card */}
                <Card className="p-6 bg-white border-0 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base">Response Time</h3>
                      <p className="text-sm mb-1 text-gray-900">24-48 Hours</p>
                      <p className="text-xs text-gray-500">
                        We typically respond within 1-2 days
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Prefer Email Card */}
                <Card className="p-8 bg-purple-100/60 border-0">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-gray-900">Prefer Email?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Drop us a line directly at
                    </p>
                    <a
                      href="mailto:support@workflowpro.com"
                      className="inline-block px-6 py-2.5 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm shadow-sm"
                    >
                      support@workflowpro.com
                    </a>
                  </div>
                </Card>

                {/* Privacy Badge */}
                <Card className="p-5 bg-green-50 border-0">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="mb-1 text-sm text-gray-900">We Value Your Privacy</h4>
                      <p className="text-xs text-gray-600">
                        Your information is secure and will never be shared with third parties.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Icon */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-lg mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about using WorkflowPro
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Accordion key={index} type="single" collapsible className="w-full">
                  <AccordionItem 
                    value={`item-${index}`}
                    className="bg-white border border-border rounded-xl overflow-hidden hover:border-purple-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                      <div className="flex items-center gap-4 text-left w-full">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="flex-1 pr-4">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-muted-foreground">
                      <div className="pl-10">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
