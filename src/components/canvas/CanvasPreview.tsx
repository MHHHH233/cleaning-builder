import React from "react";
import { BuilderState } from "@/types/builder";
import { UniversalNavbar } from "../universal/UniversalNavbar";
import { UniversalSectionRenderer } from "../universal/UniversalSectionRenderer";
import { UniversalFooter } from "../universal/UniversalFooter";
import { ViewportProvider } from "@/contexts/ViewportContext";
import { Wifi, Battery, Signal } from "lucide-react";

interface CanvasPreviewProps {
  state: BuilderState;
  activePageId: string;
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectPage?: (pageId: string) => void;
  viewportMode?: "desktop" | "tablet" | "mobile";
  isInteractive?: boolean;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  state,
  activePageId,
  activeSectionId,
  onSelectSection,
  onSelectPage,
  viewportMode = "desktop",
  isInteractive = true,
}) => {
  const outerContainerRef = React.useRef<HTMLDivElement>(null);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);
  const tabletScrollRef = React.useRef<HTMLDivElement>(null);

  const activePage =
    state.pages.find((p) => p.id === activePageId) || state.pages[0];

  const sortedSections = [...(activePage?.sections || [])].sort(
    (a, b) => a.order - b.order
  );

  // Handle interactive clicks on Navbar links inside preview
  const handleNavigate = (href: string) => {
    const cleanTarget = href.replace(/^[/#]+/, "").toLowerCase();
    
    // Check if link matches a page slug or title
    const targetPage = state.pages.find(
      (p) =>
        p.slug.toLowerCase() === cleanTarget ||
        p.id.toLowerCase() === cleanTarget ||
        p.title.toLowerCase() === cleanTarget
    );

    if (targetPage && onSelectPage) {
      onSelectPage(targetPage.id);
      return;
    }

    // Check if link is an anchor on the current page
    if (href.startsWith("#")) {
      const elementId = href.replace("#", "");
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Check if section exists on another page
    const pageWithSection = state.pages.find((p) =>
      p.sections.some((s) => s.type === cleanTarget || s.id === cleanTarget)
    );
    if (pageWithSection && onSelectPage) {
      onSelectPage(pageWithSection.id);
    }
  };

  // Auto-scroll to top whenever switching pages or viewport modes
  React.useEffect(() => {
    if (outerContainerRef.current) {
      outerContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    if (tabletScrollRef.current) {
      tabletScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activePageId, viewportMode]);

  // Forward mouse wheel anywhere on canvas to active device mockup in mobile/tablet mode
  const handleOuterWheel = (e: React.WheelEvent) => {
    if (viewportMode === "mobile" && mobileScrollRef.current) {
      if (!mobileScrollRef.current.contains(e.target as Node)) {
        mobileScrollRef.current.scrollTop += e.deltaY;
      }
    } else if (viewportMode === "tablet" && tabletScrollRef.current) {
      if (!tabletScrollRef.current.contains(e.target as Node)) {
        tabletScrollRef.current.scrollTop += e.deltaY;
      }
    }
  };

  return (
    <div
      ref={outerContainerRef}
      onWheel={handleOuterWheel}
      className="flex-1 overflow-y-auto overflow-x-auto bg-zinc-950 p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-start min-w-0 select-none sm:select-auto"
    >
      {/* Mobile Device Mockup Frame */}
      {viewportMode === "mobile" && (
        <div className="w-[390px] max-w-[95vw] h-[min(820px,calc(100vh-100px))] my-auto rounded-[44px] border-[10px] border-zinc-800 bg-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col shrink-0 ring-1 ring-zinc-700/50">
          {/* Mobile Top Speaker / Dynamic Island */}
          <div className="h-8 bg-zinc-950 flex items-center justify-between px-6 shrink-0 select-none">
            <span className="text-[11px] font-bold text-zinc-300">9:41</span>
            <div className="h-3.5 w-20 bg-zinc-900 rounded-full border border-zinc-800" />
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Mobile Scrollable Viewport Content */}
          <div
            ref={mobileScrollRef}
            data-theme={state.theme}
            className="w-full flex-1 overflow-y-auto bg-canvas text-theme-primary transition-colors duration-300 relative flex flex-col select-text [scrollbar-width:thin] [scrollbar-color:rgba(161,161,170,0.5)_transparent]"
          >
            <ViewportProvider mode="mobile">
              <UniversalNavbar
                businessName={state.global.businessName}
                logoUrl={state.global.logoUrl}
                navLinks={state.global.navLinks}
                onNavigate={handleNavigate}
              />

              <main className="flex-1">
                {sortedSections.length === 0 ? (
                  <div className="py-20 text-center text-theme-muted px-4">
                    <p className="text-base font-semibold text-theme-primary">
                      No sections on this page.
                    </p>
                  </div>
                ) : (
                  sortedSections.map((section) => (
                    <UniversalSectionRenderer
                      key={section.id}
                      section={section}
                      isSelected={section.id === activeSectionId}
                      onSelect={onSelectSection}
                      isCanvasInteractive={isInteractive}
                      animationStyle={state.animationStyle || "slide-up"}
                    />
                  ))
                )}
              </main>

              <UniversalFooter
                businessName={state.global.businessName}
                logoUrl={state.global.logoUrl}
                navLinks={state.global.navLinks}
              />

              {/* Mobile Home Bar */}
              <div className="sticky bottom-1 left-0 right-0 flex justify-center py-1 pointer-events-none">
                <div className="h-1 w-28 bg-theme-primary/30 rounded-full" />
              </div>
            </ViewportProvider>
          </div>
        </div>
      )}

      {/* Tablet Device Mockup Frame */}
      {viewportMode === "tablet" && (
        <div className="w-[768px] max-w-[95vw] h-[min(880px,calc(100vh-100px))] my-auto rounded-[36px] border-[12px] border-zinc-800 bg-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col shrink-0 ring-1 ring-zinc-700/50">
          {/* Tablet Top Bezel */}
          <div className="h-6 bg-zinc-950 flex items-center justify-center shrink-0">
            <div className="h-2 w-2 rounded-full bg-zinc-800" />
          </div>

          {/* Tablet Scrollable Viewport Content */}
          <div
            ref={tabletScrollRef}
            data-theme={state.theme}
            className="w-full flex-1 overflow-y-auto bg-canvas text-theme-primary transition-colors duration-300 relative flex flex-col select-text [scrollbar-width:thin] [scrollbar-color:rgba(161,161,170,0.5)_transparent]"
          >
            <ViewportProvider mode="tablet">
              <UniversalNavbar
                businessName={state.global.businessName}
                logoUrl={state.global.logoUrl}
                navLinks={state.global.navLinks}
                onNavigate={handleNavigate}
              />

              <main className="flex-1">
                {sortedSections.length === 0 ? (
                  <div className="py-24 text-center text-theme-muted px-4">
                    <p className="text-lg font-semibold text-theme-primary">
                      No sections on this page.
                    </p>
                  </div>
                ) : (
                  sortedSections.map((section) => (
                    <UniversalSectionRenderer
                      key={section.id}
                      section={section}
                      isSelected={section.id === activeSectionId}
                      onSelect={onSelectSection}
                      isCanvasInteractive={isInteractive}
                      animationStyle={state.animationStyle || "slide-up"}
                    />
                  ))
                )}
              </main>

              <UniversalFooter
                businessName={state.global.businessName}
                logoUrl={state.global.logoUrl}
                navLinks={state.global.navLinks}
              />
            </ViewportProvider>
          </div>
        </div>
      )}

      {/* Desktop Mode (Full Screen Live Canvas) */}
      {viewportMode === "desktop" && (
        <div
          data-theme={state.theme}
          className="w-full min-h-full flex flex-col bg-canvas text-theme-primary transition-colors duration-300 relative shadow-2xl rounded-xl overflow-hidden border border-zinc-800/80"
        >
          <ViewportProvider mode="desktop">
            <UniversalNavbar
              businessName={state.global.businessName}
              logoUrl={state.global.logoUrl}
              navLinks={state.global.navLinks}
              onNavigate={handleNavigate}
            />

            <main className="flex-1">
              {sortedSections.length === 0 ? (
                <div className="py-24 text-center text-theme-muted">
                  <p className="text-lg font-semibold text-theme-primary">
                    No sections on this page yet.
                  </p>
                  <p className="text-sm mt-1">
                    Click &quot;Add Section&quot; in the left sidebar to add Hero, Services, Reviews, etc.
                  </p>
                </div>
              ) : (
                sortedSections.map((section) => (
                  <UniversalSectionRenderer
                    key={section.id}
                    section={section}
                    isSelected={section.id === activeSectionId}
                    onSelect={onSelectSection}
                    isCanvasInteractive={isInteractive}
                    animationStyle={state.animationStyle || "slide-up"}
                  />
                ))
              )}
            </main>

            <UniversalFooter
              businessName={state.global.businessName}
              logoUrl={state.global.logoUrl}
              navLinks={state.global.navLinks}
            />
          </ViewportProvider>
        </div>
      )}
    </div>
  );
};
