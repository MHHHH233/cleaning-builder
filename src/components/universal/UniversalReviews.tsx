"use client";

import React from "react";
import { Star, Sparkles, CheckCircle2 } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  comment: string;
}

interface UniversalReviewsProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    reviewsList?: ReviewItem[];
  };
}

export const UniversalReviews: React.FC<UniversalReviewsProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const {
    badge = "Client Testimonials",
    headline = "Trusted By 500+ Luxury Homes & Businesses",
    subheadline = "Read why homeowners, property managers, and corporate directors rely on PureSpark every single week.",
    reviewsList = [],
  } = data || {};

  return (
    <section id="reviews" className={`py-12 ${isMobile ? "py-10" : "sm:py-24"} border-t border-theme transition-colors duration-200`}>
      <div className={`mx-auto max-w-7xl ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
        {/* Header */}
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

        {/* Reviews Grid */}
        <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-3 gap-6"}`}>
          {reviewsList.map((review, idx) => (
            <div
              key={review.id || idx}
              className={`flex flex-col justify-between border border-theme bg-card-theme ${isMobile ? "p-4 sm:p-5" : "p-6"} rounded-theme shadow-theme transition-all duration-300 hover:border-theme/80`}
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`h-4 w-4 ${
                        sIdx < (review.rating || 5)
                          ? "fill-current text-theme-primary"
                          : "text-theme-muted/40"
                      }`}
                    />
                  ))}
                </div>

                <p className={`${isMobile ? "text-xs sm:text-sm" : "text-sm sm:text-base"} text-theme-primary/90 leading-relaxed italic`}>
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-4 sm:mt-6 flex items-center gap-3 pt-3 sm:pt-4 border-t border-theme/50">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-theme object-cover border border-theme"
                  />
                ) : (
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-theme-primary">
                      {review.name}
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-theme-primary" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-theme-muted font-medium">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
