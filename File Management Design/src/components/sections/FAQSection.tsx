import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HelpCircle, ChevronDown } from "lucide-react";

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

export function FAQSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-purple-50/30">
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
  );
}