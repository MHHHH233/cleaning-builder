"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  X,
  Settings2,
  Key,
  RefreshCw,
  Send,
  Zap,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  generateAISuggestions,
  getStoredAISettings,
  saveStoredAISettings,
  AISettings,
  SuggestionOption,
} from "@/lib/ai-engine";

interface AICopyStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string; // e.g. "headline"
  fieldLabel: string; // e.g. "Main Headline"
  currentValue: string;
  businessName: string;
  onApply: (selectedValue: string) => void;
}

export const AICopyStudioModal: React.FC<AICopyStudioModalProps> = ({
  isOpen,
  onClose,
  fieldName,
  fieldLabel,
  currentValue,
  businessName,
  onApply,
}) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [vibe, setVibe] = useState<"luxury" | "eco" | "commercial" | "deep" | "speed" | "friendly">("luxury");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Settings view toggle
  const [showSettings, setShowSettings] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: "builtin",
    apiKey: "",
    model: "builtin",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredAISettings();
      setAiSettings(stored);
      fetchSuggestions(stored);
    }
  }, [isOpen, fieldName]);

  const fetchSuggestions = async (settingsToUse?: AISettings) => {
    setLoading(true);
    try {
      const results = await generateAISuggestions(
        {
          fieldType: fieldName,
          currentValue,
          userPrompt,
          vibe,
          businessName,
        },
        settingsToUse || aiSettings
      );
      setSuggestions(results);
      if (results.length > 0) {
        setSelectedId(results[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAISettings(aiSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setShowSettings(false);
    fetchSuggestions(aiSettings);
  };

  if (!isOpen) return null;

  const currentOption = suggestions.find((s) => s.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col h-[85vh] w-full max-w-2xl rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-bold shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>✨ AI Copy Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-amber-400/20">
                  Target: {fieldLabel}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {aiSettings.provider === "builtin"
                  ? "⚡ Free Smart Engine Active (No API key needed)"
                  : `🔌 Connected to ${aiSettings.provider.toUpperCase()} (${aiSettings.model})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-md border text-xs font-medium transition-colors ${
                showSettings
                  ? "border-amber-400 bg-amber-400/10 text-amber-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
              title="Configure AI Providers / API Keys"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Optional AI Provider & API Key Settings Drawer */}
        {showSettings ? (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-zinc-900/90">
            <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                <Key className="h-4 w-4 text-amber-400" />
                <span>AI Generation Settings</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                By default, the builder uses our <strong>100% Free Built-in Cleaning AI Engine</strong> with zero setup required.
                If you have an OpenAI, Groq (free tier), or OpenRouter key and want live LLM generation, you can configure it below:
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    AI Engine Provider
                  </label>
                  <select
                    value={aiSettings.provider}
                    onChange={(e) =>
                      setAiSettings({
                        ...aiSettings,
                        provider: e.target.value as any,
                      })
                    }
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100"
                  >
                    <option value="builtin">⚡ Free Built-in Smart Engine (No API key needed)</option>
                    <option value="groq">Groq Cloud (Fast & Free Tier with Llama 3.3)</option>
                    <option value="openai">OpenAI (GPT-4o mini)</option>
                    <option value="openrouter">OpenRouter (Open Source Models)</option>
                  </select>
                </div>

                {aiSettings.provider !== "builtin" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        API Key ({aiSettings.provider.toUpperCase()})
                      </label>
                      <input
                        type="password"
                        placeholder={`Paste your ${aiSettings.provider} API key here (sk-...)`}
                        value={aiSettings.apiKey}
                        onChange={(e) =>
                          setAiSettings({
                            ...aiSettings,
                            apiKey: e.target.value,
                          })
                        }
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 font-mono"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        Saved locally in your browser only. Never transmitted to third parties.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Custom Model Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder={
                          aiSettings.provider === "groq"
                            ? "llama-3.3-70b-versatile"
                            : aiSettings.provider === "openai"
                            ? "gpt-4o-mini"
                            : "meta-llama/llama-3.1-8b-instruct:free"
                        }
                        value={aiSettings.model === "builtin" ? "" : aiSettings.model}
                        onChange={(e) =>
                          setAiSettings({
                            ...aiSettings,
                            model: e.target.value,
                          })
                        }
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Back to Studio
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-zinc-100 text-xs font-bold text-zinc-950 hover:bg-white"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Main Studio View */
          <div className="flex-1 flex flex-col p-5 overflow-hidden gap-4">
            {/* Custom Prompt & Vibe Controls */}
            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Tell the AI what to write (or leave blank for best practice):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Eco-friendly Airbnb cleaners in Austin, or Penthouse move-in specialists..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchSuggestions()}
                    className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => fetchSuggestions()}
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 hover:bg-amber-300 px-3 py-2 text-xs font-bold text-zinc-950 transition-all disabled:opacity-50 shrink-0"
                  >
                    {loading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    <span>{loading ? "Generating..." : "Generate"}</span>
                  </button>
                </div>
              </div>

              {/* Vibe Selection Pills */}
              <div>
                <span className="text-[11px] text-zinc-400 font-semibold block mb-1.5">
                  Tone & Vibe Preset:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "luxury", label: "✨ Luxury Estate" },
                    { id: "eco", label: "🌿 100% Eco Botanical" },
                    { id: "commercial", label: "🏢 Corporate / B2B" },
                    { id: "speed", label: "⚡ Same-Day & Airbnb" },
                    { id: "deep", label: "🛡️ 52-Point Deep Restoration" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVibe(v.id as any);
                        fetchSuggestions();
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                        vibe === v.id
                          ? "border-amber-400/80 bg-amber-400/15 text-amber-300 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions Results */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>Select from Generated Variations:</span>
                <span className="text-[11px] font-normal text-zinc-500">
                  {suggestions.length} options ready
                </span>
              </div>

              {suggestions.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedId(opt.id)}
                    className={`group p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-150 relative ${
                      isSelected
                        ? "border-amber-400/80 bg-amber-400/10 shadow-lg ring-1 ring-amber-400/40"
                        : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                        {opt.tag}
                      </span>
                      {opt.angle && (
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {opt.angle}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-medium text-zinc-100 leading-relaxed">
                      "{opt.text}"
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                      {isSelected ? (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-300">
                          Click to select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer with Apply Button */}
        {!showSettings && (
          <div className="flex items-center justify-between border-t border-zinc-800 p-4 bg-zinc-950">
            <div className="text-xs text-zinc-500">
              Selected copy will immediately replace <span className="text-zinc-300 font-semibold">{fieldLabel}</span>.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!currentOption}
                onClick={() => {
                  if (currentOption) {
                    onApply(currentOption.text);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 hover:bg-white px-4 py-2 text-xs font-bold text-zinc-950 transition-all disabled:opacity-50 shadow-md"
              >
                <Check className="h-4 w-4" />
                <span>Apply to Live Site</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
