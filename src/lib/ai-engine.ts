/**
 * Multi-Provider AI Engine for Cleaning Business Website Builder.
 * 
 * Supports 3 Layers:
 * 1. Server-side environment keys in .env.local (GROQ_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY)
 * 2. Client-side custom API keys entered in the AI Studio settings modal
 * 3. 100% Free Built-in Smart Suggestion Engine (Zero cost, Zero setup, open to all)
 */

export interface AISettings {
  provider: "builtin" | "openai" | "groq" | "openrouter";
  apiKey: string;
  model: string;
}

const AI_SETTINGS_STORAGE_KEY = "refero_builder_ai_settings";

export function getStoredAISettings(): AISettings {
  if (typeof window === "undefined") {
    return { provider: "builtin", apiKey: "", model: "builtin" };
  }
  try {
    const saved = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }
  return { provider: "builtin", apiKey: "", model: "builtin" };
}

export function saveStoredAISettings(settings: AISettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }
}

export interface SuggestionRequest {
  fieldType: string; // 'headline' | 'subheadline' | 'badge' | 'cta' | 'service' | 'review' | 'faq'
  currentValue?: string;
  userPrompt?: string; // e.g. "Focus on penthouse apartments in Miami"
  vibe?: "luxury" | "eco" | "commercial" | "deep" | "speed" | "friendly";
  businessName?: string;
}

export interface SuggestionOption {
  id: string;
  title?: string;
  text: string;
  secondaryText?: string;
  tag: string;
  angle: string;
}

/**
 * Generates 3-4 distinct creative options tailored to user prompt and vibe
 */
export async function generateAISuggestions(
  req: SuggestionRequest,
  settings?: AISettings
): Promise<SuggestionOption[]> {
  const currentSettings = settings || getStoredAISettings();

  // 1. Try server-side API endpoint first (checks .env.local for GROQ_API_KEY, OPENAI_API_KEY, etc.)
  try {
    const serverRes = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        return data.suggestions;
      }
    }
  } catch (e) {
    // server route failed or not accessible, continue to client fallback
  }

  // 2. If user entered a custom API key in the UI settings modal:
  if (currentSettings.provider !== "builtin" && currentSettings.apiKey.trim()) {
    try {
      return await callClientSideLLM(req, currentSettings);
    } catch (err) {
      console.warn("Client LLM call failed, falling back to built-in smart engine:", err);
    }
  }

  // 3. Fallback: Free high-quality contextual suggestion engine (open to all, 0 setup)
  return generateBuiltinSuggestions(req);
}

/**
 * Free built-in smart generative engine with zero external dependencies
 */
