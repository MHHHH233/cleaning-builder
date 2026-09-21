import React, { useState } from "react";
import { BuilderState, Page, Section, SectionType } from "@/types/builder";
import { GlobalSettings } from "./GlobalSettings";
import { PageManager } from "./PageManager";
import { SectionManager } from "./SectionManager";
import { ContentEditor } from "./ContentEditor";
import {
  Palette,
  Layers,
  Edit3,
  Sliders,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  state: BuilderState;
  activePageId: string;
  activeSectionId: string | null;
  onThemeChange: (theme: string) => void;
  onBusinessNameChange: (name: string) => void;
  onLogoUrlChange: (url: string | null) => void;
  onNavLinksChange: (links: { label: string; href: string }[]) => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: (newPage: Page) => void;
  onDeletePage: (pageId: string) => void;
  onRenamePage: (pageId: string, title: string, slug: string) => void;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (newSections: Section[]) => void;
  onToggleHidden: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: SectionType) => void;
  onUpdateSectionData: (sectionId: string, data: Record<string, any>) => void;
  onToast?: (message: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  activePageId,
  activeSectionId,
  onThemeChange,
  onBusinessNameChange,
  onLogoUrlChange,
  onNavLinksChange,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onRenamePage,
  onSelectSection,
  onReorderSections,
  onToggleHidden,
  onDeleteSection,
  onAddSection,
  onUpdateSectionData,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<"global" | "sections" | "content">(
    "global"
  );

  const activePage =
    state.pages.find((p) => p.id === activePageId) || state.pages[0];

  const activeSection =
    activePage?.sections.find((s) => s.id === activeSectionId) || null;

  // Automatically switch tab to content editor if user selects a section
  const handleSelectSection = (sectionId: string) => {
    onSelectSection(sectionId);
    setActiveTab("content");
  };

  return (
    <aside className="flex flex-col h-full w-full bg-zinc-950 border-r border-zinc-800 text-zinc-200">
      {/* Sidebar Header / Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/80 p-1.5 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("global")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === "global"
              ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === "sections"
              ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Structure</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all relative ${
            activeTab === "content"
              ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Editor</span>
          {activeSection && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 absolute top-2 right-2 animate-pulse" />
          )}
        </button>
      </div>

      {/* Sidebar Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === "global" && (
          <GlobalSettings
            theme={state.theme}
            onThemeChange={onThemeChange}
            businessName={state.global.businessName}
            onBusinessNameChange={onBusinessNameChange}
            logoUrl={state.global.logoUrl}
            onLogoUrlChange={onLogoUrlChange}
            navLinks={state.global.navLinks}
            onNavLinksChange={onNavLinksChange}
            onToast={onToast}
          />
        )}

        {activeTab === "sections" && (
          <div className="space-y-6">
            <PageManager
              pages={state.pages}
              activePageId={activePageId}
              onSelectPage={onSelectPage}
              onAddPage={onAddPage}
              onDeletePage={onDeletePage}
              onRenamePage={onRenamePage}
            />

            <div className="pt-4 border-t border-zinc-800">
              <SectionManager
                sections={activePage?.sections || []}
                activeSectionId={activeSectionId}
                onSelectSection={handleSelectSection}
                onReorderSections={onReorderSections}
                onToggleHidden={onToggleHidden}
                onDeleteSection={onDeleteSection}
                onAddSection={onAddSection}
              />
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <ContentEditor
            section={activeSection}
            businessName={state.global.businessName}
            onUpdateData={onUpdateSectionData}
            onToast={onToast}
          />
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-300 font-medium">Auto-saved locally</span>
        </div>
        <span className="font-semibold text-zinc-200 capitalize">
          {state.theme.replace("-", " ")}
        </span>
      </div>
    </aside>
  );
};
