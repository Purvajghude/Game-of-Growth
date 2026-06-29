{
  "project": {
    "name": "Game of Growth",
    "type": "hybrid_fullstack",
    "north_star": "Make the website itself the portfolio: each section is a distinct design ‘world’ with cinematic transitions; dashboard feels like Linear/Notion."
  },
  "critical_rules": {
    "js_only": true,
    "testids_required": "All interactive + key informational elements MUST include data-testid in kebab-case.",
    "gradient_restrictions": {
      "never": [
        "dark/saturated gradient combos (purple/pink, blue→purple, purple→pink, green→blue, red→pink)",
        "gradients covering >20% viewport",
        "gradients on text-heavy reading areas",
        "gradients on small UI elements (<100px width)",
        "stacking multiple gradient layers in same viewport"
      ],
      "allowed": [
        "hero/section backgrounds only (decorative)",
        "large background washes behind hero typography",
        "decorative overlays/accent shapes"
      ],
      "enforcement": "IF gradient area exceeds 20% viewport OR impacts readability THEN fallback to solid colors."
    }
  },
  "brand_attributes": [
    "creative",
    "experimental",
    "premium",
    "bold",
    "confident",
    "cinematic",
    "technology-driven",
    "design-first"
  ],
  "global_design_tokens": {
    "fonts": {
      "display": {
        "google_font": "Bebas Neue",
        "usage": "Hero + section title moments (cinematic, condensed).",
        "css": "font-family: 'Bebas Neue', ui-sans-serif, system-ui;"
      },
      "body": {
        "google_font": "IBM Plex Sans",
        "usage": "Body, UI labels, dashboard.",
        "css": "font-family: 'IBM Plex Sans', ui-sans-serif, system-ui;"
      },
      "mono": {
        "google_font": "IBM Plex Mono",
        "usage": "Metrics, tags, small technical labels.",
        "css": "font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular;"
      },
      "import_snippet": "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');"
    },
    "type_scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base md:text-lg",
      "body": "text-sm md:text-base",
      "small": "text-xs"
    },
    "radii": {
      "soft": "--radius: 14px (marketing glass sections)",
      "ui": "--radius: 10px (dashboard)",
      "brutal": "2px (neo-brutal section)"
    },
    "shadows": {
      "cinematic": "shadow-[0_30px_120px_rgba(0,0,0,0.55)]",
      "glass": "shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
      "brutal": "shadow-[10px_10px_0_rgba(0,0,0,1)]"
    },
    "spacing": {
      "page_gutter": "px-5 sm:px-8 lg:px-12",
      "section_y": "py-16 sm:py-20 lg:py-28",
      "max_width": "max-w-[1200px]",
      "hero_max_width": "max-w-[1400px]"
    },
    "focus": {
      "ring": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
      "ring_offset": "focus-visible:ring-offset-background"
    }
  },
  "global_color_system": {
    "note": "Use shadcn CSS variables as base; override per-section via data-theme on section wrappers.",
    "base_light": {
      "background": "0 0% 100%",
      "foreground": "0 0% 6%",
      "muted": "0 0% 96%",
      "muted_foreground": "0 0% 45%",
      "border": "0 0% 90%",
      "ring": "210 90% 45%"
    },
    "base_dark": {
      "background": "240 6% 6%",
      "foreground": "0 0% 98%",
      "muted": "240 5% 14%",
      "muted_foreground": "240 5% 70%",
      "border": "240 5% 18%",
      "ring": "190 95% 55%"
    },
    "semantic": {
      "success": "142 70% 40%",
      "warning": "38 92% 50%",
      "danger": "0 84% 60%",
      "info": "200 90% 50%"
    }
  },
  "section_themes_marketing": [
    {
      "id": "hero-cinematic",
      "name": "Hero — Cinematic Futurism",
      "palette": {
        "bg": "#07080B",
        "fg": "#F5F7FF",
        "accent": "#7EE7FF (ice-cyan)",
        "accent2": "#B7FFB0 (mint)",
        "line": "rgba(255,255,255,0.10)",
        "allowed_gradient_bg": "radial-gradient(1200px circle at 20% 20%, rgba(126,231,255,0.18), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(183,255,176,0.12), transparent 60%)"
      },
      "typography_treatment": {
        "headline": "Bebas Neue, tracking-[0.02em], uppercase, ultra-large; mix with IBM Plex Sans for subline.",
        "sub": "Short, minimal. 1–2 lines max."
      },
      "signature_interaction": [
        "Custom cursor: dot + halo; expands on CTA; shows label on portfolio hover.",
        "Mouse-parallax: hero background shapes + floating UI chips move with pointer.",
        "CTA micro: press scale 0.98 + glow ring (no transition:all)."
      ],
      "layout_wireframe": "Fullscreen. Left: massive headline + 2 CTAs. Right: floating glass panels (3) with tiny ‘proof’ stats. Background: subtle noise + abstract 3D image overlay.",
      "imagery_direction": "Abstract 3D glass shapes + cinematic portraits as subtle masked layers.",
      "data_testids": {
        "primary_cta": "hero-primary-cta-button",
        "secondary_cta": "hero-secondary-cta-button",
        "nav_portfolio": "hero-view-portfolio-link"
      }
    },
    {
      "id": "transition-morph",
      "name": "Magical Transition — Morph Between Worlds",
      "palette": {
        "bg": "driven by next section",
        "effect": "masked color wash + typography morph"
      },
      "typography_treatment": "Animate variable letter-spacing + weight swap (Bebas → IBM Plex Sans) during scroll.",
      "signature_interaction": [
        "Scroll-driven mask reveal: a circular/diagonal wipe that ‘peels’ the old theme.",
        "Noise + film-burn overlay for 400–700ms during theme swap.",
        "Pinned 1 viewport: transition section is a ‘portal’ with 2 layers crossfading."
      ],
      "layout_wireframe": "A pinned portal section: center ‘GOG’ monogram, background shifts, UI tokens swap, then next section snaps in.",
      "implementation_guidance": {
        "library": "Framer Motion (scroll) + optional GSAP ScrollTrigger if needed",
        "pattern": "Use a ThemeProvider that reads current section in-view and sets data-theme on <body> or wrapper; animate CSS variables via motion values."
      }
    },
    {
      "id": "neo-brutal-branding",
      "name": "Neo-Brutalism — Branding Projects",
      "palette": {
        "bg": "#FFF7E8 (warm paper)",
        "fg": "#111111",
        "accent": "#00D1FF (electric cyan)",
        "accent2": "#FFB800 (marigold)",
        "stroke": "#111111"
      },
      "typography_treatment": "IBM Plex Sans with extreme weights; headings in Bebas but outlined (stroke effect).",
      "signature_interaction": [
        "Buttons: thick border + brutal shadow; on hover shadow shifts (x/y) and background snaps.",
        "Project cards: tilt 2deg random on hover + sticker badges pop.",
        "Cursor becomes ‘stamp’ circle when hovering cards."
      ],
      "layout_wireframe": "Asymmetric grid: left column giant title + filters; right masonry of 6 branding tiles with sticker badges.",
      "imagery_direction": "Bold brand mockups, poster crops, loud color blocks."
    },
    {
      "id": "glass-web",
      "name": "Glassmorphism — Web Design Projects",
      "palette": {
        "bg": "#0B1220",
        "fg": "#EAF0FF",
        "glass": "rgba(255,255,255,0.08)",
        "stroke": "rgba(255,255,255,0.14)",
        "accent": "#7EE7FF"
      },
      "typography_treatment": "Softer: IBM Plex Sans, sentence case, airy leading.",
      "signature_interaction": [
        "Cards float on hover (translate-y -4) + subtle specular highlight sweep.",
        "Background: slow moving gradient blobs (opacity 0.12) + noise.",
        "Carousel of sites with snap + drag."
      ],
      "layout_wireframe": "Centered container with 3-up glass cards; each opens a dialog with full bleed preview.",
      "imagery_direction": "Abstract 3D + website screenshots in device frames."
    },
    {
      "id": "apple-minimal",
      "name": "Apple-inspired Minimalism — UI Systems",
      "palette": {
        "bg": "#FFFFFF",
        "fg": "#0B0D12",
        "muted": "#F4F5F7",
        "accent": "#0EA5E9 (sky)"
    {
      "id": "case-studies-immersive",
      "name": "Case Studies — Immersive Stories",
      "palette": {
        "bg": "#FFFFFF",
        "fg": "#0B0D12",
        "accent": "#0EA5E9",
        "muted": "#F4F5F7"
      },
      "typography_treatment": "Storytelling: large headings, generous leading, pull quotes.",
      "signature_interaction": [
        "Before/After slider (drag handle).",
        "Pinned media: video/image stays while narrative scrolls.",
        "Metrics chips animate in (count-up) when revealed."
      ],
      "layout_wireframe": "Each case study is a mini-page section: hero media, problem/solution split, before-after, metrics row, gallery.",
      "imagery_direction": "Project screenshots + cinematic b-roll stills."
    },
    {
      "id": "testimonials-kinetic",
      "name": "Testimonials — Kinetic Quotes",
      "palette": {
        "bg": "#0E0F14",
        "fg": "#F7F2EA",
        "accent": "#7EE7FF",
        "line": "rgba(247,242,234,0.14)"
      },
      "typography_treatment": "Oversized quotes in Bebas; attribution in mono.",
      "signature_interaction": [
        "Quotes orbit on a circular track; scroll rotates the wheel.",
        "Hover pauses rotation + expands quote.",
        "Portraits reveal via masked blur-in."
      ],
      "layout_wireframe": "Center circular quote wheel; right panel shows active quote details + CTA.",
      "imagery_direction": "Cinematic portraits (dark studio)."
    },
    {
      "id": "storefront-products",
      "name": "Digital Products Storefront — Exciting Commerce",
      "palette": {
        "bg": "#FFF7E8",
        "fg": "#111111",
        "accent": "#00D1FF",
        "accent2": "#FF6A3D"
      },
      "typography_treatment": "Brutal-meets-editorial: bold titles + dense spec lists.",
      "signature_interaction": [
        "Product cards flip to show contents.",
        "Add-to-cart uses sonner toast + mini cart drawer.",
        "Hover shows ‘included files’ chips sliding in."
      ],
      "layout_wireframe": "Bento grid of products (LUTs, motion packs, UI kits) + right sticky cart summary.",
      "imagery_direction": "Abstract pack covers, gradient-free bold color blocks, small previews."
    },
    {
      "id": "final-cta",
      "name": "Final CTA — Cinematic Closure",
      "palette": {
        "bg": "#07080B",
        "fg": "#F5F7FF",
        "accent": "#B7FFB0",
        "line": "rgba(255,255,255,0.10)",
        "allowed_gradient_bg": "radial-gradient(900px circle at 30% 40%, rgba(183,255,176,0.14), transparent 60%), radial-gradient(900px circle at 70% 60%, rgba(126,231,255,0.10), transparent 60%)"
      },
      "typography_treatment": "Massive headline, minimal copy.",
      "signature_interaction": [
        "Background particles (subtle) + slow parallax.",
        "Primary CTA has glow ring on hover; press scale 0.98.",
        "Secondary CTA is ghost glass button."
      ],
      "layout_wireframe": "Centered but left-aligned text block; huge headline; 2 CTAs; small trust row.",
      "imagery_direction": "Abstract 3D + subtle film grain."
    }

      },
      "typography_treatment": "Editorial restraint: IBM Plex Sans; large whitespace; thin dividers.",
      "signature_interaction": [
        "Scroll reveal: subtle fade+up 12px with long easing.",
        "Product gallery: horizontal scroll with progress indicator.",
        "Buttons: minimal, pill-ish, soft shadow."
      ],
      "layout_wireframe": "Two-column: left narrative; right product stack (device mockups).",
      "imagery_direction": "Clean device mockups on white."
    },
    {
      "id": "maximal-editorial",
      "name": "Maximalism — Content + Video",
      "palette": {
        "bg": "#0E0F14",
        "fg": "#F7F2EA",
        "accent": "#FF6A3D (tangerine)",
        "accent2": "#A7F0BA (mint)",
        "paper": "#F7F2EA"
      },
      "typography_treatment": "Magazine: Bebas for huge headlines + IBM Plex Sans for captions; aggressive tracking changes.",
      "signature_interaction": [
        "Layered posters: hover swaps z-index + parallax.",
        "Kinetic type: words slide in on scroll.",
        "Video thumbnails: play-on-hover (muted) with progress ring."
      ],
      "layout_wireframe": "Editorial collage: 12-col grid with overlapping blocks, pull quotes, and poster tiles.",
      "imagery_direction": "High-contrast editorial photography + motion stills."
    },
    {
      "id": "saas-trust",
      "name": "Professional SaaS — AI Systems + Automation",
      "palette": {
        "bg": "#0B1220",
        "fg": "#EAF0FF",
        "card": "#0F1A2E",
        "border": "rgba(255,255,255,0.10)",
        "accent": "#7EE7FF"
      },
      "typography_treatment": "Dense, product-like. IBM Plex Sans + IBM Plex Mono for metrics.",
      "signature_interaction": [
        "Feature grid with hover ‘spotlight’ following cursor.",
        "Workflow diagram: animated connectors on scroll.",
        "Stats count-up when in view."
      ],
      "layout_wireframe": "Top: feature headline + 3 stats. Below: 2x3 feature grid + workflow panel.",
      "imagery_direction": "Dashboard-like illustrations, subtle charts."
    },
    {
      "id": "luxury-black",
      "name": "Luxury Brand — Premium Clients",
      "palette": {
        "bg": "#050505",
        "fg": "#FAFAF7",
        "gold": "#C8A96A",
        "line": "rgba(200,169,106,0.25)"
      },
      "typography_treatment": "Bebas for titles; IBM Plex Sans for body; gold micro-labels in mono.",
      "signature_interaction": [
        "Cinematic image reveal: vertical slit opens to full photo.",
        "Gold underline animates on hover.",
        "Buttons: black solid with gold border; press removes shadow."
      ],
      "layout_wireframe": "Full-bleed photo strip + right aligned copy; alternating alignment per project.",
      "imagery_direction": "Cinematic portraits, luxury product shots, studio lighting."
    },
    {
      "id": "process-timeline",
      "name": "Interactive Process — Timeline",
      "palette": {
        "bg": "#0B1220",
        "fg": "#EAF0FF",
        "accent": "#B7FFB0",
        "line": "rgba(255,255,255,0.12)"
      },
      "typography_treatment": "Step labels in mono; titles in Bebas.",
      "signature_interaction": [
        "Timeline scrubber: drag handle updates step content.",
        "Each step animates: icon draws + card slides.",
        "Progress line fills with spring."
      ],
      "layout_wireframe": "Left vertical timeline; right large step card with deliverables + sample artifacts.",
      "imagery_direction": "Abstract icons + small artifact thumbnails."
    },
    {
      "id": "case-studies-immersive",
      "name": "Case Studies — Immersive Stories",
      "palette": {
        "bg": "#FFFFFF",
        "fg": "#0B0D12",
        "accent": "#0EA5E9",
        "muted": "#F4F5F7"
      },
      "typography_treatment": "Storytelling: large headings, generous leading, pull quotes.",
      "signature_interaction": [
        "Before/After slider (drag).",