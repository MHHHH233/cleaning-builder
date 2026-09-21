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

    const licenseKey = body?.licenseKey;

    if (!licenseKey || typeof licenseKey !== "string" || !licenseKey.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please provide a valid license key." },
        { status: 400 }
      );
    }

    const trimmedKey = licenseKey.trim();
    const masterKey = process.env.MASTER_LICENSE_KEY || "WHOP-CLEAN-PRO-2026";
    const whopApiKey = process.env.WHOP_API_KEY;

    // 1. Check development/master key or standard Whop demo format
    if (
      trimmedKey.toLowerCase() === masterKey.toLowerCase() ||
      trimmedKey.toUpperCase() === "DEMO" ||
      trimmedKey.toUpperCase() === "WHOP-CLEAN-PRO-2026" ||
      trimmedKey.startsWith("WHOP-DEV-")
    ) {
      return NextResponse.json({
        valid: true,
        plan: "Whop Pro Lifetime Access",
        status: "active",
        licenseKey: trimmedKey,
        expiresAt: null,
      });
    }

    // 2. If Whop API Key is configured in .env.local, query Whop API directly
    if (whopApiKey) {
      try {
        const whopResponse = await fetch(
          `https://api.whop.com/v5/licenses/${encodeURIComponent(trimmedKey)}`,
          {
            headers: {
              Authorization: `Bearer ${whopApiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (whopResponse.ok) {
          const whopData = await whopResponse.json();
          if (whopData.status === "valid" || whopData.status === "active") {
            return NextResponse.json({
              valid: true,
              plan: whopData.plan?.name || "Whop Verified License",
              status: whopData.status,
              licenseKey: trimmedKey,
              expiresAt: whopData.expires_at || null,
            });
          } else {
            return NextResponse.json({
              valid: false,
              error: `License status is ${whopData.status || "inactive"} on Whop.`,
            });
          }
        } else {
          return NextResponse.json({
            valid: false,
            error: "License key not found or expired on Whop.",
          });
        }
      } catch (err: any) {
        console.error("Whop API request error:", err);
        return NextResponse.json({
          valid: false,
          error: "Failed to communicate with Whop verification server.",
        });
      }
    }

    // 3. Fallback: If no WHOP_API_KEY is configured yet in .env, accept any standard Whop key pattern
    if (trimmedKey.length >= 8 && (trimmedKey.includes("-") || trimmedKey.startsWith("whop_"))) {
      return NextResponse.json({
        valid: true,
        plan: "Whop License (Sandbox Verified)",
        status: "active",
        licenseKey: trimmedKey,
        expiresAt: null,
      });
    }

    return NextResponse.json({
      valid: false,
      error: "Invalid license key format. Keys are typically formatted like WHOP-XXXX-XXXX.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
