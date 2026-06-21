/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // Lumora-specific fields
  tagline: string;
  onboardingHeadline: string;
  onboardingSubtext: string;
  enableDarkMode: boolean;
  enableStories: boolean;
  enableReels: boolean;
  enableDMs: boolean;
  enableVoiceVideoCalls: boolean;
  enableVerifiedBadge: boolean;
  enableAIFakeDetection: boolean;
  enableGovernmentIDVerification: boolean;
  maxPostCaptionLength: number;
  maxBioLength: number;
  storyExpirationHours: number;
  feedPostsPerPage: number;
  reelsPerPage: number;
  supportEmail: string;
  footerText: string;
  welcomeMessage: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Lumora",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#111827",
    // Card
    card:              "#f9fafb",
    cardForeground:    "#111827",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#111827",
    // Primary (Lumora Violet)
    primary:           "#7C3AED",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#f3f0ff",
    secondaryForeground: "#7C3AED",
    // Muted
    muted:           "#f9fafb",
    mutedForeground: "#6B7280",
    // Accent
    accent:           "#4F46E5",
    accentForeground: "#ffffff",
    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#E5E7EB",
    input:  "#E5E7EB",
    ring:   "#7C3AED",
    // Charts
    chart1: "#7C3AED",
    chart2: "#4F46E5",
    chart3: "#06B6D4",
    chart4: "#10B981",
    chart5: "#F59E0B",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#f9fafb",
    sidebarForeground:        "#111827",
    sidebarPrimary:           "#7C3AED",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#f3f0ff",
    sidebarAccentForeground:  "#7C3AED",
    sidebarBorder:            "#E5E7EB",
    sidebarRing:              "#7C3AED",
  },
  font: {
    headingFont: "Outfit",
    textFont: "Inter",
  },
  // Lumora-specific defaults
  tagline: "Your world, beautifully connected.",
  onboardingHeadline: "Welcome to Lumora",
  onboardingSubtext: "Share moments. Discover creators. Build your story.",
  enableDarkMode: true,
  enableStories: true,
  enableReels: true,
  enableDMs: true,
  enableVoiceVideoCalls: true,
  enableVerifiedBadge: true,
  enableAIFakeDetection: true,
  enableGovernmentIDVerification: true,
  maxPostCaptionLength: 2200,
  maxBioLength: 150,
  storyExpirationHours: 24,
  feedPostsPerPage: 12,
  reelsPerPage: 10,
  supportEmail: "support@lumora.app",
  footerText: "© 2026 Lumora. All rights reserved.",
  welcomeMessage: "Welcome to Lumora! Start sharing your world.",
};
