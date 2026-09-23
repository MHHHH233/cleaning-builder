import React, { useRef } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Upload, Plus, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import { generateAICopy } from "@/lib/ai-generator";
import { AnimationStyle, ANIMATION_STYLES, Page } from "@/types/builder";

interface GlobalSettingsProps {
  theme: string;
  onThemeChange: (newTheme: string) => void;
  animationStyle?: AnimationStyle;
  onAnimationStyleChange?: (newStyle: AnimationStyle) => void;
  businessName: string;
  onBusinessNameChange: (newName: string) => void;
  logoUrl: string | null;
  onLogoUrlChange: (newUrl: string | null) => void;
  navLinks: { label: string; href: string }[];
  onNavLinksChange: (newLinks: { label: string; href: string }[]) => void;
  pages?: Page[];
  activePageId?: string;
  onSelectPage?: (pageId: string) => void;
  onAddPage?: (newPage: Page) => void;
  onToast?: (message: string) => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  theme,
  onThemeChange,
  animationStyle = "slide-up",
  onAnimationStyleChange,
  businessName,
  onBusinessNameChange,
  logoUrl,
  onLogoUrlChange,
  navLinks,
  onNavLinksChange,
  pages = [],
  activePageId,
  onSelectPage,
  onAddPage,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { storeUserImageBlob } = await import("@/lib/storage");
        const { previewUrl } = await storeUserImageBlob("global_logo", file);
        onLogoUrlChange(previewUrl);
        if (onToast) onToast("📸 Brand logo uploaded");
      } catch (err) {
        const previewUrl = URL.createObjectURL(file);
        onLogoUrlChange(previewUrl);
        if (onToast) onToast("📸 Brand logo uploaded");
      }
    }
  };

  const handleAddLink = () => {
    onNavLinksChange([...navLinks, { label: "New Link", href: "#" }]);
    if (onToast) onToast("Added new navigation link");
  };

  const handleAddLinkForPage = (page: Page) => {
    const href = page.slug === "home" ? "#hero" : `/${page.slug}`;
    onNavLinksChange([...navLinks, { label: page.title, href }]);
    if (onToast) onToast(`Added link to "${page.title}"`);
  };

  const handleUpdateLink = (index: number, field: "label" | "href", val: string) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: val };
    onNavLinksChange(updated);
  };

  const handleRemoveLink = (index: number) => {
    onNavLinksChange(navLinks.filter((_, i) => i !== index));
    if (onToast) onToast("Removed navigation link");
  };

  const handleAIBusinessName = () => {
    const names = [
      "PureSpark Commercial & Residential Cleaners",
      "Apex Pristine Facility Care",
      "Sanitex Medical & Executive Cleaning",
      "EverGreen Botanical Cleaning Co.",
      "LuxeAura Architectural Detailing",
      "Vanguard 24/7 Janitorial Services",
    ];
    const picked = names[Math.floor(Math.random() * names.length)];
    onBusinessNameChange(picked);
    if (onToast) onToast(`✨ AI generated name: "${picked}"`);
  };

  return (
    <div className="space-y-6">
      {/* Business Name */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Business Name
          </label>
          <button
            type="button"
            onClick={handleAIBusinessName}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>✨ AI Name</span>
          </button>
        </div>
        <input
          type="text"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
          className="w-full rounded-md border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          Brand Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900 overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-zinc-600" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Logo</span>
              </button>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onLogoUrlChange(null);
                    if (onToast) onToast("Logo cleared");
                  }}
                  className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-rose-400 hover:bg-zinc-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              Recommended: transparent PNG or SVG format.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Switcher Component */}
      <div className="pt-2 border-t border-zinc-800">
        <ThemeSwitcher
          activeTheme={theme}
          onSelectTheme={onThemeChange}
          onToast={onToast}
        />
      </div>

      {/* Animation Style Selector */}
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Page Animation Style
          </label>
          <span className="text-[11px] font-mono text-amber-400 capitalize">
            {animationStyle}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-snug">
          Select motion effects applied to sections and page transitions:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_STYLES.map((anim) => {
            const isSelected = animationStyle === anim.id;
            return (
              <button
                key={anim.id}
                type="button"
                onClick={() => {
                  if (onAnimationStyleChange) onAnimationStyleChange(anim.id);
                  if (onToast) onToast(`Applied animation: ${anim.name}`);
                }}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-amber-400/80 bg-zinc-800 text-white ring-1 ring-amber-400 shadow-sm"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span>{anim.icon}</span>
                  <span>{anim.name}</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                  {anim.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navbar Links Manager with Page Links */}
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Navigation Links ({navLinks.length})
            </label>
            <span className="text-[11px] text-zinc-500">
              Interactive links shown in your website header
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        {/* Quick Link Helper from Pages */}
        {pages.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5 space-y-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Quick link to existing page:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pages.map((p) => {
                const targetHref = p.slug === "home" ? "#hero" : `/${p.slug}`;
                const alreadyLinked = navLinks.some((l) => l.href === targetHref || l.href === `#${p.slug}`);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddLinkForPage(p)}
                    className={`text-[11px] px-2 py-1 rounded border flex items-center gap-1 transition-colors ${
                      alreadyLinked
                        ? "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium"
                    }`}
                    title={`Add navbar link for ${p.title}`}
                  >
                    <span>+ {p.title}</span>
                    <span className="text-[9px] font-mono opacity-60">({p.slug})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {navLinks.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 p-2"
            >
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                className="w-1/2 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <input
                type="text"
                placeholder="#hero or /services"
                value={link.href}
                onChange={(e) => handleUpdateLink(idx, "href", e.target.value)}
                className="w-1/2 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(idx)}
                className="rounded p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                title="Remove link"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
          💡 <strong>How links work:</strong> Use <code className="text-zinc-400 font-mono">/slug</code> to navigate between pages (e.g. <code className="text-zinc-400 font-mono">/services</code>), or <code className="text-zinc-400 font-mono">#anchor</code> to jump to a section on page (e.g. <code className="text-zinc-400 font-mono">#contact</code>). Clicking any link in the canvas preview switches to that page or section!
        </p>
      </div>
    </div>
  );
};
