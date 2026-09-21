"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface UniversalFAQProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    faqList?: FAQItem[];
  };
}

export const UniversalFAQ: React.FC<UniversalFAQProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";

  const {
    badge = "Clear Answers",
    headline = "Frequently Asked Questions",
    subheadline = "Everything you need to know about our procedures, supplies, insurance, and satisfaction guarantee.",
    faqList = [],
  } = data || {};

  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true });

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="faq" className={`py-12 ${isMobile ? "py-10" : "sm:py-24"} border-t border-theme transition-colors duration-200`}>
      <div className={`mx-auto max-w-4xl ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-theme bg-card-theme rounded-theme text-theme-primary mb-4 shadow-theme">
              <Sparkles className="h-3.5 w-3.5 text-theme-primary opacity-80" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className={`${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-extrabold tracking-tight text-theme-primary`}>
            {headline}
          </h2>
          {subheadline && (
            <p className={`mt-3 sm:mt-4 ${isMobile ? "text-sm" : "text-base sm:text-lg"} text-theme-muted leading-relaxed`}>
              {subheadline}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqList.map((item, idx) => {
            const isOpen = !!openIndices[idx];
            return (
              <div
                key={item.id || idx}
                className="border border-theme bg-card-theme rounded-theme overflow-hidden shadow-theme transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className={`flex w-full items-center justify-between ${isMobile ? "p-4" : "p-5"} text-left transition-colors hover:bg-theme-muted/5`}
                  aria-expanded={isOpen}
                >
                  <span className={`${isMobile ? "text-sm font-semibold" : "text-base sm:text-lg font-semibold"} text-theme-primary pr-3`}>
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-theme-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-theme-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className={`${isMobile ? "px-4 pb-4 pt-1 text-xs sm:text-sm" : "px-5 pb-5 pt-1 text-sm sm:text-base"} text-theme-muted leading-relaxed border-t border-theme/40`}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
