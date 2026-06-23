// Shared site config. Update these values before launch.

export const CALENDLY_URL = "https://calendly.com/sewitt-fitness-calendly/30min?";

export const INSTAGRAM_URL = "https://www.instagram.com/sewittfitness.ca/";
export const TWITTER_URL = "https://twitter.com/sewittfitness";
export const TIKTOK_URL = "https://tiktok.com/@sewittfitness";

export const SITE_NAME = "SEWITT.FITNESS";
export const SITE_TAGLINE =
  "Structured personal training built around you, not around trends.";

export const PRIMARY_CTA_LABEL = "Book Free Intro Session";

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Coaching Experience", href: "/#coaching-experience" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Coaching Insights", href: "/coaching-insights" },
] as const;

// Trust bar — placeholder values pending client input
export const TRUST_STATS = [
  { value: "200+", label: "Clients Coached" },
  { value: "10+", label: "Years Coaching" },
  { value: "5.0", label: "Average Rating" },
  { value: "GTA-Based", label: "Mississauga & Toronto" },
] as const;
