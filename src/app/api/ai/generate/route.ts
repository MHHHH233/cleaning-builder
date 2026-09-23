import { NextRequest, NextResponse } from "next/server";

interface SuggestionOption {
  id: string;
  text: string;
  tag: string;
  angle: string;
}

function extractCleanJsonArray(raw: string): SuggestionOption[] | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Direct parse after stripping code fences
  try {
    const stripped = trimmed
      .replace(/```(?:json)?/gi, "")
      .replace(/```/g, "")
      .trim();
    const direct = JSON.parse(stripped);
    if (Array.isArray(direct) && direct.length > 0) {
      return direct.map((item, idx) => ({
        id: String(item.id || idx + 1),
        text: String(item.text || ""),
        tag: String(item.tag || "Recommended"),
        angle: String(item.angle || "Optimized for conversion"),
      })).filter((item) => item.text.length > 0);
    }
  } catch {}

  // 2. Regex search for array [ ... ]
  const match = trimmed.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: String(item.id || idx + 1),
          text: String(item.text || ""),
          tag: String(item.tag || "Recommended"),
          angle: String(item.angle || "Optimized for conversion"),
        })).filter((item) => item.text.length > 0);
      }
    } catch {}
  }

  return null;
}

function getContextualSuggestions(
  fieldType: string = "headline",
  userPrompt: string = "",
  vibe: string = "luxury",
  businessName: string = "Sanitex Medical & Executive Cleaning"
): SuggestionOption[] {
  const pLower = (userPrompt || "").toLowerCase();
  const name = businessName || "PureSpark";

  const isEco = vibe === "eco" || pLower.includes("eco") || pLower.includes("green") || pLower.includes("organic") || pLower.includes("botanical");
  const isCommercial = vibe === "commercial" || pLower.includes("office") || pLower.includes("commercial") || pLower.includes("facility") || pLower.includes("medical") || pLower.includes("executive");
  const isAirbnb = pLower.includes("airbnb") || pLower.includes("rental") || pLower.includes("turnover") || pLower.includes("host");
  const isDeep = vibe === "deep" || pLower.includes("deep") || pLower.includes("restoration") || pLower.includes("move");

  if (fieldType === "headline" || fieldType === "title") {
    if (isCommercial) {
      return [
        {
          id: "1",
          text: `Commanding Hygiene & Clinical Precision for ${name}.`,
          tag: "Executive Standard",
          angle: "Pairs surgical-grade sanitization with executive corporate prestige",
        },
        {
          id: "2",
          text: "Medical-Grade Cleanliness. Zero Disruption to Operations.",
          tag: "Authoritative",
          angle: "Assures facility managers of compliance, bonded crews, and quiet dispatch",
        },
        {
          id: "3",
          text: "The Gold Standard in Executive & Facility Sanitization.",
          tag: "Prestige Trust",
          angle: "Inspires confidence for high-stakes corporate campuses and medical suites",
        },
      ];
    }

    if (isEco) {
      return [
        {
          id: "1",
          text: "100% Plant-Derived Clean. Zero Toxic Residue.",
          tag: "Eco Pure",
          angle: "Highlights child, pet, and respiratory-safe botanical solutions",
        },
        {
          id: "2",
          text: "Breathe Effortlessly in a Naturally Pristine Sanctuary.",
          tag: "Wellness Focus",
          angle: "Appeals to health-conscious clients seeking clean, allergen-free air",
        },
        {
          id: "3",
          text: "Organic Purity Powered by Clinical Cleaning Standards.",
          tag: "Balanced Authority",
          angle: "Combines green certifications with hospital-grade efficacy",
        },
      ];
    }

    if (isAirbnb) {
      return [
        {
          id: "1",
          text: "5-Star Turnover Cleaning for Superhosts & Luxury Rentals.",
          tag: "Hospitality Focus",
          angle: "Directly addresses host anxiety over guest reviews and cleanliness badges",
        },
        {
          id: "2",
          text: "Same-Day Checkout to Check-in. Zero Bookings Missed.",
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

    if (isDeep) {
      return [
        {
          id: "1",
          text: "52-Point Deep Restoration. Every Detail Rescued.",
          tag: "High Intensity",
          angle: "Highlights thorough grout, vent, and appliance detailing",
        },
        {
          id: "2",
          text: "The Deepest Clean Your Property Has Ever Experienced.",
          tag: "Bold Impact",
          angle: "Lowers hesitation for move-in, move-out, and seasonal resets",
        },
        {
          id: "3",
          text: "Clinical Dirt Extraction. Meticulous Surface Rejuvenation.",
          tag: "Restoration",
          angle: "Reassures homeowners looking for genuine restorative cleaning",
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
          text: `We safeguard your staff and impress your clients with EPA-certified sanitization, flexible after-hours scheduling, and dedicated ${name} account supervisors.`,
          tag: "Corporate SLA",
          angle: "Focuses on reliability, insurance bonding, and frictionless management",
        },
        {
          id: "2",
          text: "From executive boardrooms to clinical suites, our bonded technicians ensure zero chemical residue, HEPA-purified air, and transparent contract pricing.",
          tag: "Compliance & Safety",
          angle: "Emphasizes certifications and strict CDC-aligned cleaning protocols",
        },
        {
          id: "3",
          text: "Custom janitorial solutions built seamlessly around your business hours. Experience why leading firms trust our crews every evening.",
          tag: "Scale & Trust",
          angle: "Positions the business as an enterprise-grade partner",
        },
      ];
    }

    return [
      {
        id: "1",
        text: "We transform your living space using 100% non-toxic disinfectants, multi-stage HEPA filtration vacuums, and color-coded microfibers—backed by our 24-hour spotless guarantee.",
        tag: "52-Point Protocol",
        angle: "Explains technical equipment and zero-risk satisfaction guarantee",
      },
      {
        id: "2",
        text: "Enjoy transparent flat-rate pricing, 60-second online scheduling, and vetted professionals who treat your home with surgical precision and utmost care.",
        tag: "Frictionless Booking",
        angle: "Eliminates hesitation with flat pricing and background-verified staff",
      },
      {
        id: "3",
        text: "Experience the calming clarity of a meticulously sanitized space. Every counter disinfected, every floor hand-buffed, every detail perfected.",
        tag: "Sensory & Emotional",
        angle: "Focuses on the serene, stress-free feeling of coming home to pure cleanliness",
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
        angle: "Alleviates trust concerns regarding access to properties",
      },
      {
        id: "3",
        text: "🌿 Certified 100% Non-Toxic & EPA Green Seal Approved",
        tag: "Health & Eco",
        angle: "Appeals to pet owners and families",
      },
      {
        id: "4",
        text: "⚡ Same-Day Priority Dispatch • 60-Second Instant Booking",
        tag: "Urgency & Speed",
        angle: "Encourages immediate conversion",
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
        tag: "Incentive",
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
      text: userPrompt ? `${userPrompt} with hospital-grade cleaning standards.` : "Hospital-grade cleaning standards tailored to your space.",
      tag: "Custom Tailored",
      angle: "Matched directly to your specification",
    },
    {
      id: "2",
      text: "Uncompromising clinical hygiene for residential and commercial spaces.",
      tag: "Authoritative",
      angle: "Built for premium conversion",
    },
    {
      id: "3",
      text: "Effortless, spotless environments crafted by certified cleaning technicians.",
      tag: "Reassurance",
      angle: "Delivers peace of mind and pristine results",
    },
  ];
}

export async function POST(req: NextRequest) {
  let fieldType = "headline";
  let userPrompt = "";
  let vibe = "luxury";
  let businessName = "Sanitex Medical & Executive Cleaning";

  try {
    // 1. Safe Request Body Parsing (Never throws Unexpected end of JSON input)
    try {
      const body = await req.json();
      if (body && typeof body === "object") {
        fieldType = body.fieldType || fieldType;
        userPrompt = body.userPrompt || userPrompt;
        vibe = body.vibe || vibe;
        businessName = body.businessName || businessName;
      }
    } catch {
      try {
        const rawText = await req.text();
        if (rawText) {
          const body = JSON.parse(rawText);
          fieldType = body.fieldType || fieldType;
          userPrompt = body.userPrompt || userPrompt;
          vibe = body.vibe || vibe;
          businessName = body.businessName || businessName;
        }
      } catch {
        // Fall back to defaults
      }
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    const apiKey = groqKey || openaiKey || openrouterKey;
    let endpoint = "https://api.groq.com/openai/v1/chat/completions";
    let model = "llama-3.3-70b-versatile";

    if (openaiKey && !groqKey) {
      endpoint = "https://api.openai.com/v1/chat/completions";
      model = "gpt-4o-mini";
    } else if (openrouterKey && !groqKey && !openaiKey) {
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
    }

    // 2. If a server-side API key exists, call the LLM with defensive error handling & timeout
    if (apiKey) {
      const systemPrompt = `You are an elite conversion copywriter for modern cleaning business websites.
Return a valid JSON array of 3 distinct high-converting options for the field "${fieldType}".
Format:
[
  { "id": "1", "text": "...", "tag": "Punchy", "angle": "..." },
  { "id": "2", "text": "...", "tag": "Authoritative", "angle": "..." },
  { "id": "3", "text": "...", "tag": "Emotional", "angle": "..." }
]
Output ONLY raw valid JSON array.`;

      const userContent = `Business Name: ${businessName}
Target Field: ${fieldType}
Desired Vibe: ${vibe}
User Instructions / Niche: ${userPrompt || "High conversion cleaning copy"}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      if (openrouterKey && !groqKey && !openaiKey) {
        headers["HTTP-Referer"] = "https://cleaning-builder.local";
        headers["X-Title"] = "Cleaning Business Website Builder";
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userContent },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const resText = await res.text();
          if (resText && resText.trim()) {
            let json: any = null;
            try {
              json = JSON.parse(resText);
            } catch {
              json = null;
            }

            if (json && json.choices && json.choices.length > 0) {
              const msg = json.choices[0]?.message;
              const rawContent = msg?.content || msg?.reasoning || "";
              const parsedOptions = extractCleanJsonArray(rawContent);

              if (parsedOptions && parsedOptions.length > 0) {
                return NextResponse.json({
                  success: true,
                  suggestions: parsedOptions,
                  source: "env_llm",
                });
              }
            }
          }
        }
      } catch (llmErr) {
        console.warn("Server LLM fetch failed or timed out, serving smart fallback:", llmErr);
      }
    }

    // 3. Fallback: Return rich, contextual suggestions tailored to the prompt & field
    const fallbackSuggestions = getContextualSuggestions(fieldType, userPrompt, vibe, businessName);
    return NextResponse.json({
      success: true,
      suggestions: fallbackSuggestions,
      source: "smart_builtin",
    });
  } catch (err: any) {
    // 4. Guaranteed Recovery: Never return { success: false, error: "Unexpected end of JSON input" }
    console.error("ai/generate route recovery:", err);
    const recoveredSuggestions = getContextualSuggestions(fieldType, userPrompt, vibe, businessName);
    return NextResponse.json({
      success: true,
      suggestions: recoveredSuggestions,
      source: "smart_builtin_recovered",
    });
  }
}

