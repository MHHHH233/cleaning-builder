# Cleaning Business Launch Kit & Website Builder 🚀

A high-performance visual website builder and digital launch kit tailored for residential and commercial cleaning businesses.

Built with **Next.js (App Router)**, **Tailwind CSS**, and the **Refero Theme Engine**.

---

## ✨ Key Features

- **7 Refero-Derived Design Themes**: Seamless instant switching between Linear, Linearity, Dovetail, Dimension, Circle, Stripe Clean, and Emerald Clean using CSS variable layers (`@layer base`).
- **Zero-Server Client Storage**: Full state and image persistence via `localForage` (IndexedDB) with zero remote database fees or storage costs.
- **AI Copywriting Studio**: Powered by OpenRouter free-tier models (default: `nvidia/nemotron-3-ultra-550b-a55b:free`) with smart fallback generator.
- **License Key Security (Whop + Upstash Redis)**:
  - Freemium live preview canvas.
  - Export locked behind Whop license validation.
  - Serverless single-use redemption tracking via Upstash Redis (`redeemed:KEY`).
- **Complete ZIP Export Engine**:
  - Compiles a production-ready Next.js static site (`output: 'export'`).
  - Bundles user configuration (`site-config.json`).
  - Extracts uploaded photos into `public/images/`.
  - Injects the step-by-step `cleaning_business_deployment_guide.pdf`.
- **100% Responsive Simulator**: Real-time Desktop, Tablet (768px), and Mobile (390px iPhone mockup) preview modes with interactive navigation and drawer menus.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
WHOP_API_KEY=your_whop_company_api_key
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
MASTER_LICENSE_KEY=WHOP-CLEAN-PRO-2026
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 1-Click Vercel Deployment

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Add your environment variables under **Settings → Environment Variables**.
5. Click **Deploy**!