function generateBuiltinSuggestions(req: SuggestionRequest): SuggestionOption[] {
  const { fieldType, userPrompt = "", vibe = "luxury", businessName = "PureSpark" } = req;
  const promptLower = userPrompt.toLowerCase();

  const isEco = vibe === "eco" || promptLower.includes("eco") || promptLower.includes("green") || promptLower.includes("organic") || promptLower.includes("pet");
  const isCommercial = vibe === "commercial" || promptLower.includes("office") || promptLower.includes("commercial") || promptLower.includes("facility") || promptLower.includes("janitorial");
  const isAirbnb = promptLower.includes("airbnb") || promptLower.includes("rental") || promptLower.includes("turnover") || promptLower.includes("host");
  const isLuxury = vibe === "luxury" || promptLower.includes("luxury") || promptLower.includes("estate") || promptLower.includes("mansion") || promptLower.includes("penthouse");

  if (fieldType === "headline" || fieldType === "title") {
    if (isEco) {
      return [
        {
          id: "1",
          text: "100% Plant-Derived Clean. Zero Toxic Residue.",
          tag: "Eco Pure",
          angle: "Focuses on health, children & pet-safe botanical disinfection",
        },
        {
          id: "2",
          text: "Breathe Effortlessly in a Naturally Pristine Home.",
          tag: "Wellness Focus",
          angle: "Highlights allergen elimination and natural air purification",
        },
        {
          id: "3",
          text: "Organic Cleanliness. Uncompromising Standards.",
          tag: "Balanced Authority",
          angle: "Combines green certifications with clinical cleaning power",
        },
      ];
    }

    if (isCommercial) {
      return [
        {
          id: "1",
          text: "Commanding Hygiene for High-Performance Workplaces.",
          tag: "Corporate",
          angle: "Elevates office prestige, employee health, and client impressions",
        },
        {
          id: "2",
          text: "Medical-Grade Facility Sanitation. Guaranteed SLAs.",
          tag: "Compliance",
          angle: "Emphasizes automated audit logs and OSHA/CDC compliance",
        },
        {
          id: "3",
          text: "Seamless Nightly Janitorial & Daytime Porter Services.",
          tag: "Operations",
          angle: "Highlights after-hours silent dispatch and frictionless management",
        },
      ];
    }

    if (isAirbnb) {
      return [
        {
          id: "1",
          text: "5-Star Turnover Cleaning for Superhosts & Luxury Rentals.",
          tag: "Hospitality",
          angle: "Ensures flawless guest reviews, crisp linens, and damage checks",
        },
        {
          id: "2",
          text: "Same-Day Checkout to Check-in. Zero Booking Missed.",
          tag: "Speed & Turnaround",
          angle: "Guarantees rapid 3-hour turnaround with photo verification",
        },
        {
          id: "3",
          text: "Hotel-Standard Cleanliness Built for Vacation Rentals.",
          tag: "Guest Rating Focus",
          angle: "Boosts Airbnb search ranking with immaculate cleanliness scores",
        },
      ];
    }

    return [
      {
        id: "1",
        text: "Hospital-Grade Clean. Effortless Everyday Luxury.",
        tag: "High-End Modern",
        angle: "Pairs clinical precision with refined aesthetic serenity",
      },
      {
        id: "2",
        text: "Immaculate Perfection for Distinctive Residences.",
        tag: "White-Glove",
        angle: "Bespoke care for delicate materials, hardwood, and custom architecture",
      },
      {
        id: "3",
        text: "Step Into an Allergen-Free, Flawlessly Restored Sanctuary.",
        tag: "Wellness Sanctuary",
        angle: "Appeals to busy professionals seeking peace of mind and order",
      },
    ];
  }

  if (fieldType === "subheadline" || fieldType === "subtitle" || fieldType === "description") {
    if (isCommercial) {
      return [
        {
          id: "1",
          text: "We protect your staff and impress your clients with EPA-certified commercial sanitization, tailored after-hours schedules, and dedicated account supervisors.",
          tag: "Corporate SLA",
          angle: "Reliability, insurance, and professional protocol",
        },
        {
          id: "2",
          text: "From executive suites to technical cleanrooms, our bonded technicians ensure zero residue, HEPA-purified air, and transparent fixed contract pricing.",
          tag: "Comprehensive Care",
          angle: "Focus on certifications and fixed-rate transparency",
        },
        {
          id: "3",
          text: "Custom janitorial solutions built around your operational hours. Experience why leading tech hubs and professional firms rely on our team every night.",
          tag: "Trust & Scale",
          angle: "Social proof with tech hub references",
        },
      ];
    }

    return [
      {
        id: "1",
        text: "We transform your space using 100% botanical disinfectants, HEPA filtration vacuums, and color-coded microfibers—backed by our unconditional 24-hour re-clean guarantee.",
        tag: "52-Point Protocol",
        angle: "Explains technical equipment and guarantee",
      },
      {
        id: "2",
        text: "Enjoy transparent flat-rate pricing, flexible online scheduling, and vetted professionals who treat your home with surgical precision and utmost care.",
        tag: "Convenience & Trust",
        angle: "Frictionless booking with vetted cleaners",
      },
      {
        id: "3",
        text: "Experience the calming clarity of a meticulously sanitized living space. Every counter disinfected, every floor hand-buffed, every detail perfected.",
        tag: "Sensory & Emotional",
        angle: "Focuses on the serene feeling of coming home to a clean house",
      },
    ];
  }

  if (fieldType === "badge") {
    return [
      {
        id: "1",
        text: "✨ #1 Rated Independent Cleaners • 500+ 5-Star Reviews",
        tag: "Social Proof",
        angle: "Maximizes trust with review metrics",
      },
      {
        id: "2",
        text: "🛡️ Fully Insured, Bonded & Background-Verified Staff",
        tag: "Safety & Security",
        angle: "Alleviates trust concerns regarding access to home",
      },
      {
        id: "3",
        text: "🌿 Certified 100% Non-Toxic & EPA Green Seal Approved",
        tag: "Health & Eco",
        angle: "Appeals to pet owners and parents",
      },
      {
        id: "4",
        text: "⚡ Same-Day Priority Dispatch • 60-Second Instant Booking",
        tag: "Urgency & Speed",
        angle: "Encourages immediate conversions",
      },
    ];
  }

  if (fieldType === "primaryCtaText" || fieldType === "cta") {
    return [
      {
        id: "1",
        text: "Get Instant 60s Quote",
        tag: "Speed",
        angle: "Low commitment, immediate price discovery",
      },
      {
        id: "2",
        text: "Book Spotless Clean — Save 15%",
        tag: "Discount Incentive",
        angle: "Promotional hook for first-time bookers",
      },
      {
        id: "3",
        text: "Schedule Free Walkthrough",
        tag: "Consultative",
        angle: "Ideal for large estates and commercial offices",
      },
    ];
  }

  return [
    {
      id: "1",
      text: userPrompt ? `Custom: ${userPrompt} with pristine cleaning standards.` : "Hospital-grade cleaning standards tailored to your space.",
      tag: "Tailored",
      angle: "Matched to your input",
    },
  ];
}

