"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface UniversalAboutProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    imageUrl?: string;
    checkpoints?: string[];
    quote?: string;
    founderTitle?: string;
  };
}

export const UniversalAbout: React.FC<UniversalAboutProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const {
    badge = "The PureSpark Standard",
    headline = "Engineered For Hygiene. Obsessed With Details.",
    subheadline = "We didn't just build a cleaning company—we designed a rigorous 52-point hygiene protocol powered by certified professionals who take pride in their craft.",
    imageUrl = "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1000&q=80",
    checkpoints = [],
    quote,
    founderTitle,
  } = data || {};

  return (
    <section id="about" className={`py-12 ${isMobile ? "py-10" : "sm:py-24"} border-t border-theme transition-colors duration-200`}>
      <div className={`mx-auto max-w-7xl ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className={`grid items-center gap-8 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-1 md:grid-cols-12 gap-8" : "grid-cols-1 lg:grid-cols-12 lg:gap-12"}`}>
          {/* Left Column Text */}
          <div className={`${isMobile ? "w-full" : isTablet ? "md:col-span-7" : "lg:col-span-6"} space-y-5 sm:space-y-6`}>
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-theme bg-card-theme rounded-theme text-theme-primary shadow-theme">
                <Sparkles className="h-3.5 w-3.5 text-theme-primary opacity-80" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className={`${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-extrabold tracking-tight text-theme-primary leading-tight`}>
              {headline}
            </h2>

            <p className={`${isMobile ? "text-sm" : "text-base sm:text-lg"} text-theme-muted leading-relaxed`}>
              {subheadline}
            </p>

            {/* Checkpoints */}
            {checkpoints.length > 0 && (
              <div className="space-y-3 pt-2">
                {checkpoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-theme-primary shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-theme-primary/90 font-medium">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quote Box */}
            {quote && (
              <div className="mt-6 border-l-2 border-theme-primary bg-card-theme p-4 rounded-r-theme shadow-theme">
                <p className="text-sm italic text-theme-primary leading-relaxed font-serif sm:font-sans">
                  {quote}
                </p>
                {founderTitle && (
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-theme-muted">
                    — {founderTitle}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column Visual */}
          <div className={`${isMobile ? "w-full" : isTablet ? "md:col-span-5" : "lg:col-span-6"} relative`}>
            <div className="relative overflow-hidden rounded-theme border border-theme bg-card-theme p-2 shadow-theme">
              <img
                src={imageUrl}
                alt="Our professional cleaning team"
                className={`${isMobile ? "h-[240px]" : isTablet ? "h-[320px]" : "h-[380px] sm:h-[460px]"} w-full object-cover rounded-theme`}
              />
            </div>

            {/* Overlay Card */}
            <div className={`${isMobile ? "relative mt-3" : "relative sm:absolute sm:-bottom-5 sm:right-4 mt-3 sm:mt-0"} border border-theme bg-card-theme p-3 sm:p-4 rounded-theme shadow-theme backdrop-blur-md max-w-full sm:max-w-xs`}>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-theme-brand text-theme-brand-fg rounded-theme font-bold">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold truncate">
                    Rigorous Vetting
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-theme-primary truncate">
                    100% Insured & FBI Screened
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
