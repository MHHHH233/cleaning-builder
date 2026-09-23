import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    const { fieldType = "headline", prompt = "", vibe = "luxury", businessName = "PureSpark" } = body;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    // If OpenRouter key is provided in .env.local, call OpenRouter Free Models
    if (openrouterKey) {
      try {
        const systemPrompt = `You are an expert conversion copywriter for modern cleaning business websites.
Return a concise, high-converting copy string for the field "${fieldType}".
Rules:
- Output ONLY the finished text.
- Do NOT include quotation marks, intro pleasantries, or explanations.
- Tailor to the user's specific request.`;

        const userPrompt = `Business: ${businessName}
Target Field: ${fieldType}
Desired Style: ${vibe}
User Description: ${prompt || "High-end cleaning service"}`;

        const modelName = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";

        const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
            "HTTP-Referer": "https://cleaning-builder.local",
            "X-Title": "Cleaning Business Launch Kit",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 250,
          }),
        });

        if (openRouterRes.ok) {
          const json = await openRouterRes.json();
          let generated = json.choices?.[0]?.message?.content?.trim();
          if (generated) {
            // Strip markdown bold asterisks or enclosing quotes
            generated = generated
              .replace(/^\*\*|\*\*$/g, "")
              .replace(/^["']|["']$/g, "")
              .trim();

            return NextResponse.json({
              success: true,
              text: generated,
              provider: "openrouter",
              model: modelName,
            });
          }
        }
      } catch (err) {
        console.warn("OpenRouter call failed, falling back to smart generator:", err);
      }
    }

    // Fallback: Smart Built-in Contextual Generator
    const pLower = prompt.toLowerCase();
    let generated = "Hospital-Grade Clean. Effortless Luxury.";

    if (fieldType === "headline" || fieldType === "title") {
      if (pLower.includes("eco") || pLower.includes("green") || vibe === "eco") {
        generated = "100% Plant-Derived Clean. Zero Toxic Residue.";
      } else if (pLower.includes("commercial") || pLower.includes("office") || vibe === "commercial") {
        generated = "Commanding Hygiene for High-Performance Workplaces.";
      } else if (pLower.includes("airbnb") || pLower.includes("rental") || vibe === "speed") {
        generated = "5-Star Turnover Cleaning for Superhosts & Luxury Rentals.";
      } else if (pLower.includes("move") || vibe === "deep") {
        generated = "The Deepest Clean Your Property Has Ever Seen.";
      } else {
        generated = "Hospital-Grade Clean. Effortless Everyday Luxury.";
      }
    } else if (fieldType === "subheadline" || fieldType === "subtitle" || fieldType === "description") {
      if (pLower.includes("eco") || vibe === "eco") {
        generated = "We transform your space using 100% botanical disinfectants, HEPA filtration vacuums, and color-coded microfibers—backed by our unconditional 24-hour re-clean guarantee.";
      } else if (pLower.includes("commercial") || vibe === "commercial") {
        generated = "We protect your staff and impress your clients with EPA-certified commercial sanitization, tailored after-hours schedules, and dedicated account supervisors.";
      } else {
        generated = "Enjoy transparent flat-rate pricing, flexible online scheduling, and vetted professionals who treat your home with surgical precision and utmost care.";
      }
    } else if (fieldType === "badge") {
      generated = "✨ #1 Rated Independent Cleaners • 500+ 5-Star Reviews";
    } else if (fieldType === "primaryCtaText" || fieldType === "cta") {
      generated = "Get Instant 60s Quote";
    }

    return NextResponse.json({
      success: true,
      text: generated,
      provider: "builtin",
    });
  } catch (error: any) {
    console.error("ai-generate fallback recovery:", error);
    return NextResponse.json({
      success: true,
      text: "Hospital-Grade Clean. Effortless Everyday Luxury.",
      provider: "builtin_recovery",
    });
  }
}
