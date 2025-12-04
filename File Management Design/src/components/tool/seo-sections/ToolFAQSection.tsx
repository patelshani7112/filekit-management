import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface ToolFAQSectionProps {
  faqs: FAQItem[];
}

export function ToolFAQSection({
  faqs,
}: ToolFAQSectionProps) {
  return (
    <div className="py-12 bg-gradient-to-b from-purple-50/30 to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Icon */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl text-[#ec4899] mb-2">Frequently Asked Questions</h2>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline transition-all duration-200 rounded-lg px-4 py-3 hover:bg-purple-50/50 [&[data-state=open]]:bg-purple-50/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <span className="pr-4">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-11 pr-4 pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
