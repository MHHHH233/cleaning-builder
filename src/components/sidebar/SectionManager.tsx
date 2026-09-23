import React, { useState } from "react";
import { Page, Section, SectionType } from "@/types/builder";
import {
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
  Sparkles,
  Layers,
} from "lucide-react";

interface SectionManagerProps {
  activePage?: Page;
  sections: Section[];
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (newSections: Section[]) => void;
  onToggleHidden: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: SectionType) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  activePage,
  sections,
  activeSectionId,
  onSelectSection,
  onReorderSections,
  onToggleHidden,
  onDeleteSection,
  onAddSection,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // update order numbers
    newSections.forEach((s, idx) => {
      s.order = idx;
    });

    onReorderSections(newSections);
  };

  const handleAdd = (type: SectionType) => {
    onAddSection(type);
    setShowAddMenu(false);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Current Page Context Header */}
      <div className="rounded-lg border border-zinc-700/80 bg-zinc-900/90 p-3 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Active Page
            </div>
            <div className="text-xs font-bold text-zinc-100 truncate">
              {activePage?.title || "Page"} <span className="text-zinc-500 font-mono font-normal">/{activePage?.slug || "home"}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            {sections.length} sections
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-snug">
          Sections below belong to <strong className="text-zinc-200">{activePage?.title}</strong>. Click any section to edit or add new blocks.
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Page Sections ({sections.length})
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Section</span>
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-8 z-50 w-52 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 shadow-2xl space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                Select Section Template
              </div>
              <button
                type="button"
                onClick={() => handleAdd("hero")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>Hero Banner</span>
                <span className="text-[10px] font-mono text-zinc-500">CTA & Stats</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd("services")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>Services & Pricing</span>
                <span className="text-[10px] font-mono text-zinc-500">Feature Grid</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd("about")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>About & Standards</span>
                <span className="text-[10px] font-mono text-zinc-500">Protocol & Trust</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd("reviews")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>Customer Reviews</span>
                <span className="text-[10px] font-mono text-zinc-500">Testimonials</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd("faq")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>FAQ Accordion</span>
                <span className="text-[10px] font-mono text-zinc-500">Q&A</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd("contact")}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-zinc-200 hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>Quote & Contact</span>
                <span className="text-[10px] font-mono text-zinc-500">Instant Estimate</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-1.5">
        {sortedSections.map((section, index) => {
          const isSelected = section.id === activeSectionId;
          return (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`group flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                isSelected
                  ? "border-zinc-400 bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-500"
                  : "border-zinc-800/80 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
              } ${section.isHidden ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="h-4 w-4 text-zinc-600 shrink-0 cursor-grab" />
                <div className="truncate">
                  <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span>{section.type}</span>
                    {section.isHidden && (
                      <span className="text-[9px] px-1 py-0.2 bg-zinc-700 text-zinc-400 rounded font-normal lowercase">
                        hidden
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {section.data?.headline || section.data?.badge || `Section #${index + 1}`}
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {/* Reorder buttons */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, "up")}
                  className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
                  title="Move section up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === sortedSections.length - 1}
                  onClick={() => moveSection(index, "down")}
                  className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
                  title="Move section down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {/* Hide / Show Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleHidden(section.id)}
                  className={`p-1 transition-colors ${
                    section.isHidden ? "text-amber-400 hover:text-amber-300" : "text-zinc-500 hover:text-zinc-200"
                  }`}
                  title={section.isHidden ? "Unhide section" : "Hide section"}
                >
                  {section.isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove this ${section.type} section?`)) {
                      onDeleteSection(section.id);
                    }
                  }}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete section"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
