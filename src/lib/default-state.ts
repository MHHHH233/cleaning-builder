import { BuilderState } from "@/types/builder";

export const DEFAULT_BUILDER_STATE: BuilderState = {
  theme: "linear",
  animationStyle: "slide-up",
  global: {
    logoUrl: null,
    businessName: "PureSpark Facility & Home Care",
    navLinks: [
      { label: "Home", href: "#hero" },
      { label: "Services", href: "#services" },
      { label: "Commercial", href: "/services" },
      { label: "Why Us", href: "#about" },
      { label: "Reviews", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
      { label: "Book Now", href: "#contact" },
    ],
  },
  pages: [
    {
      id: "page-home",
      slug: "home",
      title: "Home",
      sections: [
        {
          id: "sec-hero-1",
          type: "hero",
          isHidden: false,
          order: 0,
          data: {
            badge: "✨ Verified 5-Star Commercial & Residential Cleaning",
            headline: "Hospital-Grade Clean. Effortless Luxury.",
            subheadline:
              "We transform homes and executive offices into immaculate, allergen-free sanctuaries using 100% non-toxic botanical disinfectants and HEPA filtration.",
            primaryCtaText: "Get Instant Quote",
            primaryCtaLink: "#contact",
            secondaryCtaText: "Explore Services",
            secondaryCtaLink: "#services",
            heroImageUrl:
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
            stat1Value: "18,500+",
            stat1Label: "Spaces Cleaned",
            stat2Value: "99.8%",
            stat2Label: "Client Satisfaction",
            stat3Value: "100%",
            stat3Label: "Bonded & Insured",
          },
        },
        {
          id: "sec-services-1",
          type: "services",
          isHidden: false,
          order: 1,
          data: {
            badge: "Our Specialized Services",
            headline: "Tailored Cleaning For Every Space",
            subheadline:
              "Choose from flexible one-off deep cleans or recurring maintenance schedules designed around your lifestyle.",
            servicesList: [
              {
                id: "srv-1",
                title: "Deep Residential Cleaning",
                description:
                  "Comprehensive top-to-bottom scrub including baseboards, interior windows, cabinet interiors, and sanitization of high-touch zones.",
                priceTag: "From $149",
                features: [
                  "HEPA Air Filtration",
                  "Organic Citrus Solutions",
                  "Oven & Refrigerator Detailing",
                ],
              },
              {
                id: "srv-2",
                title: "Executive Commercial & Office",
                description:
                  "Nightly or weekly sanitation protocols for boardrooms, workstations, restrooms, and customer-facing commercial environments.",
                priceTag: "Custom Quote",
                features: [
                  "After-Hours Service",
                  "OSHA Compliant Crew",
                  "Consumable Restocking",
                ],
              },
              {
                id: "srv-3",
                title: "Move-In / Move-Out Clean",
                description:
                  "Zero-deposit-loss guarantee. Deep decontamination restoring rental properties and newly bought residences to factory perfection.",
                priceTag: "From $220",
                features: [
                  "Landlord Inspection Ready",
                  "Grout Steam Scrub",
                  "Inside All Appliances",
                ],
              },
              {
                id: "srv-4",
                title: "Post-Construction Detailing",
                description:
                  "Heavy-duty fine dust removal, drywall residue extraction, paint overspray scrubbing, and complete glass polishing.",
                priceTag: "From $280",
                features: [
                  "Industrial Vacuum Units",
                  "Micro-Dust Removal",
                  "Air Purifier Deployment",
                ],
              },
            ],
          },
        },
        {
          id: "sec-about-1",
          type: "about",
          isHidden: false,
          order: 2,
          data: {
            badge: "The PureSpark Standard",
            headline: "Engineered For Hygiene. Obsessed With Details.",
            subheadline:
              "We didn't just build a cleaning company—we designed a rigorous 52-point hygiene protocol powered by certified professionals who take pride in their craft.",
            imageUrl:
              "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1000&q=80",
            checkpoints: [
              "Vetted, FBI-background-checked and uniformed staff",
              "Hospital-grade, EPA-certified botanical sanitizers",
              "Color-coded microfiber systems preventing cross-contamination",
              "100% Re-Clean Guarantee: We return within 24h free of charge",
            ],
            quote:
              "“A spotless space isn't just aesthetic—it clears the mind, boosts workplace productivity, and protects your family's health.”",
            founderTitle: "Elena Vance, Head of Operations",
          },
        },
        {
          id: "sec-reviews-1",
          type: "reviews",
          isHidden: false,
          order: 3,
          data: {
            badge: "Client Testimonials",
            headline: "Trusted By 500+ Luxury Homes & Businesses",
            subheadline:
              "Read why homeowners, property managers, and venture-backed offices rely on PureSpark every single week.",
            reviewsList: [
              {
                id: "rev-1",
                name: "Marcus Sterling",
                role: "Managing Director, Sterling Architecture",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "PureSpark completely redefined our studio's workspace standards. The precision is noticeable down to the hairline grout joints and streak-free floor finishes.",
              },
              {
                id: "rev-2",
                name: "Sarah Chen",
                role: "Homeowner & Interior Designer",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "Having twin toddlers, safe non-toxic cleaning is non-negotiable. PureSpark leaves the home smelling crisp, fresh, and genuinely pure with zero harsh chemical odors.",
              },
              {
                id: "rev-3",
                name: "David Ross",
                role: "Principal, Apex Coworking Hub",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "Their recurring team arrives on time like clockwork. Cleanliness complaints from our 120+ tenants dropped to absolute zero since onboarding them.",
              },
            ],
          },
        },
        {
          id: "sec-faq-1",
          type: "faq",
          isHidden: false,
          order: 4,
          data: {
            badge: "Clear Answers",
            headline: "Frequently Asked Questions",
            subheadline:
              "Everything you need to know about our procedures, supplies, insurance, and satisfaction guarantee.",
            faqList: [
              {
                id: "faq-1",
                question: "Do I need to be home during the cleaning appointment?",
                answer:
                  "Not at all. Over 70% of our clients provide secure lockbox codes, smart lock access, or front-desk concierge keys. All staff are bonded, background-checked, and monitored via GPS check-in.",
              },
              {
                id: "faq-2",
                question: "Do you supply your own cleaning equipment and eco solutions?",
                answer:
                  "Yes, our mobile crews arrive fully equipped with commercial-grade HEPA filtered vacuums, fresh microfiber mops, steam cleaners, and eco-certified botanical cleaners.",
              },
              {
                id: "faq-3",
                question: "What is your 100% Re-Clean Guarantee policy?",
                answer:
                  "If any area inspected within 24 hours fails to meet our 52-point checklist, simply send a photo through our portal and we dispatch a supervisor to re-clean that area immediately at no charge.",
              },
              {
                id: "faq-4",
                question: "Can I reschedule or pause recurring cleaning without penalties?",
                answer:
                  "Yes! We offer 100% flexibility with as little as 24 hours advance notice via text or phone with zero cancellation fees.",
              },
            ],
          },
        },
        {
          id: "sec-contact-1",
          type: "contact",
          isHidden: false,
          order: 5,
          data: {
            badge: "Instant Estimate",
            headline: "Ready for an Immaculate Space?",
            subheadline:
              "Lock in your preferred date in under 60 seconds. Our scheduling team confirms all details instantly.",
            phoneNumber: "(800) 842-7873",
            emailAddress: "dispatch@puresparkclean.com",
            serviceArea: "Greater Metropolitan & Surrounding Suburbs",
            businessHours: "Mon - Sat: 7:00 AM – 8:00 PM",
            submitButtonText: "Request Free 60-Second Quote",
          },
        },
      ],
    },
    {
      id: "page-services",
      slug: "services",
      title: "Commercial & Specialized",
      sections: [
        {
          id: "sec-srv-hero",
          type: "hero",
          isHidden: false,
          order: 0,
          data: {
            badge: "Commercial Grade Solutions",
            headline: "Enterprise Facility Sanitation & Maintenance",
            subheadline:
              "Custom janitorial contracts, post-event rapid turnaround, and cleanroom sanitization for mission-critical corporate environments.",
            primaryCtaText: "Book Walkthrough",
            primaryCtaLink: "#contact",
            secondaryCtaText: "Call Dispatch",
            secondaryCtaLink: "tel:8008427873",
            heroImageUrl:
              "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
            stat1Value: "24/7",
            stat1Label: "Emergency Dispatch",
            stat2Value: "0 PPM",
            stat2Label: "Residue Standard",
            stat3Value: "LEED",
            stat3Label: "Green Certified",
          },
        },
        {
          id: "sec-srv-services",
          type: "services",
          isHidden: false,
          order: 1,
          data: {
            badge: "Commercial Packages",
            headline: "Engineered For Heavy Foot-Traffic & Compliance",
            subheadline:
              "Tailored corporate cleaning schedules that meet OSHA, CDC, and LEED workplace guidelines.",
            servicesList: [
              {
                id: "srv-comm-1",
                title: "Daily Corporate Office Janitorial",
                description:
                  "Comprehensive night shift or day porter upkeep for workstations, conference centers, kitchenettes, and executive suites.",
                priceTag: "Custom Contract",
                features: [
                  "Day Porter or Nightly Service",
                  "Restroom Hygiene Sanitization",
                  "Consumable Restocking Included",
                ],
              },
              {
                id: "srv-comm-2",
                title: "Industrial Floor Stripping & Waxing",
                description:
                  "High-gloss burnishing, epoxy floor deep machine scrubbing, and protective sealants for retail spaces and warehouses.",
                priceTag: "From $0.35/sqft",
                features: [
                  "Diamond Pad Restoration",
                  "Non-Slip Protective Coats",
                  "Minimal Business Downtime",
                ],
              },
              {
                id: "srv-comm-3",
                title: "Medical & Cleanroom Disinfection",
                description:
                  "EPA hospital-grade electrostatic spray decontamination preventing cross-infection in healthcare and bio-tech facilities.",
                priceTag: "Certified Protocol",
                features: [
                  "99.999% Pathogen Neutralization",
                  "OSHA Bloodborne Pathogen Trained",
                  "Digital Verification Logs",
                ],
              },
              {
                id: "srv-comm-4",
                title: "Post-Event & Convention Turnaround",
                description:
                  "Rapid-response crews for trade shows, banquet halls, and corporate summits with full waste removal and floor restoration.",
                priceTag: "Rapid Response",
                features: [
                  "Sub-4-Hour Deployment",
                  "Complete Trash & Debris Clear",
                  "Restroom Restocking & Polish",
                ],
              },
            ],
          },
        },
        {
          id: "sec-srv-about",
          type: "about",
          isHidden: false,
          order: 2,
          data: {
            badge: "Enterprise Security & SLA",
            headline: "Vetted Personnel. Absolute Discretion.",
            subheadline:
              "We understand the sensitivity of enterprise workspaces. Every cleaner is background checked, bonded, and bound by strict NDA agreements.",
            imageUrl:
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
            checkpoints: [
              "$5,000,000 Commercial General Liability & Umbrella Insurance",
              "FBI fingerprinting and criminal background verifications",
              "Dedicated Account Executive & 24/7 Operations Command Line",
              "100% Guaranteed 2-Hour Response SLA for emergency incidents",
            ],
            quote:
              "“PureSpark manages our 85,000 sq ft headquarters across 4 floors. In 2 years, we have had zero compliance violations and impeccable hygiene audits.”",
            founderTitle: "Robert Sterling, VP Workplace Experience",
          },
        },
        {
          id: "sec-srv-reviews",
          type: "reviews",
          isHidden: false,
          order: 3,
          data: {
            badge: "Commercial Client Trust",
            headline: "What Facility Managers Say About Us",
            subheadline:
              "Discover why leading property management firms and tech campuses partner with PureSpark.",
            reviewsList: [
              {
                id: "rev-c1",
                name: "Katherine Vance",
                role: "Facilities Director, Nexus Biopharma",
                avatar:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "Their cleanroom protocols exceed our rigorous FDA audit requirements. The team is disciplined, polite, and exceptionally thorough.",
              },
              {
                id: "rev-c2",
                name: "Jason Ramirez",
                role: "Senior Property Manager, Skyline Towers",
                avatar:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "Switching to PureSpark cut our tenant cleanliness complaints by 100%. Their day porters keep our lobby gleaming through rain or snow.",
              },
              {
                id: "rev-c3",
                name: "Amara Patel",
                role: "Chief Operating Officer, Horizon Fintech",
                avatar:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                comment:
                  "Nightly cleaning without disrupting late-night engineering teams. The green botanical products ensure no strong morning odors.",
              },
            ],
          },
        },
        {
          id: "sec-srv-faq",
          type: "faq",
          isHidden: false,
          order: 4,
          data: {
            badge: "Contract FAQ",
            headline: "Commercial Janitorial Questions",
            subheadline:
              "Clear answers regarding insurance, security protocols, schedules, and custom corporate billing.",
            faqList: [
              {
                id: "faq-c1",
                question: "What security and access protocols do your cleaning teams follow?",
                answer:
                  "Our staff are badged, uniformed, and trained on digital keycard access, alarm arming/disarming, and perimeter security. We strictly adhere to your internal NDA and security clearances.",
              },
              {
                id: "faq-c2",
                question: "Can we schedule cleaning strictly after business hours?",
                answer:
                  "Yes. Over 85% of our commercial accounts are serviced between 6:00 PM and 5:00 AM, ensuring zero interruption to your employees and daily operations.",
              },
              {
                id: "faq-c3",
                question: "Do you supply industrial restroom paper products and hand soap?",
                answer:
                  "Yes, we offer complete consumable management (jumbo roll tissues, multifold towels, antimicrobial foaming soaps, trash liners) with automated monthly inventory refills.",
              },
              {
                id: "faq-c4",
                question: "What is your emergency SLA if there is a spill or facility flood?",
                answer:
                  "All commercial contract accounts have direct access to our 24/7 dispatch hotline with guaranteed 2-hour on-site rapid response crews.",
              },
            ],
          },
        },
        {
          id: "sec-srv-contact",
          type: "contact",
          isHidden: false,
          order: 5,
          data: {
            badge: "B2B Accounts",
            headline: "Request a Commercial Facility Walkthrough",
            subheadline:
              "Our operations director conducts on-site scope assessments with custom SLA proposals within 24 hours.",
            phoneNumber: "(800) 842-7873",
            emailAddress: "corporate@puresparkclean.com",
            serviceArea: "Commercial Corridors & Tech Campuses",
            businessHours: "24/7 Dedicated Account Manager",
            submitButtonText: "Book On-Site Assessment",
          },
        },
      ],
    },
  ],
};
