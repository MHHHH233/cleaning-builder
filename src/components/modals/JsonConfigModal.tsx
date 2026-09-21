"use client";

import React, { useState, useEffect } from "react";
import { BuilderState } from "@/types/builder";
import {
  Copy,
  Check,
  Download,
  Upload,
  X,
  Code,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  Search,
  FileJson,
  Layers,
  BookOpen,
} from "lucide-react";
import { saveAs } from "file-saver";

interface JsonConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: BuilderState;
  onImportState: (newState: BuilderState) => void;
  onToast?: (message: string) => void;
}

export const JsonConfigModal: React.FC<JsonConfigModalProps> = ({
  isOpen,
  onClose,
  state,
  onImportState,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [validationInfo, setValidationInfo] = useState<{
    valid: boolean;
    pagesCount: number;
    sectionsCount: number;
    theme: string;
    sizeKb: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "summary">("editor");

  // Sync state into JSON text when opened
  useEffect(() => {
    if (isOpen) {
      const initialText = JSON.stringify(state, null, 2);
      setJsonText(initialText);
      validateJson(initialText);
    }
  }, [isOpen, state]);

  const validateJson = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed.theme || !parsed.pages || !parsed.global) {
        setImportError("Schema missing required fields: 'theme', 'global', or 'pages'.");
        setValidationInfo(null);
        return false;
      }
      const totalSections = parsed.pages.reduce(
        (acc: number, p: any) => acc + (p.sections?.length || 0),
        0
      );
      setImportError(null);
      setValidationInfo({
        valid: true,
        pagesCount: parsed.pages.length,
        sectionsCount: totalSections,
        theme: parsed.theme,
        sizeKb: (new Blob([text]).size / 1024).toFixed(1),
      });
      return true;
    } catch (err: any) {
      setImportError(err.message || "Invalid JSON syntax");
      setValidationInfo(null);
      return false;
    }
  };

  const handleTextChange = (text: string) => {
    setJsonText(text);
    validateJson(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    if (onToast) onToast("📋 site-config.json copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
    saveAs(blob, "site-config.json");
    if (onToast) onToast("💾 site-config.json downloaded");
  };

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const pretty = JSON.stringify(parsed, null, 2);
      setJsonText(pretty);
      validateJson(pretty);
      if (onToast) onToast("✨ JSON formatted");
    } catch (e) {
      // ignore
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      validateJson(minified);
      if (onToast) onToast("⚡ JSON minified");
    } catch (e) {
      // ignore
    }
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.theme || !parsed.pages || !parsed.global) {
        throw new Error("Invalid schema. Must contain theme, global, and pages.");
      }
      onImportState(parsed);
      if (onToast) onToast("🚀 Applied JSON schema to live canvas!");
      setImportError(null);
      onClose();
    } catch (err: any) {
      setImportError(err.message || "Failed to parse JSON");
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          setJsonText(content);
          validateJson(content);
          const parsed = JSON.parse(content);
          onImportState(parsed);
          if (onToast) onToast(`📂 Imported ${file.name} successfully`);
          setImportError(null);
          onClose();
        } catch (err: any) {
          setImportError("Invalid JSON file uploaded.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Preset Template loader
  const handleLoadPreset = (presetName: "eco" | "commercial" | "luxury") => {
    try {
      const parsed: BuilderState = JSON.parse(jsonText);
      if (presetName === "eco") {
        parsed.theme = "emerald-clean";
        parsed.global.businessName = "Verdant Pure Botanical Cleaners";
        parsed.pages[0].sections[0].data.headline = "100% Certified Plant-Based & Pet-Safe Cleaning";
        parsed.pages[0].sections[0].data.badge = "🌿 Certified Organic Non-Toxic Sanitization";
      } else if (presetName === "commercial") {
        parsed.theme = "dovetail";
        parsed.global.businessName = "Vanguard Commercial Janitorial";
        parsed.pages[0].sections[0].data.headline = "Enterprise Facility Care & Nightly Sanitization";
        parsed.pages[0].sections[0].data.badge = "🏢 Commercial Grade B2B Contracts";
      } else if (presetName === "luxury") {
        parsed.theme = "dimension";
        parsed.global.businessName = "LuxeAura Architectural Detailing";
        parsed.pages[0].sections[0].data.headline = "White-Glove Detailing for Distinctive Residences";
        parsed.pages[0].sections[0].data.badge = "✨ Bespoke Architectural Home Stewards";
      }
      const updated = JSON.stringify(parsed, null, 2);
      setJsonText(updated);
      validateJson(updated);
      if (onToast) onToast(`Loaded ${presetName.toUpperCase()} cleaning template`);
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen) return null;

  const lineCount = jsonText.split("\n").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="flex flex-col h-[90vh] w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-amber-400 font-mono shadow-sm">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  site-config.json
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Schema v1.0
                </span>
                {validationInfo?.valid ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid Schema ({validationInfo.sizeKb} KB)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                    <AlertCircle className="h-3 w-3" />
                    Syntax Error
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Single source of truth for all pages, sections, theme tokens, and business configuration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === "editor"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Code Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === "summary"
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Structure Tree
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 px-6 py-2.5 bg-zinc-900/50 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Quick Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadPreset("eco")}
              className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[11px] text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
            >
              🌿 Eco-Clean
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("commercial")}
              className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[11px] text-zinc-300 hover:border-blue-500/50 hover:text-blue-300 transition-colors"
            >
              🏢 Commercial
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("luxury")}
              className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[11px] text-zinc-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors"
            >
              ✨ Luxury Estate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrettify}
              className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
              title="Prettify JSON with 2-space indentation"
            >
              Format
            </button>
            <button
              type="button"
              onClick={handleMinify}
              className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
              title="Minify JSON for distribution"
            >
              Minify
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 bg-zinc-950">
          {importError && (
            <div className="mb-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{importError}</span>
              </div>
              <button
                type="button"
                onClick={() => setImportError(null)}
                className="text-rose-400 hover:text-rose-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === "editor" ? (
            <div className="flex-1 flex rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-inner font-mono text-xs">
              {/* Line Numbers Gutter */}
              <div className="hidden sm:block w-12 py-3 bg-zinc-950/80 border-r border-zinc-900 text-right pr-3 select-none text-zinc-600 font-mono text-[11px]">
                {[...Array(Math.min(lineCount, 300))].map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Textarea Code View */}
              <textarea
                value={jsonText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="flex-1 w-full bg-transparent p-3 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto"
                spellCheck={false}
              />
            </div>
          ) : (
            /* Structure Summary Tab */
            <div className="flex-1 overflow-y-auto space-y-4 p-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-xs text-zinc-400 font-medium">Active Theme Token</div>
                  <div className="text-xl font-black text-amber-400 mt-1 capitalize">
                    {validationInfo?.theme || "linear"}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    CSS Variables bound to [data-theme]
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-xs text-zinc-400 font-medium">Pages Configured</div>
                  <div className="text-xl font-black text-zinc-100 mt-1">
                    {validationInfo?.pagesCount || 1} Pages
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Multi-page navigation schema
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-xs text-zinc-400 font-medium">Universal Sections</div>
                  <div className="text-xl font-black text-zinc-100 mt-1">
                    {validationInfo?.sectionsCount || 0} Sections
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Hero, Services, Reviews, FAQ, Contact
                  </div>
                </div>
              </div>

              {/* Pages breakdown */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-zinc-400" />
                  <span>Configured Pages & Sections Layout</span>
                </div>

                {state.pages.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-zinc-200">
                        {p.title} <span className="font-mono text-zinc-500">({p.slug})</span>
                      </div>
                      <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                        {p.sections.length} sections
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.sections.map((s, sIdx) => (
                        <span
                          key={s.id || sIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                        >
                          {s.type} {s.isHidden && "• (hidden)"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-6 py-4 bg-zinc-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors shadow-sm"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download .json</span>
            </button>

            <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import .json</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileImport}
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!validationInfo?.valid}
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-white transition-all shadow-md disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>Apply Changes to Live Site</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
