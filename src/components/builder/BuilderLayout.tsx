"use client";

import React, { useState, useEffect } from "react";
import { BuilderState, Page, Section, SectionType, REFERO_THEMES } from "@/types/builder";
import { DEFAULT_BUILDER_STATE } from "@/lib/default-state";
import {
  saveSiteStateToIndexedDB,
  loadSiteStateFromIndexedDB,
} from "@/lib/storage";
import { Sidebar } from "../sidebar/Sidebar";
import { CanvasPreview } from "../canvas/CanvasPreview";
import { ExportZipModal } from "../modals/ExportZipModal";
import {
  Laptop,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Download,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Menu,
} from "lucide-react";

const STORAGE_KEY = "refero_cleaning_builder_state_v1";

export const BuilderLayout: React.FC = () => {
  // Main reactive state
  const [state, setState] = useState<BuilderState>(DEFAULT_BUILDER_STATE);
  const [activePageId, setActivePageId] = useState<string>("page-home");
  const [activeSectionId, setActiveSectionId] = useState<string | null>("sec-hero-1");

  // Viewport mode inside preview canvas
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<BuilderState[]>([DEFAULT_BUILDER_STATE]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Load from localForage (IndexedDB) on mount
  useEffect(() => {
    async function loadInitialState() {
      try {
        const idbState = await loadSiteStateFromIndexedDB();
        if (idbState && idbState.theme && idbState.pages && idbState.pages.length > 0) {
          setState(idbState);
          setHistory([idbState]);
          setHistoryIndex(0);
          setActivePageId(idbState.pages[0].id);
          if (idbState.pages[0]?.sections[0]?.id) {
            setActiveSectionId(idbState.pages[0].sections[0].id);
          }
          return;
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.theme && parsed.pages) {
            setState(parsed);
            setHistory([parsed]);
            setHistoryIndex(0);
            if (parsed.pages[0]?.id) setActivePageId(parsed.pages[0].id);
            if (parsed.pages[0]?.sections[0]?.id) {
              setActiveSectionId(parsed.pages[0].sections[0].id);
            }
          }
        }
      } catch (e) {
        console.warn("Could not load stored builder state", e);
      }
    }

    loadInitialState();
  }, []);

  // Update state with history tracking
  const updateStateWithHistory = (newState: BuilderState) => {
    setState(newState);
    saveSiteStateToIndexedDB(newState);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      // ignore
    }

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newState);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
      saveSiteStateToIndexedDB(history[newIndex]);
      showToast("↩️ Undo action");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
      saveSiteStateToIndexedDB(history[newIndex]);
      showToast("↪️ Redo action");
    }
  };

  const handleReset = () => {
    if (confirm("Reset builder to default cleaning business template? Any unsaved edits will be cleared.")) {
      updateStateWithHistory(DEFAULT_BUILDER_STATE);
      setActivePageId("page-home");
      setActiveSectionId("sec-hero-1");
      localStorage.removeItem(STORAGE_KEY);
      showToast("🔄 Reset to default PureSpark template");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    updateStateWithHistory({
      ...state,
      theme: newTheme,
    });
  };

  const handleBusinessNameChange = (businessName: string) => {
    updateStateWithHistory({
      ...state,
      global: {
        ...state.global,
        businessName,
      },
    });
  };

  const handleLogoUrlChange = (logoUrl: string | null) => {
    updateStateWithHistory({
      ...state,
      global: {
        ...state.global,
        logoUrl,
      },
    });
  };

  const handleNavLinksChange = (navLinks: { label: string; href: string }[]) => {
    updateStateWithHistory({
      ...state,
      global: {
        ...state.global,
        navLinks,
      },
    });
  };

  const handleSelectPage = (pageId: string) => {
    setActivePageId(pageId);
    const targetPage = state.pages.find((p) => p.id === pageId);
    if (targetPage && targetPage.sections.length > 0) {
      setActiveSectionId(targetPage.sections[0].id);
    } else {
      setActiveSectionId(null);
    }
    const pageName = targetPage?.title || "Page";
    showToast(`Switched to: ${pageName}`);
  };

  const handleAddPage = (newPage: Page) => {
    const nextPages = [...state.pages, newPage];
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    setActivePageId(newPage.id);
    if (newPage.sections.length > 0) {
      setActiveSectionId(newPage.sections[0].id);
    }
    showToast(`Created page: "${newPage.title}"`);
  };

  const handleDeletePage = (pageId: string) => {
    if (state.pages.length <= 1) return;
    const deleted = state.pages.find((p) => p.id === pageId);
    const nextPages = state.pages.filter((p) => p.id !== pageId);
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    if (activePageId === pageId) {
      setActivePageId(nextPages[0].id);
      setActiveSectionId(nextPages[0].sections[0]?.id || null);
    }
    showToast(`Deleted page: "${deleted?.title}"`);
  };

  const handleRenamePage = (pageId: string, title: string, slug: string) => {
    const nextPages = state.pages.map((p) =>
      p.id === pageId ? { ...p, title, slug } : p
    );
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
  };

  const handleReorderSections = (newSections: Section[]) => {
    const nextPages = state.pages.map((p) =>
      p.id === activePageId ? { ...p, sections: newSections } : p
    );
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    showToast("Reordered sections");
  };

  const handleToggleHidden = (sectionId: string) => {
    let nowHidden = false;
    const nextPages = state.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const nextSections = p.sections.map((s) => {
        if (s.id === sectionId) {
          nowHidden = !s.isHidden;
          return { ...s, isHidden: nowHidden };
        }
        return s;
      });
      return { ...p, sections: nextSections };
    });
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    showToast(nowHidden ? "Section hidden" : "Section visible");
  };

  const handleDeleteSection = (sectionId: string) => {
    const nextPages = state.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const nextSections = p.sections.filter((s) => s.id !== sectionId);
      return { ...p, sections: nextSections };
    });
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    if (activeSectionId === sectionId) {
      const activeP = nextPages.find((p) => p.id === activePageId);
      setActiveSectionId(activeP?.sections[0]?.id || null);
    }
    showToast("Removed section");
  };

  const handleAddSection = (type: SectionType) => {
    const activePage = state.pages.find((p) => p.id === activePageId) || state.pages[0];
    const newId = `sec-${type}-${Date.now()}`;
    let newSectionData: Record<string, any> = {};

    switch (type) {
      case "hero":
        newSectionData = {
          badge: "✨ Verified Cleaning Professionals",
          headline: "Immaculate Spaces. Zero Stress.",
          subheadline: "Hospital-grade eco solutions and vetted 5-star cleaners for homes and corporate spaces.",
          primaryCtaText: "Get Free Quote",
          primaryCtaLink: "#contact",
          heroImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
          stat1Value: "99.8%",
          stat1Label: "Satisfaction Rate",
          stat2Value: "18,000+",
          stat2Label: "Cleanings Done",
          stat3Value: "100%",
          stat3Label: "Bonded & Insured",
        };
        break;
      case "services":
        newSectionData = {
          badge: "Our Cleaning Menu",
          headline: "Specialized Services For Every Need",
          subheadline: "From recurring home care to heavy-duty move-out restoration.",
          servicesList: [
            {
              id: `srv-${Date.now()}-1`,
              title: "Standard Home Maintenance",
              description: "Weekly or bi-weekly surface dusting, kitchen scrub, bathroom sterilization, and floor polish.",
              priceTag: "From $120",
              features: ["HEPA Vacuuming", "Eco Sprays", "Linen Changing"],
            },
            {
              id: `srv-${Date.now()}-2`,
              title: "Comprehensive Deep Cleaning",
              description: "Detailing baseboards, interior windows, cabinet interiors, oven degreasing, and grout steam.",
              priceTag: "From $190",
              features: ["Grout Treatment", "Oven Interior", "Wall Spot Removal"],
            },
          ],
        };
        break;
      case "about":
        newSectionData = {
          badge: "Why Choose Us",
          headline: "Our 52-Point Sanitation Standard",
          subheadline: "We utilize rigorous infection-control methodology adapted for executive residences and modern workplaces.",
          imageUrl: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1000&q=80",
          checkpoints: [
            "Criminal background checked & bonded crew",
            "100% plant-based EPA registered solutions",
            "Color-coded microfiber cross-contamination barrier",
            "24-Hour complimentary re-clean guarantee",
          ],
        };
        break;
      case "reviews":
        newSectionData = {
          badge: "Client Feedback",
          headline: "Loved By 500+ Local Customers",
          subheadline: "Real reviews from verified homeowners and office managers.",
          reviewsList: [
            {
              id: `rev-${Date.now()}-1`,
              name: "Amanda Brooks",
              role: "Residential Client",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              comment: "The crew arrives exactly on time every other Tuesday. The house is completely immaculate.",
            },
          ],
        };
        break;
      case "faq":
        newSectionData = {
          badge: "Clear Answers",
          headline: "Frequently Asked Questions",
          subheadline: "Everything you need to know before booking.",
          faqList: [
            {
              id: `faq-${Date.now()}-1`,
              question: "Do you supply all cleaning chemicals and tools?",
              answer: "Yes, our team arrives fully equipped with commercial vacuums, steam units, and eco-certified supplies.",
            },
          ],
        };
        break;
      case "contact":
        newSectionData = {
          badge: "Instant Estimate",
          headline: "Schedule Your Spotless Clean",
          subheadline: "Lock in your appointment date in under 60 seconds.",
          phoneNumber: "(800) 842-7873",
          emailAddress: "info@puresparkclean.com",
          serviceArea: "All Metro & Suburban Areas",
          businessHours: "Mon - Sat: 7am - 8pm",
          submitButtonText: "Request Free 60-Second Quote",
        };
        break;
    }

    const newSection: Section = {
      id: newId,
      type,
      isHidden: false,
      order: activePage.sections.length,
      data: newSectionData,
    };

    const nextPages = state.pages.map((p) =>
      p.id === activePageId ? { ...p, sections: [...p.sections, newSection] } : p
    );

    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
    setActiveSectionId(newId);
    showToast(`Added ${type.toUpperCase()} section`);
  };

  const handleUpdateSectionData = (sectionId: string, data: Record<string, any>) => {
    const nextPages = state.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const nextSections = p.sections.map((s) =>
        s.id === sectionId ? { ...s, data } : s
      );
      return { ...p, sections: nextSections };
    });
    updateStateWithHistory({
      ...state,
      pages: nextPages,
    });
  };

  const currentThemeDef = REFERO_THEMES.find((t) => t.id === state.theme) || REFERO_THEMES[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100 relative">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/95 px-4 py-2.5 text-xs font-semibold text-zinc-100 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Toolbar */}
      <header className="h-14 shrink-0 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30">
        {/* Left App Brand & Theme Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white transition-colors shrink-0"
            title={isSidebarOpen ? "Close panel" : "Open panel"}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black text-xs shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline truncate">
              Website Builder
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden md:block" />

          {/* Active Theme Badge */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-700 bg-zinc-800/80 text-xs shrink-0">
            <span className="text-zinc-400 font-medium">Style:</span>
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ backgroundColor: currentThemeDef.brandPrimary }}
              />
              {currentThemeDef.name}
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setViewportMode("desktop");
              showToast("Desktop View");
            }}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewportMode === "desktop"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop View (Full Screen)"
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setViewportMode("tablet");
              showToast("Tablet View (768px)");
            }}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewportMode === "tablet"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Tablet Device View"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setViewportMode("mobile");
              showToast("Mobile View (375px)");
            }}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewportMode === "mobile"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Mobile Phone View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Right Tools: Undo/Redo, Reset, and Export Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="flex items-center rounded-md border border-zinc-800 bg-zinc-900 p-0.5">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
              title="Undo change"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 transition-colors"
              title="Redo change"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Template */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-md border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Reset to default template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Export Website Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-white shadow-md transition-all shrink-0"
            title="Export website code package"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Website</span>
          </button>
        </div>
      </header>

      {/* Main Builder Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop overlay when sidebar is open on small screens */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Left Sidebar (Control Panel) */}
        <div
          className={`shrink-0 transition-all duration-300 z-30 fixed md:relative h-full ${
            isSidebarOpen
              ? "w-80 sm:w-96 left-0 shadow-2xl md:shadow-none"
              : "-left-96 md:left-0 md:w-0 overflow-hidden"
          }`}
        >
          <Sidebar
            state={state}
            activePageId={activePageId}
            activeSectionId={activeSectionId}
            onThemeChange={handleThemeChange}
            onBusinessNameChange={handleBusinessNameChange}
            onLogoUrlChange={handleLogoUrlChange}
            onNavLinksChange={handleNavLinksChange}
            onSelectPage={handleSelectPage}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onRenamePage={handleRenamePage}
            onSelectSection={handleSelectSection}
            onReorderSections={handleReorderSections}
            onToggleHidden={handleToggleHidden}
            onDeleteSection={handleDeleteSection}
            onAddSection={handleAddSection}
            onUpdateSectionData={handleUpdateSectionData}
            onToast={showToast}
          />
        </div>

        {/* Right Canvas (Live Preview) */}
        <CanvasPreview
          state={state}
          activePageId={activePageId}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          viewportMode={viewportMode}
          isInteractive={true}
        />
      </div>

      {/* Export Website Modal */}
      <ExportZipModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        state={state}
        onToast={showToast}
      />
    </div>
  );
};
