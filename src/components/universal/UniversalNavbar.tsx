"use client";

import React, { useState } from "react";
import { Sparkles, PhoneCall, Menu, X } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface UniversalNavbarProps {
  businessName: string;
  logoUrl?: string | null;
  navLinks: { label: string; href: string }[];
  onCtaClick?: () => void;
  onNavigate?: (href: string) => void;
}

export const UniversalNavbar: React.FC<UniversalNavbarProps> = ({
  businessName,
  logoUrl,
  navLinks,
  onCtaClick,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const viewport = useViewport();
  const isSimulatedMobile = viewport === "mobile";
  const isSimulatedTablet = viewport === "tablet";
  const forceMobileNav = isSimulatedMobile || isSimulatedTablet;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme bg-canvas/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-theme shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center bg-theme-brand text-theme-brand-fg rounded-theme font-bold shadow-theme shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <span className="text-sm sm:text-base font-bold tracking-tight text-theme-primary truncate">
            {businessName}
          </span>
        </div>

        {/* Desktop Navigation Links */}
        {!forceMobileNav && (
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-theme-muted transition-colors hover:text-theme-primary cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isSimulatedMobile && (
            <a
              href="#contact"
              onClick={onCtaClick}
              className={`${forceMobileNav ? "hidden sm:inline-flex" : "hidden sm:inline-flex"} items-center justify-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-theme-brand text-theme-brand-fg rounded-theme shadow-theme transition-all duration-200 hover:opacity-90 active:scale-95 shrink-0`}
            >
              <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Instant Quote</span>
            </a>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${forceMobileNav ? "inline-flex" : "lg:hidden"} p-2 rounded-theme border border-theme text-theme-primary hover:bg-card-theme transition-colors`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`${forceMobileNav ? "block" : "lg:hidden"} border-b border-theme bg-canvas px-4 pt-2 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200`}>
          <nav className="flex flex-col space-y-2 pt-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-theme-muted hover:text-theme-primary hover:bg-card-theme rounded-theme transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-theme/50">
            <a
              href="#contact"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onCtaClick) onCtaClick();
              }}
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-theme-brand text-theme-brand-fg rounded-theme shadow-theme"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Request Instant Quote</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
