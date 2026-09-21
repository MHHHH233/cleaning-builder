import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client if credentials are configured
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// In-memory fallback for local dev sandbox when Upstash is not yet connected
const inMemoryRedeemedKeys = new Set<string>();

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

    const { licenseKey } = body;

    if (!licenseKey || typeof licenseKey !== "string" || !licenseKey.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a valid Whop license key." },
        { status: 400 }
      );
    }

    const cleanKey = licenseKey.trim().toUpperCase();
    const whopApiKey = process.env.WHOP_API_KEY;
    const isMasterDemoKey = cleanKey === "CLN-123" || cleanKey === "WHOP-CLEAN-PRO-2026";

    // 1. Check Upstash Redis to ensure key hasn't been redeemed already
    if (redis && !isMasterDemoKey) {
      const isAlreadyRedeemed = await redis.get(`redeemed:${cleanKey}`);
      if (isAlreadyRedeemed) {
        return NextResponse.json(
          {
            valid: false,
            error: "This license key has already been redeemed. Each Whop key is valid for one export unlock.",
          },
          { status: 403 }
        );
      }
    } else if (!isMasterDemoKey) {
      if (inMemoryRedeemedKeys.has(cleanKey)) {
        return NextResponse.json(
          {
            valid: false,
            error: "This license key has already been redeemed.",
          },
          { status: 403 }
        );
      }
    }

    // 2. Master Demo Key bypass (Always valid for developer UI testing)
    if (isMasterDemoKey) {
      return NextResponse.json({
        valid: true,
        plan: "Cleaning Business Launch Kit Pro (Demo Master Key)",
        key: cleanKey,
        status: "active",
        message: "Key verified successfully!",
      });
    }

    // 3. Test Single-Use Key (e.g. TEST-USER-1, TEST-ABC) for verifying Upstash Redis redemption logic
    const isTestRedeemableKey = cleanKey.startsWith("TEST-") || cleanKey.startsWith("CLN-DEV-");
    if (isTestRedeemableKey) {
      if (redis) {
        await redis.set(`redeemed:${cleanKey}`, {
          redeemedAt: new Date().toISOString(),
          plan: "Pro Starter (Test Single-Use Key)",
        });
      } else {
        inMemoryRedeemedKeys.add(cleanKey);
      }

      return NextResponse.json({
        valid: true,
        plan: "Cleaning Business Launch Kit Pro",
        key: cleanKey,
        status: "active",
        message: "Key validated and recorded in Upstash Redis as redeemed!",
      });
    }

    // 3. Check Whop API to confirm key is legitimate
    let licensePlan = "Cleaning Business Launch Kit (Whop License)";

    if (whopApiKey) {
      try {
        const whopRes = await fetch(
          `https://api.whop.com/v5/licenses/${encodeURIComponent(cleanKey)}`,
          {
            headers: {
              Authorization: `Bearer ${whopApiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!whopRes.ok) {
          return NextResponse.json(
            {
              valid: false,
              error: "License key not found or expired on Whop. Please verify your purchase.",
            },
            { status: 400 }
          );
        }

        const whopData = await whopRes.json();
        if (whopData.status !== "valid" && whopData.status !== "active") {
          return NextResponse.json(
            {
              valid: false,
              error: `Your Whop license status is currently '${whopData.status}'. Active license required.`,
            },
            { status: 403 }
          );
        }

        licensePlan = whopData.plan?.name || licensePlan;
      } catch (err: any) {
        console.error("Error communicating with Whop API:", err);
        return NextResponse.json(
          {
            valid: false,
            error: "Unable to reach Whop licensing servers. Please try again in a moment.",
          },
          { status: 502 }
        );
      }
    } else {
      // In sandbox mode without WHOP_API_KEY, accept standard Whop formats (e.g. CLN-XXXX or WHOP-XXXX)
      if (cleanKey.length < 6) {
        return NextResponse.json(
          {
            valid: false,
            error: "Invalid license key format. Expected format: CLN-XXXX-XXXX or WHOP-XXXX-XXXX.",
          },
          { status: 400 }
        );
      }
    }

    // 4. Record key in Upstash Redis as redeemed
    if (redis) {
      await redis.set(`redeemed:${cleanKey}`, {
        redeemedAt: new Date().toISOString(),
        plan: licensePlan,
      });
    } else {
      inMemoryRedeemedKeys.add(cleanKey);
    }

    return NextResponse.json({
      valid: true,
      plan: licensePlan,
      key: cleanKey,
      status: "active",
      message: "License validated and redeemed successfully!",
    });
  } catch (error: any) {
    console.error("validate-key error:", error);
    return NextResponse.json(
      { valid: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
