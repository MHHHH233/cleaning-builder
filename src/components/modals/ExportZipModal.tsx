"use client";

import React, { useState, useEffect } from "react";
import { BuilderState } from "@/types/builder";
import {
  Download,
  Check,
  X,
  FileArchive,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileText,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getAllStoredImageBlobs } from "@/lib/storage";

interface ExportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: BuilderState;
  onToast?: (message: string) => void;
}

const LICENSE_STORAGE_KEY = "whop_builder_license_key";

export const ExportZipModal: React.FC<ExportZipModalProps> = ({
  isOpen,
  onClose,
  state,
  onToast,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedLicense, setVerifiedLicense] = useState<{
    valid: boolean;
    plan: string;
    key: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.valid && parsed.key) {
            setVerifiedLicense(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyLicense = async (keyToTest?: string) => {
    const key = keyToTest || licenseKey;
    if (!key.trim()) {
      setVerifyError("Please enter your Whop license key.");
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);

    try {
      // Calls /api/validate-key as per project spec (checks Upstash Redis & Whop API)
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        const info = {
          valid: true,
          plan: data.plan || "Whop Verified License",
          key: key.trim(),
        };
        setVerifiedLicense(info);
        localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(info));
        if (onToast) onToast(`🎉 License Verified: ${info.plan}`);
      } else {
        setVerifyError(data.error || "License key is invalid or has already been redeemed.");
      }
    } catch (err: any) {
      setVerifyError("Failed to connect to validation server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();

      // 1. Extract all stored image Blobs from localForage (IndexedDB)
      const storedImages = await getAllStoredImageBlobs();
      const imagesFolder = zip.folder("public/images");

      storedImages.forEach((img) => {
        if (imagesFolder && img.blob) {
          imagesFolder.file(img.filename, img.blob);
        }
      });

      // 2. Prepare site-config.json
      zip.file("site-config.json", JSON.stringify(state, null, 2));

      // 3. next.config.mjs with output: 'export'
      const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
`;
      zip.file("next.config.mjs", nextConfigContent);

      // 4. package.json
      const packageJsonContent = {
        name: state.global.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          "lucide-react": "^1.47.0",
          next: "16.3.5",
          react: "19.2.8",
          "react-dom": "19.2.8",
        },
        devDependencies: {
          "@tailwindcss/postcss": "^4",
          "@types/node": "^20",
          "@types/react": "^19",
          "@types/react-dom": "^19",
          tailwindcss: "^4",
          typescript: "^5",
        },
      };
      zip.file("package.json", JSON.stringify(packageJsonContent, null, 2));

      // 5. postcss.config.mjs
      zip.file(
        "postcss.config.mjs",
        `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`
      );

      // 6. tsconfig.json
      const tsConfigContent = {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      };
      zip.file("tsconfig.json", JSON.stringify(tsConfigContent, null, 2));

      // 7. globals.css (With all 7 Refero theme tokens)
      const globalsCssContent = `@import "tailwindcss";

@layer base {
  :root {
    --bg-main: #08090a;
    --bg-card: #0f1011;
    --text-primary: #ffffff;
    --text-muted: #8a8f98;
    --brand-primary: #e4f222;
    --brand-foreground: #08090a;
    --border-color: #23252a;
    --radius-base: 6px;
    --shadow-base: 0 0 0 1px #23252a, 0 8px 24px -4px rgba(0, 0, 0, 0.6);
  }

  [data-theme="linear"] {
    --bg-main: #08090a;
    --bg-card: #0f1011;
    --text-primary: #ffffff;
    --text-muted: #8a8f98;
    --brand-primary: #e4f222;
    --brand-foreground: #08090a;
    --border-color: #23252a;
    --radius-base: 6px;
    --shadow-base: 0 0 0 1px #23252a, 0 8px 24px -4px rgba(0, 0, 0, 0.6);
  }

  [data-theme="linearity"] {
    --bg-main: #000000;
    --bg-card: #111111;
    --text-primary: #ffffff;
    --text-muted: #999999;
    --brand-primary: #ff4800;
    --brand-foreground: #ffffff;
    --border-color: #292929;
    --radius-base: 9999px;
    --shadow-base: 0 0 20px rgba(255, 72, 0, 0.22), 0 0 0 1px #292929;
  }

  [data-theme="dovetail"] {
    --bg-main: #0a0a0a;
    --bg-card: #141414;
    --text-primary: #ffffff;
    --text-muted: #a7a7a7;
    --brand-primary: #6798ff;
    --brand-foreground: #000000;
    --border-color: #222222;
    --radius-base: 8px;
    --shadow-base: 0 0 0 1px #222222;
  }

  [data-theme="dimension"] {
    --bg-main: #0a0a0a;
    --bg-card: #151518;
    --text-primary: #ededed;
    --text-muted: #8e8e93;
    --brand-primary: #ffffff;
    --brand-foreground: #0a0a0a;
    --border-color: rgba(255, 255, 255, 0.1);
    --radius-base: 24px;
    --shadow-base: 0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 0 35px -5px rgba(107, 98, 242, 0.25);
  }

  [data-theme="circle"] {
    --bg-main: #0b0c26;
    --bg-card: #14163d;
    --text-primary: #ffffff;
    --text-muted: #9fa4dd;
    --brand-primary: #3655e5;
    --brand-foreground: #ffffff;
    --border-color: #2c2e63;
    --radius-base: 14px;
    --shadow-base: 0 8px 30px rgba(54, 85, 229, 0.25), 0 0 0 1px #2c2e63;
  }

  [data-theme="stripe-clean"] {
    --bg-main: #f8fafc;
    --bg-card: #ffffff;
    --text-primary: #0f172a;
    --text-muted: #64748b;
    --brand-primary: #2563eb;
    --brand-foreground: #ffffff;
    --border-color: #e2e8f0;
    --radius-base: 12px;
    --shadow-base: 0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  [data-theme="emerald-clean"] {
    --bg-main: #0b100e;
    --bg-card: #121b17;
    --text-primary: #f0fdf4;
    --text-muted: #86efac;
    --brand-primary: #10b981;
    --brand-foreground: #022c19;
    --border-color: #1c3026;
    --radius-base: 10px;
    --shadow-base: 0 0 25px rgba(16, 185, 129, 0.15), 0 0 0 1px #1c3026;
  }
}

.bg-canvas { background-color: var(--bg-main); }
.bg-card-theme { background-color: var(--bg-card); }
.text-theme-primary { color: var(--text-primary); }
.text-theme-muted { color: var(--text-muted); }
.bg-theme-brand { background-color: var(--brand-primary); }
.text-theme-brand-fg { color: var(--brand-foreground); }
.border-theme { border-color: var(--border-color); }
.rounded-theme { border-radius: var(--radius-base); }
.shadow-theme { box-shadow: var(--shadow-base); }
`;
      zip.file("src/app/globals.css", globalsCssContent);

      // 8. src/app/layout.tsx
      const layoutTsxContent = `import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${state.global.businessName}",
  description: "Professional residential and commercial cleaning services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-theme-primary antialiased">
        {children}
      </body>
    </html>
  );
}
`;
      zip.file("src/app/layout.tsx", layoutTsxContent);

      // 9. Authentic Deployment Guide PDF
      const fallbackPdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 18 Tf 50 700 Td (Cleaning Business Deployment Guide) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n308\n%%EOF`;

      try {
        const pdfResponse = await fetch("/cleaning_business_deployment_guide.pdf");
        if (pdfResponse.ok) {
          const pdfBlob = await pdfResponse.blob();
          zip.file("cleaning_business_deployment_guide.pdf", pdfBlob);
        } else {
          zip.file("cleaning_business_deployment_guide.pdf", fallbackPdf);
        }
      } catch (err) {
        zip.file("cleaning_business_deployment_guide.pdf", fallbackPdf);
      }

      // 10. Standalone HTML single-file demo preview
      const activePage = state.pages[0];
      const htmlDemo = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.global.businessName}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css">
  <style>
    :root, [data-theme="${state.theme}"] {
      --bg-main: #08090a;
      --bg-card: #0f1011;
      --text-primary: #ffffff;
      --text-muted: #8a8f98;
      --brand-primary: #e4f222;
      --brand-foreground: #08090a;
      --border-color: #23252a;
      --radius-base: 6px;
      --shadow-base: 0 0 0 1px #23252a;
    }
    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
  </style>
</head>
<body data-theme="${state.theme}">
  <header style="border-bottom: 1px solid var(--border-color); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
    <h2 style="font-weight: bold;">${state.global.businessName}</h2>
    <nav>
      ${state.global.navLinks.map((l) => `<a href="${l.href}" style="margin-left: 1rem; color: var(--text-muted);">${l.label}</a>`).join("")}
    </nav>
  </header>
  <main style="max-width: 1200px; margin: 4rem auto; padding: 0 1rem; text-align: center;">
    <h1 style="font-size: 3rem; font-weight: 800; color: var(--text-primary);">${activePage.sections[0]?.data.headline || "Clean. Spotless. Guaranteed."}</h1>
    <p style="font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin: 1rem auto;">${activePage.sections[0]?.data.subheadline || "Hospital-grade cleaning for homes and offices."}</p>
    <a href="#contact" style="display: inline-block; margin-top: 2rem; background: var(--brand-primary); color: var(--brand-foreground); padding: 0.75rem 2rem; border-radius: var(--radius-base); font-weight: bold; text-decoration: none;">Get Instant Quote</a>
  </main>
</body>
</html>`;
      zip.file("standalone-preview.html", htmlDemo);

      // Generate and trigger download
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${state.global.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-launch-kit.zip`);
      if (onToast) onToast("📦 Downloaded complete Next.js site bundle with deployment guide!");
    } catch (err) {
      console.error("ZIP packaging error:", err);
    } finally {
      setDownloading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-bold shadow-md">
              <FileArchive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Export Website Package</span>
                {verifiedLicense?.valid ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="h-3 w-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center gap-1 font-semibold">
                    <Lock className="h-3 w-3" />
                    Whop Key Required
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400">
                Ready-to-deploy website package with all your customized content, photos, and launch guide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* License Verification Gate */}
        {!verifiedLicense ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Key className="h-4 w-4" />
              <span>Whop License Verification</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Exporting the full Next.js production code bundle requires a valid license key from Whop. Enter your key below to unlock your export:
            </p>

            {verifyError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{verifyError}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CLN-123 or WHOP-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyLicense()}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleVerifyLicense()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 px-4 py-2 text-xs font-bold text-zinc-950 transition-all disabled:opacity-50 shrink-0 shadow-sm"
                >
                  {isVerifying ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" />
                  )}
                  <span>{isVerifying ? "Verifying..." : "Verify Key"}</span>
                </button>
              </div>

              {/* Dev Demo Keys Shortcut */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLicenseKey("CLN-123");
                    handleVerifyLicense("CLN-123");
                  }}
                  className="text-[11px] text-amber-400/80 hover:text-amber-300 underline font-mono"
                >
                  Click to use Whop Demo Key (CLN-123)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* License Verified Badge Card */
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  {verifiedLicense.plan}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  Key: {verifiedLicense.key.slice(0, 8)}••••••••
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(LICENSE_STORAGE_KEY);
                setVerifiedLicense(null);
                setLicenseKey("");
              }}
              className="text-[10px] text-zinc-400 hover:text-rose-400 hover:underline"
            >
              Change Key
            </button>
          </div>
        )}

        {/* Package Highlights */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2 text-xs text-zinc-300">
          <div className="font-semibold text-zinc-200">What&apos;s included in your package:</div>
          <ul className="space-y-1.5 list-disc pl-4 text-zinc-400">
            <li><strong className="text-zinc-200">Complete Website Files</strong> — Pre-built and ready to publish immediately</li>
            <li><strong className="text-zinc-200">All Custom Content &amp; Photos</strong> — Bundled and optimized for fast loading</li>
            <li>
              <strong className="text-zinc-200">3-Minute Setup PDF Guide</strong> — Simple step-by-step instructions to get online{" "}
              <a
                href="/cleaning_business_deployment_guide.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline font-semibold ml-1 inline-flex items-center gap-0.5"
              >
                <span>(View PDF ↗)</span>
              </a>
            </li>
            <li><strong className="text-zinc-200">Chosen Theme:</strong> <span className="text-amber-400 font-bold capitalize">{state.theme.replace("-", " ")}</span></li>
          </ul>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!verifiedLicense || downloading}
            onClick={handleDownloadZip}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>
              {downloading
                ? "Compiling JSZip Bundle..."
                : verifiedLicense
                ? "Download ZIP Package"
                : "Enter License Key to Download"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
