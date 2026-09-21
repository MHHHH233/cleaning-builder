"use client";

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface UniversalFooterProps {
  businessName: string;
  logoUrl?: string | null;
  navLinks: { label: string; href: string }[];
}

export const UniversalFooter: React.FC<UniversalFooterProps> = ({
  businessName,
  logoUrl,
  navLinks,
}) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";

  return (
    <footer className="border-t border-theme bg-canvas transition-colors duration-200">
      <div className={`mx-auto max-w-7xl px-4 ${isMobile ? "py-8" : "py-12 sm:px-6 lg:px-8"}`}>
        <div className={`flex ${isMobile ? "flex-col text-center" : "flex-col md:flex-row"} items-center justify-between gap-6`}>
          {/* Brand */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={businessName}
                className="h-8 w-8 object-contain rounded-theme"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center bg-theme-brand text-theme-brand-fg rounded-theme font-bold">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <span className="text-base font-bold tracking-tight text-theme-primary">
              {businessName}
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs sm:text-sm text-theme-muted hover:text-theme-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Trust note */}
          <div className="flex items-center gap-1.5 text-xs text-theme-muted">
            <ShieldCheck className="h-4 w-4 text-theme-primary shrink-0" />
            <span>Fully Insured, Bonded & Certified</span>
          </div>
        </div>

        <div className="mt-8 border-t border-theme/40 pt-6 text-center text-xs text-theme-muted">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
