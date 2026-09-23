import React from "react";
import { Section } from "@/types/builder";
import { UniversalHero } from "./UniversalHero";
import { UniversalServices } from "./UniversalServices";
import { UniversalAbout } from "./UniversalAbout";
import { UniversalReviews } from "./UniversalReviews";
import { UniversalFAQ } from "./UniversalFAQ";
import { UniversalContact } from "./UniversalContact";

interface UniversalSectionRendererProps {
  section: Section;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isCanvasInteractive?: boolean;
  animationStyle?: string;
}

export const UniversalSectionRenderer: React.FC<UniversalSectionRendererProps> = ({
  section,
  isSelected = false,
  onSelect,
  isCanvasInteractive = true,
  animationStyle = "slide-up",
}) => {
  if (section.isHidden) {
    return null;
  }

  const animClass =
    animationStyle === "fade"
      ? "anim-fade"
      : animationStyle === "scale"
      ? "anim-scale"
      : animationStyle === "spring"
      ? "anim-spring"
      : animationStyle === "subtle"
      ? "anim-subtle"
      : animationStyle === "none"
      ? "anim-none"
      : "anim-slide-up";

  const renderContent = () => {
    switch (section.type) {
      case "hero":
        return <UniversalHero data={section.data} />;
      case "services":
        return <UniversalServices data={section.data} />;
      case "about":
        return <UniversalAbout data={section.data} />;
      case "reviews":
        return <UniversalReviews data={section.data} />;
      case "faq":
        return <UniversalFAQ data={section.data} />;
      case "contact":
        return <UniversalContact data={section.data} />;
      default:
        return (
          <div className="p-8 text-center text-theme-muted border border-dashed border-theme my-4 rounded-theme">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => isCanvasInteractive && onSelect && onSelect(section.id)}
      className={`relative transition-all duration-150 ${animClass} ${
        isCanvasInteractive ? "cursor-pointer group hover:ring-2 hover:ring-theme-primary/30" : ""
      } ${isSelected ? "ring-2 ring-theme-primary ring-offset-2 ring-offset-black" : ""}`}
    >
      {/* Editor visual hint on hover */}
      {isCanvasInteractive && (
        <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-theme bg-theme-brand text-theme-brand-fg shadow-theme">
            {section.type} • Click to Edit
          </span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};
