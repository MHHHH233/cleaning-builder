"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

interface UniversalContactProps {
  data: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    phoneNumber?: string;
    emailAddress?: string;
    serviceArea?: string;
    businessHours?: string;
    submitButtonText?: string;
  };
}

export const UniversalContact: React.FC<UniversalContactProps> = ({ data }) => {
  const viewport = useViewport();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const {
    badge = "Instant Estimate",
    headline = "Ready for an Immaculate Space?",
    subheadline = "Lock in your preferred date in under 60 seconds. Our scheduling team confirms all details instantly.",
    phoneNumber = "(800) 842-7873",
    emailAddress = "dispatch@puresparkclean.com",
    serviceArea = "Greater Metropolitan & Surrounding Suburbs",
    businessHours = "Mon - Sat: 7:00 AM – 8:00 PM",
    submitButtonText = "Request Free 60-Second Quote",
  } = data || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "residential",
    size: "2bed",
    date: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("");

  const serviceLabels: Record<string, string> = {
    residential: "Deep Residential Cleaning",
    commercial: "Commercial Office Care",
    move: "Move-In / Move-Out Deep Clean",
    post: "Post-Construction Detailing",
  };

  const sizeLabels: Record<string, string> = {
    "1bed": "1 Bedroom / 1 Bath",
    "2bed": "2-3 Bedrooms / 2 Baths",
    "4bed": "4+ Bedrooms / 3+ Baths",
    "commercial-small": "Small Office (Under 2,500 sq ft)",
    "commercial-large": "Large Facility (2,500+ sq ft)",
  };

  const getWhatsAppUrl = () => {
    const rawDigits = phoneNumber.replace(/[^0-9]/g, "");
    // Default to international format if starts without country code (US 1 default if 10 digits)
    const intlPhone = rawDigits.length === 10 ? `1${rawDigits}` : rawDigits || "18008427873";
    const serviceName = serviceLabels[formData.serviceType] || formData.serviceType;
    const scopeName = sizeLabels[formData.size] || formData.size;

    const message = `👋 *New Cleaning Quote Inquiry*\n\n` +
      `👤 *Name:* ${formData.name || "N/A"}\n` +
      `📞 *Phone:* ${formData.phone || "N/A"}\n` +
      `✉️ *Email:* ${formData.email || "N/A"}\n` +
      `🧹 *Service:* ${serviceName}\n` +
      `📐 *Scope:* ${scopeName}\n` +
      `\n_Sent via Website Quote Form_`;

    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waUrl = getWhatsAppUrl();
    setLastWhatsAppUrl(waUrl);
    setSubmitted(true);

    // Best practice: redirect / open WhatsApp chat with pre-filled message
    try {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch {
      // fallback in case popup blocked
    }
  };

  return (
    <section id="contact" className={`py-12 ${isMobile ? "py-10" : "sm:py-24"} border-t border-theme transition-colors duration-200`}>
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

        <div className={`${isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"}`}>
          {/* Contact Details Card */}
          <div className={`${isMobile || isTablet ? "w-full" : "lg:col-span-5"} border border-theme bg-card-theme ${isMobile ? "p-4 sm:p-6" : "p-6 sm:p-8"} rounded-theme shadow-theme space-y-5`}>
            <h3 className="text-lg sm:text-xl font-bold text-theme-primary tracking-tight">
              Get in Touch Directly
            </h3>
            <p className="text-xs sm:text-sm text-theme-muted">
              Have unique requirements or need emergency same-day dispatch? Reach our team directly anytime.
            </p>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold">Phone</div>
                  <a href={`tel:${phoneNumber.replace(/[^0-9]/g, "")}`} className="text-xs sm:text-sm font-bold text-theme-primary hover:underline truncate block">
                    {phoneNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-theme bg-canvas border border-theme text-emerald-400">
                  <span className="text-sm">💬</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold">WhatsApp Dispatch</div>
                  <a
                    href={`https://wa.me/${(phoneNumber.replace(/[^0-9]/g, "").length === 10 ? `1${phoneNumber.replace(/[^0-9]/g, "")}` : phoneNumber.replace(/[^0-9]/g, "")) || "18008427873"}?text=${encodeURIComponent("Hello PureSpark! 🧹 I would like to inquire about your cleaning services.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-emerald-400 hover:underline truncate block"
                  >
                    Chat on WhatsApp ↗
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold">Email</div>
                  <a href={`mailto:${emailAddress}`} className="text-xs sm:text-sm font-bold text-theme-primary hover:underline truncate block">
                    {emailAddress}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold">Service Region</div>
                  <span className="text-xs sm:text-sm font-medium text-theme-primary block">{serviceArea}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-theme bg-canvas border border-theme text-theme-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-theme-muted uppercase tracking-wider font-semibold">Operating Hours</div>
                  <span className="text-xs sm:text-sm font-medium text-theme-primary block">{businessHours}</span>
                </div>
              </div>
            </div>

            <div className="rounded-theme border border-theme bg-canvas p-3 sm:p-4 text-[11px] sm:text-xs text-theme-muted">
              🔒 <strong className="text-theme-primary">Privacy Note:</strong> Your contact details are exclusively used for your appointment and never shared.
            </div>
          </div>

          {/* Interactive Quote Form */}
          <div className={`${isMobile || isTablet ? "w-full" : "lg:col-span-7"} border border-theme bg-card-theme ${isMobile ? "p-4 sm:p-6" : "p-6 sm:p-8"} rounded-theme shadow-theme`}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 shadow-lg">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-theme-primary">Quote Request Sent via WhatsApp!</h4>
                <p className="max-w-md text-xs sm:text-sm text-theme-muted leading-relaxed">
                  We opened your WhatsApp with the pre-filled quote details. Our dispatch supervisor is ready to confirm your booking and reply instantly.
                </p>

                {lastWhatsAppUrl && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <a
                      href={lastWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-theme bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <span>💬 Continue on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-theme-muted hover:text-theme-primary underline py-1"
                    >
                      Submit Another Request
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3 sm:gap-4`}>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-canvas border border-theme rounded-theme text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-canvas border border-theme rounded-theme text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-canvas border border-theme rounded-theme text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>

                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3 sm:gap-4`}>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                      Service Type
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-canvas border border-theme rounded-theme text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    >
                      <option value="residential">Deep Residential Cleaning</option>
                      <option value="commercial">Commercial Office Care</option>
                      <option value="move">Move-In / Move-Out Deep Clean</option>
                      <option value="post">Post-Construction Detailing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                      Property Scope / Frequency
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-canvas border border-theme rounded-theme text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    >
                      <option value="1bed">1 Bedroom / 1 Bath</option>
                      <option value="2bed">2-3 Bedrooms / 2 Baths</option>
                      <option value="4bed">4+ Bedrooms / 3+ Baths</option>
                      <option value="commercial-small">Small Office (Under 2,500 sq ft)</option>
                      <option value="commercial-large">Large Facility (2,500+ sq ft)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-5 font-bold text-xs sm:text-sm bg-theme-brand text-theme-brand-fg rounded-theme shadow-theme transition-all duration-200 hover:opacity-90 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitButtonText}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