/**
 * Optional Client-Side Live LLM Call (OpenAI, Groq, OpenRouter)
 */
async function callClientSideLLM(
  req: SuggestionRequest,
  settings: AISettings
): Promise<SuggestionOption[]> {
  let endpoint = "https://api.openai.com/v1/chat/completions";
  let model = settings.model || "gpt-4o-mini";

  if (settings.provider === "groq") {
    endpoint = "https://api.groq.com/openai/v1/chat/completions";
    model = settings.model || "llama-3.3-70b-versatile";
  } else if (settings.provider === "openrouter") {
    endpoint = "https://openrouter.ai/api/v1/chat/completions";
    model = settings.model || "meta-llama/llama-3.1-8b-instruct:free";
  }

  const systemPrompt = `You are a world-class conversion copywriter specializing in luxury and commercial cleaning business websites.
Return a valid JSON array of 3 distinct high-converting options for the field "${req.fieldType}".
Format:
[
  { "id": "1", "text": "...", "tag": "Punchy", "angle": "..." },
  { "id": "2", "text": "...", "tag": "Authoritative", "angle": "..." },
  { "id": "3", "text": "...", "tag": "Emotional", "angle": "..." }
]
Output ONLY raw valid JSON.`;

  const userContent = `Business Name: ${req.businessName || "PureSpark"}
Target Field: ${req.fieldType}
Current Value: ${req.currentValue || "none"}
Desired Vibe: ${req.vibe || "luxury"}
User Prompt / Instructions: ${req.userPrompt || "Generate compelling, modern copy"}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    throw new Error(`API returned HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content || json.choices?.[0]?.message?.reasoning || "";
  
  // Try direct parse after stripping markdown fences
  try {
    const cleanJson = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    if (cleanJson) {
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Try extracting array via regex
  const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
  }

  throw new Error("Invalid format received from LLM");
}
