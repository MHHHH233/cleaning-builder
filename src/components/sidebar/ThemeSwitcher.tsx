import React from "react";
import { REFERO_THEMES, ThemeDefinition } from "@/types/builder";
import { Check, Sparkles } from "lucide-react";

interface ThemeSwitcherProps {
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
  onToast?: (message: string) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  activeTheme,
  onSelectTheme,
  onToast,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Design Themes (7 Styles)
        </label>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-amber-400/20">
          Instant Toggle
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {REFERO_THEMES.map((t: ThemeDefinition) => {
          const isSelected = activeTheme === t.id;

          return (
            <div
              key={t.id}
              onClick={() => {
                onSelectTheme(t.id);
                if (onToast) onToast(`🎨 Applied ${t.name} style`);
              }}
              className={`group relative rounded-xl border text-left cursor-pointer transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-amber-400/80 bg-zinc-900 shadow-lg ring-1 ring-amber-400/50"
                  : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  {/* Visual Color Swatch Preview */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-sm relative overflow-hidden"
                    style={{
                      backgroundColor: t.bgMain,
                      borderColor: t.borderColor,
                    }}
                  >
                    {/* Card mini square */}
                    <div
                      className="h-4 w-4 rounded-sm border"
                      style={{
                        backgroundColor: t.bgCard,
                        borderColor: t.borderColor,
                      }}
                    />
                    {/* Brand dot */}
                    <div
                      className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full ring-1 ring-black/40 shadow-sm"
                      style={{ backgroundColor: t.brandPrimary }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-100">
                        {t.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                        {t.mode === "dark" ? "Dark" : "Light"}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">
                      {t.tagline}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5">
                  {isSelected ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-zinc-950 shadow-md">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 font-medium pr-1">
                      Apply
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
