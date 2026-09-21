export type SectionType =
  | 'hero'
  | 'services'
  | 'about'
  | 'reviews'
  | 'faq'
  | 'contact';

export interface Section {
  id: string;
  type: SectionType;
  isHidden: boolean;
  order: number;
  data: Record<string, any>; // Stores text, image Blobs/URLs, etc.
}

export interface Page {
  id: string;
  slug: string; // e.g., "home", "services"
  title: string;
  sections: Section[];
}

export interface BuilderState {
  theme: string; // matches the data-theme string
  global: {
    logoUrl: string | null;
    businessName: string;
    navLinks: { label: string; href: string }[];
  };
  pages: Page[];
}

export interface ThemeDefinition {
  id: string;
  name: string;
  tagline: string;
  mode: 'dark' | 'light';
  bgMain: string;
  bgCard: string;
  brandPrimary: string;
  brandFg: string;
  textColor: string;
  borderColor: string;
  radiusLabel: string;
}

export const REFERO_THEMES: ThemeDefinition[] = [
  {
    id: 'linear',
    name: 'Linear',
    tagline: 'Midnight Precision',
    mode: 'dark',
    bgMain: '#08090a',
    bgCard: '#0f1011',
    brandPrimary: '#e4f222',
    brandFg: '#08090a',
    textColor: '#ffffff',
    borderColor: '#23252a',
    radiusLabel: '6px',
  },
  {
    id: 'linearity',
    name: 'Linearity',
    tagline: 'Molten Studio',
    mode: 'dark',
    bgMain: '#000000',
    bgCard: '#111111',
    brandPrimary: '#ff4800',
    brandFg: '#ffffff',
    textColor: '#ffffff',
    borderColor: '#292929',
    radiusLabel: 'Pill (9999px)',
  },
  {
    id: 'dovetail',
    name: 'Dovetail',
    tagline: 'Blueprint Dark',
    mode: 'dark',
    bgMain: '#0a0a0a',
    bgCard: '#141414',
    brandPrimary: '#6798ff',
    brandFg: '#000000',
    textColor: '#ffffff',
    borderColor: '#222222',
    radiusLabel: '8px',
  },
  {
    id: 'dimension',
    name: 'Dimension',
    tagline: 'Frosted Dusk',
    mode: 'dark',
    bgMain: '#0a0a0a',
    bgCard: '#151518',
    brandPrimary: '#ffffff',
    brandFg: '#0a0a0a',
    textColor: '#ededed',
    borderColor: 'rgba(255,255,255,0.1)',
    radiusLabel: '24px',
  },
  {
    id: 'circle',
    name: 'Circle',
    tagline: 'Cosmic Aurora',
    mode: 'dark',
    bgMain: '#0b0c26',
    bgCard: '#14163d',
    brandPrimary: '#3655e5',
    brandFg: '#ffffff',
    textColor: '#ffffff',
    borderColor: '#2c2e63',
    radiusLabel: '14px',
  },
  {
    id: 'stripe-clean',
    name: 'Stripe Clean',
    tagline: 'Spotless Daylight',
    mode: 'light',
    bgMain: '#f8fafc',
    bgCard: '#ffffff',
    brandPrimary: '#2563eb',
    brandFg: '#ffffff',
    textColor: '#0f172a',
    borderColor: '#e2e8f0',
    radiusLabel: '12px',
  },
  {
    id: 'emerald-clean',
    name: 'Supabase Eco',
    tagline: 'Bio-Clean Mint',
    mode: 'dark',
    bgMain: '#0b100e',
    bgCard: '#121b17',
    brandPrimary: '#10b981',
    brandFg: '#022c19',
    textColor: '#f0fdf4',
    borderColor: '#1c3026',
    radiusLabel: '10px',
  },
];
