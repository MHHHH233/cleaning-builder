import React, { useState } from "react";
import { Page } from "@/types/builder";
import { Plus, FileText, Trash2, Check, ExternalLink } from "lucide-react";

interface PageManagerProps {
  pages: Page[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: (newPage: Page) => void;
  onDeletePage: (pageId: string) => void;
  onRenamePage: (pageId: string, newTitle: string, newSlug: string) => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onRenamePage,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newSlug.trim()
      ? newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
      : newTitle.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const newPage: Page = {
      id: `page-${Date.now()}`,
      slug,
      title: newTitle.trim(),
      sections: [
        {
          id: `sec-hero-${Date.now()}`,
          type: "hero",
          isHidden: false,
          order: 0,
          data: {
            badge: "✨ Specialized Services",
            headline: `${newTitle.trim()} Solutions`,
            subheadline:
              "Professional cleaning certified to the highest hygiene standards with eco-friendly solutions.",
            primaryCtaText: "Request Quote",
            primaryCtaLink: "#contact",
            stat1Value: "100%",
            stat1Label: "Guaranteed",
            stat2Value: "500+",
            stat2Label: "Happy Clients",
            stat3Value: "24/7",
            stat3Label: "Support",
          },
        },
        {
          id: `sec-contact-${Date.now()}`,
          type: "contact",
          isHidden: false,
          order: 1,
          data: {
            badge: "Direct Contact",
            headline: "Schedule Service Today",
            subheadline: "Get an immediate response and confirmed appointment slot.",
            phoneNumber: "(800) 842-7873",
            emailAddress: "dispatch@puresparkclean.com",
            serviceArea: "Metro & Surrounding Areas",
            businessHours: "Mon - Sat: 7:00 AM – 8:00 PM",
            submitButtonText: "Book Appointment",
          },
        },
      ],
    };

    onAddPage(newPage);
    setNewTitle("");
    setNewSlug("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Pages ({pages.length})
        </label>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Page</span>
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="rounded-lg border border-zinc-700 bg-zinc-900/90 p-3 space-y-2.5 shadow-lg"
        >
          <div className="text-xs font-bold text-zinc-200">Add New Page</div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Page Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Move-In Cleaning"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (!newSlug) {
                  setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }
              }}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Slug (URL)</label>
            <div className="flex items-center rounded border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-400">
              <span>/</span>
              <input
                type="text"
                placeholder="move-in-cleaning"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="w-full bg-transparent px-1 py-1.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-900 hover:bg-white"
            >
              Create Page
            </button>
          </div>
        </form>
      )}

      {/* Pages List */}
      <div className="space-y-1.5">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              className={`group flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                isActive
                  ? "border-zinc-500 bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-500"
                  : "border-zinc-800/80 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-zinc-100" : "text-zinc-500"
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">{p.title}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    /{p.slug} • {p.sections.length} sections
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isActive && (
                  <span className="text-[10px] font-mono font-bold bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-200">
                    Active
                  </span>
                )}
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete page "${p.title}"?`)) {
                        onDeletePage(p.id);
                      }
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete page"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
