/**
 * Smart AI copy generator for cleaning businesses
 * Generates high-converting, crisp copy tailored to various cleaning niches.
 */

export interface GeneratedCopySet {
  badge: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  features?: string[];
}

const CLEANING_NICHES = [
  {
    theme: "eco",
    badge: "🌿 100% Certified Botanical & Non-Toxic Cleaning",
    headline: "Pure Botanical Clean. Zero Chemical Residue.",
    subheadline:
      "Formulated with plant-based disinfectants safe for infants, pets, and the planet. Experience crystal-clear surfaces without inhaling synthetic toxins.",
    cta: "Book Eco-Friendly Clean",
  },
  {
    theme: "luxury",
    badge: "✨ White-Glove Architectural & Estate Detailing",
    headline: "Immaculate Perfection for Distinctive Residences.",
    subheadline:
      "Trained estate stewards specializing in bespoke marble, hardwood care, fine art dusting, and designer architectural glass.",
    cta: "Schedule Private Consultation",
  },
  {
    theme: "commercial",
    badge: "🏢 Enterprise Facility Care & Cleanroom Protocols",
    headline: "Commanding Cleanliness for High-Performance Workplaces.",
    subheadline:
      "Hospital-grade sanitization, nightly janitorial execution, and automated digital audit trails for executive corporate campuses.",
    cta: "Request Commercial Proposal",
  },
  {
    theme: "deep",
    badge: "⚡ 52-Point Restoration & Turnaround Specialists",
    headline: "The Deepest Clean Your Property Has Ever Seen.",
    subheadline:
      "From grout steam-extraction to high-pressure appliance detailing, we eliminate deep-seated grime and allergens in a single visit.",
    cta: "Claim Deep Clean Discount",
  },
  {
    theme: "speed",
    badge: "⏱️ Same-Day Priority Dispatch & 60s Booking",
    headline: "Instant Spotless Clean. Booked in Under 60 Seconds.",
    subheadline:
      "Lock in an elite background-checked cleaning specialist today. Transparent flat rates, guaranteed punctuality, and zero hidden fees.",
    cta: "Book Now — Save 15%",
  },
];

export function generateAICopy(fieldType?: string, contextHint?: string): string {
  const randomNiche = CLEANING_NICHES[Math.floor(Math.random() * CLEANING_NICHES.length)];

  if (fieldType === "headline" || fieldType === "title") {
    const headlines = [
      "Hospital-Grade Hygiene. Unrivaled Peace of Mind.",
      "The Gold Standard in Residential & Commercial Sanitization.",
      "Sparkling Clean Spaces, Engineered for Health.",
      "Step Into a Fresh, Spotless Oasis Every Single Day.",
      "Precision Cleaning Tailored to Your Exact Standards.",
      "Immaculate Care for Your Sanctuary and Workspace.",
    ];
    return headlines[Math.floor(Math.random() * headlines.length)];
  }

  if (fieldType === "subheadline" || fieldType === "subtitle" || fieldType === "description") {
    const subs = [
      "Our background-checked professionals utilize EPA-certified botanical agents and multi-stage HEPA filtration to eliminate 99.9% of bacteria, allergens, and fine particles.",
      "Enjoy transparent flat-rate pricing, flexible rescheduling, and our unconditional 100% satisfaction guarantee. If it's not spotless, we re-clean free.",
      "Trusted by over 500+ luxury homeowners and modern tech offices. Discover the difference that obsessive attention to detail makes.",
      "We treat your space with surgical precision. Every floor buffed, every counter disinfected, every room transformed into a tranquil retreat.",
    ];
    return subs[Math.floor(Math.random() * subs.length)];
  }

  if (fieldType === "badge") {
    const badges = [
      "✨ #1 Rated Independent Cleaning Crew in the Metro Area",
      "🛡️ Fully Insured, Bonded & Background-Verified Staff",
      "🌿 Certified 100% Non-Toxic & Pet-Safe Solutions",
      "⚡ Same-Day Priority Scheduling Available",
      "🏆 500+ Verified 5-Star Reviews on Yelp & Google",
    ];
    return badges[Math.floor(Math.random() * badges.length)];
  }

  if (fieldType === "primaryCtaText" || fieldType === "cta") {
    const ctas = [
      "Get Instant Fixed Quote",
      "Book Your Spotless Clean",
      "Schedule Free Walkthrough",
      "Claim 20% First Clean Discount",
      "Check Availability Now",
    ];
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  return randomNiche.headline;
}

export function generateRandomService(): {
  title: string;
  description: string;
  priceTag: string;
  features: string[];
} {
  const services = [
    {
      title: "Allergen & Pet-Dander Sanitization",
      description: "Specialized steam extraction removing deep fur, micro-dander, and odor enzymes from upholstery and carpets.",
      priceTag: "From $180",
      features: ["UV-C Sanitization Wand", "Enzyme Neutralizers", "Zero Fragrance Option"],
    },
    {
      title: "Commercial Kitchen Deep Scrub",
      description: "Exhaust hood degreasing, stainless steel buffing, floor drain decontamination, and health-code compliant sanitizing.",
      priceTag: "From $350",
      features: ["Health Inspector Ready", "Bio-Enzyme Degreaser", "Night Shift Dispatch"],
    },
    {
      title: "Eco-Luxe Vacation Rental Turnover",
      description: "Fast-turn hotel-standard linen turnover, restocking of guest amenities, and photo-verified spotless inspection.",
      priceTag: "From $110",
      features: ["Same-Day Turnaround", "Linen Wash & Press", "Damage Photo Reporting"],
    },
    {
      title: "Post-Event Emergency Recovery",
      description: "Rapid morning-after debris removal, glass cleanup, floor scrubbing, and odor clearing after major gatherings.",
      priceTag: "From $250",
      features: ["Rapid 4-Hour Response", "Waste Haul-Away", "Floor Deep Steam"],
    },
  ];

  return services[Math.floor(Math.random() * services.length)];
}

export function generateRandomTestimonial(): {
  name: string;
  role: string;
  rating: number;
  comment: string;
} {
  const testimonials = [
    {
      name: "Jessica Harrington",
      role: "Luxury Real Estate Broker",
      rating: 5,
      comment:
        "I will only recommend this team to my high-end listing clients. The attention to baseboards, chandeliers, and high windows makes houses sell 2x faster.",
    },
    {
      name: "Dr. Kenneth Wright",
      role: "Medical Clinic Director",
      rating: 5,
      comment:
        "Clinical cleanliness requires real discipline. Their crews follow cross-contamination prevention protocols perfectly and keep our patient suites spotless.",
    },
    {
      name: "Liam O'Connor",
      role: "Founder, Peak Robotics",
      rating: 5,
      comment:
        "Unbelievable work ethic. Our engineers work late hours, and the cleaning staff is always discrete, courteous, and leaves our lab looking brand new every morning.",
    },
  ];

  return testimonials[Math.floor(Math.random() * testimonials.length)];
}
