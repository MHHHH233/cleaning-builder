"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface UniversalHeroProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    heroImageUrl?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
  };
}

export const UniversalHero: React.FC<UniversalHeroProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const {
    badge = "✨ Verified 5-Star Commercial & Residential Cleaning",
    headline = "Hospital-Grade Clean. Effortless Luxury.",
    subheadline = "We transform homes and executive offices into immaculate, allergen-free sanctuaries using 100% non-toxic botanical disinfectants.",
    primaryCtaText = "Get Instant Quote",
    primaryCtaLink = "#contact",
    secondaryCtaText = "Explore Services",
    secondaryCtaLink = "#services",
    heroImageUrl = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    stat1Value = "18,500+",
    stat1Label = "Spaces Cleaned",
    stat2Value = "99.8%",
    stat2Label = "Satisfaction Rate",
    stat3Value = "100%",
    stat3Label = "Bonded & Insured",
  } = data || {};

  return (
    <section id="hero" className={`relative overflow-hidden ${isMobile ? "py-8" : isTablet ? "py-12" : "py-12 sm:py-20 lg:py-24"} transition-colors duration-200`}>
      <div className={`mx-auto max-w-7xl ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className={`grid items-center gap-8 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-1 md:grid-cols-12 gap-6" : "grid-cols-1 lg:gap-12 lg:grid-cols-12"}`}>
          {/* Text Content */}
          <div className={`${isMobile ? "w-full" : isTablet ? "md:col-span-7" : "lg:col-span-7"} space-y-4 sm:space-y-6`}>
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider border border-theme bg-card-theme rounded-theme text-theme-primary shadow-theme max-w-full">
                <Sparkles className="h-3.5 w-3.5 text-theme-primary opacity-80 shrink-0" />
                <span className="truncate">{badge}</span>
              </div>
            )}

            <h1 className={`${isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl md:text-4xl" : "text-3xl sm:text-5xl lg:text-6xl"} font-extrabold tracking-tight text-theme-primary leading-[1.15]`}>
              {headline}
            </h1>

            <p className={`max-w-2xl ${isMobile ? "text-sm" : "text-sm sm:text-base lg:text-lg"} text-theme-muted leading-relaxed`}>
              {subheadline}
            </p>

            {/* CTAs */}
            <div className={`flex ${isMobile ? "flex-col" : "flex-col sm:flex-row"} items-stretch sm:items-center gap-3 sm:gap-4 pt-2`}>
              <a
                href={primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold bg-theme-brand text-theme-brand-fg rounded-theme shadow-theme transition-all duration-200 hover:opacity-90 active:scale-95 text-center"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              {secondaryCtaText && (
                <a
                  href={secondaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold border border-theme bg-card-theme text-theme-primary rounded-theme transition-all duration-200 hover:bg-theme-muted/10 active:scale-95 text-center"
                >
                  <span>{secondaryCtaText}</span>
                </a>
              )}
            </div>

            {/* Key Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 pt-2 sm:pt-4 text-xs sm:text-sm text-theme-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-theme-primary shrink-0" />
                <span>100% Non-Toxic & Pet Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-theme-primary shrink-0" />
                <span>24h Re-Clean Guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className={`${isMobile ? "w-full" : isTablet ? "md:col-span-5" : "lg:col-span-5"} relative mt-2 sm:mt-0`}>
            <div className="relative overflow-hidden rounded-theme border border-theme bg-card-theme p-1.5 sm:p-2 shadow-theme">
              <img
                src={heroImageUrl}
                alt="Pristine cleaning service in action"
                className={`${isMobile ? "h-[220px]" : isTablet ? "h-[300px]" : "h-[260px] sm:h-[380px] lg:h-[440px]"} w-full object-cover rounded-theme transition-transform duration-500 hover:scale-[1.02]`}
              />
              <div className="absolute inset-0 rounded-theme bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Trust Badge */}
            <div className={`${isMobile ? "relative mt-3" : "relative sm:absolute sm:-bottom-5 sm:left-4 mt-3 sm:mt-0"} border border-theme bg-card-theme p-3 sm:p-4 rounded-theme shadow-theme flex items-center gap-3 backdrop-blur-md max-w-full sm:max-w-xs`}>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-theme-brand text-theme-brand-fg rounded-theme font-bold">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs text-theme-muted font-semibold uppercase tracking-wider truncate">
                  Quality Guaranteed
                </div>
                <div className="text-xs sm:text-sm font-bold text-theme-primary truncate">
                  100% Bonded & Vetted Crew
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={`mt-8 sm:mt-14 lg:mt-20 grid ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"} gap-3 sm:gap-4`}>
          <div className="border border-theme bg-card-theme p-4 sm:p-6 rounded-theme shadow-theme transition-all">
            <div className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl lg:text-4xl"} font-black text-theme-primary tracking-tight`}>
              {stat1Value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-theme-muted font-medium">
              {stat1Label}
            </div>
          </div>

          <div className="border border-theme bg-card-theme p-4 sm:p-6 rounded-theme shadow-theme transition-all">
            <div className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl lg:text-4xl"} font-black text-theme-primary tracking-tight`}>
              {stat2Value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-theme-muted font-medium">
              {stat2Label}
            </div>
          </div>

          <div className="border border-theme bg-card-theme p-4 sm:p-6 rounded-theme shadow-theme transition-all">
            <div className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl lg:text-4xl"} font-black text-theme-primary tracking-tight`}>
              {stat3Value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-theme-muted font-medium">
              {stat3Label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
