import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fieldType, userPrompt, vibe, businessName } = body;

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    let apiKey = groqKey || openaiKey || openrouterKey;
    let endpoint = "https://api.groq.com/openai/v1/chat/completions";
    let model = "llama-3.3-70b-versatile";

    if (openaiKey && !groqKey) {
      endpoint = "https://api.openai.com/v1/chat/completions";
      model = "gpt-4o-mini";
      apiKey = openaiKey;
    } else if (openrouterKey && !groqKey && !openaiKey) {
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
      apiKey = openrouterKey;
    }

    // If a server-side API key exists in .env.local, call the LLM
    if (apiKey) {
      const systemPrompt = `You are an elite conversion copywriter for modern cleaning business websites.
Return a valid JSON array of 3 distinct high-converting options for the field "${fieldType}".
Format:
[
  { "id": "1", "text": "...", "tag": "Punchy", "angle": "..." },
  { "id": "2", "text": "...", "tag": "Authoritative", "angle": "..." },
  { "id": "3", "text": "...", "tag": "Emotional", "angle": "..." }
]
Output ONLY raw valid JSON.`;

      const userContent = `Business Name: ${businessName || "PureSpark"}
Target Field: ${fieldType}
Desired Vibe: ${vibe || "luxury"}
User Instructions / Niche: ${userPrompt || "High conversion cleaning copy"}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const raw = json.choices?.[0]?.message?.content || "";
        const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({ success: true, suggestions: parsed, source: "env_llm" });
      }
    }

    // Otherwise report that no server key was set, client will use free smart engine
    return NextResponse.json({
      success: false,
      message: "No server LLM key set in .env.local; client engine will handle generation.",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
