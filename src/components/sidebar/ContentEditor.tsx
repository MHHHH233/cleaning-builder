"use client";

import React, { useRef, useState } from "react";
import { Section } from "@/types/builder";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Star,
  Zap,
} from "lucide-react";
import {
  generateAICopy,
  generateRandomService,
  generateRandomTestimonial,
} from "@/lib/ai-generator";
import { AICopyStudioModal } from "../modals/AICopyStudioModal";

interface ContentEditorProps {
  section: Section | null;
  businessName?: string;
  onUpdateData: (sectionId: string, newData: Record<string, any>) => void;
  onToast?: (message: string) => void;
}

const CLEANING_PRESET_IMAGES = [
  {
    name: "Living Room Pristine",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Modern Kitchen Sanitized",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Clean Staff Team",
    url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Commercial Executive Office",
    url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sparkling Bathroom Marble",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  },
];

export const ContentEditor: React.FC<ContentEditorProps> = ({
  section,
  businessName = "PureSpark Cleaners",
  onUpdateData,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI Studio Modal State
  const [aiStudioTarget, setAiStudioTarget] = useState<{
    fieldName: string;
    fieldLabel: string;
    currentValue: string;
  } | null>(null);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 rounded-lg border border-dashed border-zinc-800">
        <Sparkles className="h-8 w-8 text-zinc-600 mb-2" />
        <p className="text-xs font-medium text-zinc-400">
          No Section Selected
        </p>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
          Click any section in the Live Preview Canvas or Section Manager to edit its content and media.
        </p>
      </div>
    );
  }

  const { data } = section;

  const updateField = (key: string, value: any) => {
    onUpdateData(section.id, {
      ...data,
      [key]: value,
    });
  };

  const handleQuickAIGenerate = (fieldKey: string, fieldLabel: string) => {
    const aiText = generateAICopy(fieldKey);
    updateField(fieldKey, aiText);
    if (onToast) onToast(`✨ Updated ${fieldLabel} with AI`);
  };

  const openAiStudio = (fieldKey: string, fieldLabel: string, currentVal: string) => {
    setAiStudioTarget({
      fieldName: fieldKey,
      fieldLabel,
      currentValue: currentVal || "",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { storeUserImageBlob } = await import("@/lib/storage");
        const { previewUrl } = await storeUserImageBlob(`${section.id}_${fieldKey}`, file);
        updateField(fieldKey, previewUrl);
        if (onToast) onToast("📸 Photo updated successfully");
      } catch (err) {
        const blobUrl = URL.createObjectURL(file);
        updateField(fieldKey, blobUrl);
        if (onToast) onToast("📸 Photo updated successfully");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
            {section.type} Editor
          </span>
          <h3 className="text-sm font-bold text-zinc-100 mt-1">
            Section Content & Assets
          </h3>
        </div>
      </div>

      {/* Badge Field */}
      {"badge" in data && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Badge Tag
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openAiStudio("badge", "Badge Tag", data.badge || "")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
                title="Open AI Studio with prompt & suggestions"
              >
                <Sparkles className="h-3 w-3" />
                <span>AI Suggestions</span>
              </button>
            </div>
          </div>
          <input
            type="text"
            value={data.badge || ""}
            onChange={(e) => updateField("badge", e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      )}

      {/* Headline / Title */}
      {("headline" in data || "title" in data) && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Main Headline
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  openAiStudio(
                    "headline",
                    "Main Headline",
                    data.headline || data.title || ""
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
                title="Open AI Studio with prompt & suggestions"
              >
                <Sparkles className="h-3 w-3" />
                <span>AI Suggestions</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAIGenerate("headline", "Headline")}
                className="p-1 rounded text-zinc-400 hover:text-amber-300 hover:bg-zinc-800"
                title="Quick 1-Click Fill"
              >
                <Zap className="h-3 w-3" />
              </button>
            </div>
          </div>
          <input
            type="text"
            value={data.headline || data.title || ""}
            onChange={(e) =>
              updateField(
                "headline" in data ? "headline" : "title",
                e.target.value
              )
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-semibold"
          />
        </div>
      )}

      {/* Subheadline / Subtitle */}
      {("subheadline" in data || "subtitle" in data) && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Subheadline / Description
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  openAiStudio(
                    "subheadline",
                    "Subheadline",
                    data.subheadline || data.subtitle || ""
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
              >
                <Sparkles className="h-3 w-3" />
                <span>AI Suggestions</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAIGenerate("subheadline", "Subheadline")}
                className="p-1 rounded text-zinc-400 hover:text-amber-300 hover:bg-zinc-800"
                title="Quick 1-Click Fill"
              >
                <Zap className="h-3 w-3" />
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={data.subheadline || data.subtitle || ""}
            onChange={(e) =>
              updateField(
                "subheadline" in data ? "subheadline" : "subtitle",
                e.target.value
              )
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      )}

      {/* Image Upload */}
      {("heroImageUrl" in data || "imageUrl" in data) && (
        <div className="pt-2 border-t border-zinc-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Section Photo
          </label>
          <div className="space-y-3">
            <div className="relative h-36 w-full rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900">
              <img
                src={data.heroImageUrl || data.imageUrl}
                alt="Section media preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileUpload(
                    e,
                    "heroImageUrl" in data ? "heroImageUrl" : "imageUrl"
                  )
                }
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div>
              <div className="text-[11px] text-zinc-500 mb-1.5">
                Or choose a curated photo:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CLEANING_PRESET_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      updateField(
                        "heroImageUrl" in data ? "heroImageUrl" : "imageUrl",
                        preset.url
                      );
                      if (onToast) onToast(`📸 Applied ${preset.name} image`);
                    }}
                    className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300 hover:border-zinc-600 hover:text-white"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero CTA Inputs */}
      {"primaryCtaText" in data && (
        <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] text-zinc-400">
                Primary CTA Text
              </label>
              <button
                type="button"
                onClick={() =>
                  openAiStudio("primaryCtaText", "Button CTA", data.primaryCtaText || "")
                }
                className="text-[10px] text-amber-400 hover:underline"
              >
                ✨ AI
              </button>
            </div>
            <input
              type="text"
              value={data.primaryCtaText || ""}
              onChange={(e) => updateField("primaryCtaText", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Primary CTA Link
            </label>
            <input
              type="text"
              value={data.primaryCtaLink || ""}
              onChange={(e) => updateField("primaryCtaLink", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 font-mono"
            />
          </div>
        </div>
      )}

      {/* Services List Editor */}
      {section.type === "services" && Array.isArray(data.servicesList) && (
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Services Cards ({data.servicesList.length})
            </label>
            <button
              type="button"
              onClick={() => {
                const sample = generateRandomService();
                updateField("servicesList", [
                  ...data.servicesList,
                  { id: `srv-${Date.now()}`, ...sample },
                ]);
                if (onToast) onToast("✨ Generated new AI Service card");
              }}
              className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300"
            >
              <Sparkles className="h-3 w-3" />
              <span>✨ Add AI Service</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.servicesList.map((srv: any, sIdx: number) => (
              <div
                key={srv.id || sIdx}
                className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={srv.title}
                    onChange={(e) => {
                      const updated = [...data.servicesList];
                      updated[sIdx].title = e.target.value;
                      updateField("servicesList", updated);
                    }}
                    className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-100 w-2/3"
                  />
                  <input
                    type="text"
                    value={srv.priceTag || ""}
                    onChange={(e) => {
                      const updated = [...data.servicesList];
                      updated[sIdx].priceTag = e.target.value;
                      updateField("servicesList", updated);
                    }}
                    className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 font-mono w-1/4 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateField(
                        "servicesList",
                        data.servicesList.filter((_: any, i: number) => i !== sIdx)
                      );
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={srv.description}
                  onChange={(e) => {
                    const updated = [...data.servicesList];
                    updated[sIdx].description = e.target.value;
                    updateField("servicesList", updated);
                  }}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List Editor */}
      {section.type === "reviews" && Array.isArray(data.reviewsList) && (
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Client Testimonials ({data.reviewsList.length})
            </label>
            <button
              type="button"
              onClick={() => {
                const sample = generateRandomTestimonial();
                updateField("reviewsList", [
                  ...data.reviewsList,
                  { id: `rev-${Date.now()}`, ...sample },
                ]);
                if (onToast) onToast("✨ Generated verified AI Testimonial");
              }}
              className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300"
            >
              <Sparkles className="h-3 w-3" />
              <span>✨ Add AI Review</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.reviewsList.map((rev: any, rIdx: number) => (
              <div
                key={rev.id || rIdx}
                className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={rev.name}
                    onChange={(e) => {
                      const updated = [...data.reviewsList];
                      updated[rIdx].name = e.target.value;
                      updateField("reviewsList", updated);
                    }}
                    className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateField(
                        "reviewsList",
                        data.reviewsList.filter((_: any, i: number) => i !== rIdx)
                      );
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={rev.role}
                  onChange={(e) => {
                    const updated = [...data.reviewsList];
                    updated[rIdx].role = e.target.value;
                    updateField("reviewsList", updated);
                  }}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
                />
                <textarea
                  rows={2}
                  value={rev.comment}
                  onChange={(e) => {
                    const updated = [...data.reviewsList];
                    updated[rIdx].comment = e.target.value;
                    updateField("reviewsList", updated);
                  }}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ List Editor */}
      {section.type === "faq" && Array.isArray(data.faqList) && (
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Questions & Answers ({data.faqList.length})
            </label>
            <button
              type="button"
              onClick={() => {
                updateField("faqList", [
                  ...data.faqList,
                  {
                    id: `faq-${Date.now()}`,
                    question: "What eco-friendly products do you utilize?",
                    answer:
                      "We use 100% plant-derived, non-toxic and cruelty-free disinfectants certified by Green Seal and the EPA.",
                  },
                ]);
                if (onToast) onToast("✨ Added new FAQ item");
              }}
              className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-700"
            >
              <Plus className="h-3 w-3" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.faqList.map((faq: any, fIdx: number) => (
              <div
                key={faq.id || fIdx}
                className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...data.faqList];
                      updated[fIdx].question = e.target.value;
                      updateField("faqList", updated);
                    }}
                    className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-100 w-full mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateField(
                        "faqList",
                        data.faqList.filter((_: any, i: number) => i !== fIdx)
                      );
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...data.faqList];
                    updated[fIdx].answer = e.target.value;
                    updateField("faqList", updated);
                  }}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section Fields */}
      {section.type === "contact" && (
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Contact Channels
          </label>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Phone Number</label>
            <input
              type="text"
              value={data.phoneNumber || ""}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              value={data.emailAddress || ""}
              onChange={(e) => updateField("emailAddress", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Service Region</label>
            <input
              type="text"
              value={data.serviceArea || ""}
              onChange={(e) => updateField("serviceArea", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Operating Hours</label>
            <input
              type="text"
              value={data.businessHours || ""}
              onChange={(e) => updateField("businessHours", e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
          </div>
        </div>
      )}

      {/* Modal: AI Copy Studio */}
      {aiStudioTarget && (
        <AICopyStudioModal
          isOpen={true}
          onClose={() => setAiStudioTarget(null)}
          fieldName={aiStudioTarget.fieldName}
          fieldLabel={aiStudioTarget.fieldLabel}
          currentValue={aiStudioTarget.currentValue}
          businessName={businessName}
          onApply={(newVal) => {
            updateField(
              aiStudioTarget.fieldName in data
                ? aiStudioTarget.fieldName
                : "title" in data
                ? "title"
                : aiStudioTarget.fieldName,
              newVal
            );
            if (onToast) onToast(`✨ Applied AI suggestion to ${aiStudioTarget.fieldLabel}`);
          }}
        />
      )}
    </div>
  );
};
