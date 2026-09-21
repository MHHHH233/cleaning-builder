"use client";

import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceTag?: string;
  features?: string[];
}

interface UniversalServicesProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    servicesList?: ServiceItem[];
  };
}

export const UniversalServices: React.FC<UniversalServicesProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const {
    badge = "Our Specialized Services",
    headline = "Tailored Cleaning For Every Space",
    subheadline = "Choose from flexible one-off deep cleans or recurring maintenance schedules designed around your lifestyle.",
    servicesList = [],
  } = data || {};

  return (
    <section id="services" className={`py-12 ${isMobile ? "py-10" : "sm:py-24"} border-t border-theme transition-colors duration-200`}>
      <div className={`mx-auto max-w-7xl ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
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

        {/* Services Grid */}
        <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}`}>
          {servicesList.map((service, index) => (
            <div
              key={service.id || index}
              className={`flex flex-col justify-between border border-theme bg-card-theme ${isMobile ? "p-4 sm:p-5" : "p-6"} rounded-theme shadow-theme transition-all duration-300 hover:-translate-y-1 hover:border-theme/80`}
            >
              <div>
                {/* Header & Price */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  {service.priceTag && (
                    <span className="px-2.5 py-1 text-xs font-bold bg-theme-brand/15 text-theme-primary border border-theme rounded-theme">
                      {service.priceTag}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-theme-primary tracking-tight">
                  {service.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-theme-muted leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                {service.features && service.features.length > 0 && (
                  <ul className="mt-4 sm:mt-6 space-y-2 border-t border-theme/50 pt-3 sm:pt-4">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm text-theme-muted">
                        <Check className="h-4 w-4 text-theme-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card Action */}
              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-theme/40">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary uppercase tracking-wider hover:underline"
                >
                  <span>Book Service</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
