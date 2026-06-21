/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "App Tagline",
      maxLength: 120,
    },
    {
      fieldName: "onboardingHeadline",
      type: "string",
      required: false,
      label: "Onboarding Headline",
      maxLength: 80,
    },
    {
      fieldName: "onboardingSubtext",
      type: "string",
      required: false,
      label: "Onboarding Subtext",
      maxLength: 160,
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 200,
    },
    {
      fieldName: "supportEmail",
      type: "string",
      required: false,
      label: "Support Email",
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 120,
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        // ── Base ────────────────────────────────────────────────────────────
        { fieldName: "background",        type: "color", required: true,  label: "Background" },
        { fieldName: "foreground",        type: "color", required: true,  label: "Foreground" },
        // ── Card ────────────────────────────────────────────────────────────
        { fieldName: "card",              type: "color", required: true,  label: "Card" },
        { fieldName: "cardForeground",    type: "color", required: true,  label: "Card Foreground" },
        // ── Popover ─────────────────────────────────────────────────────────
        { fieldName: "popover",           type: "color", required: true,  label: "Popover" },
        { fieldName: "popoverForeground", type: "color", required: true,  label: "Popover Foreground" },
        // ── Primary ─────────────────────────────────────────────────────────
        { fieldName: "primary",           type: "color", required: true,  label: "Primary" },
        { fieldName: "primaryForeground", type: "color", required: true,  label: "Primary Foreground" },
        // ── Secondary ───────────────────────────────────────────────────────
        { fieldName: "secondary",           type: "color", required: true,  label: "Secondary" },
        { fieldName: "secondaryForeground", type: "color", required: true,  label: "Secondary Foreground" },
        // ── Muted ───────────────────────────────────────────────────────────
        { fieldName: "muted",           type: "color", required: true,  label: "Muted" },
        { fieldName: "mutedForeground", type: "color", required: true,  label: "Muted Foreground" },
        // ── Accent ──────────────────────────────────────────────────────────
        { fieldName: "accent",           type: "color", required: true,  label: "Accent" },
        { fieldName: "accentForeground", type: "color", required: true,  label: "Accent Foreground" },
        // ── Destructive ─────────────────────────────────────────────────────
        { fieldName: "destructive",           type: "color", required: true,  label: "Destructive" },
        { fieldName: "destructiveForeground", type: "color", required: true,  label: "Destructive Foreground" },
        // ── Border / Input / Ring ────────────────────────────────────────────
        { fieldName: "border", type: "color", required: true, label: "Border" },
        { fieldName: "input",  type: "color", required: true, label: "Input" },
        { fieldName: "ring",   type: "color", required: true, label: "Ring" },
        // ── Charts ──────────────────────────────────────────────────────────
        { fieldName: "chart1", type: "color", required: false, label: "Chart 1" },
        { fieldName: "chart2", type: "color", required: false, label: "Chart 2" },
        { fieldName: "chart3", type: "color", required: false, label: "Chart 3" },
        { fieldName: "chart4", type: "color", required: false, label: "Chart 4" },
        { fieldName: "chart5", type: "color", required: false, label: "Chart 5" },
        // ── Navbar ──────────────────────────────────────────────────────────
        { fieldName: "navbarBackground", type: "color", required: true, label: "Navbar Background" },
        // ── Sidebar ─────────────────────────────────────────────────────────
        { fieldName: "sidebarBackground",        type: "color", required: true,  label: "Sidebar Background" },
        { fieldName: "sidebarForeground",        type: "color", required: true,  label: "Sidebar Foreground" },
        { fieldName: "sidebarPrimary",           type: "color", required: true,  label: "Sidebar Primary" },
        { fieldName: "sidebarPrimaryForeground", type: "color", required: true,  label: "Sidebar Primary Foreground" },
        { fieldName: "sidebarAccent",            type: "color", required: true,  label: "Sidebar Accent" },
        { fieldName: "sidebarAccentForeground",  type: "color", required: true,  label: "Sidebar Accent Foreground" },
        { fieldName: "sidebarBorder",            type: "color", required: true,  label: "Sidebar Border" },
        { fieldName: "sidebarRing",              type: "color", required: true,  label: "Sidebar Ring" },
      ],
    },

    {
      fieldName: "font",
      type: "object",
      required: true,
      label: "Typography",
      fields: [
        {
          fieldName: "headingFont",
          type: "enum",
          required: true,
          label: "Heading Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Playfair Display",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Cinzel",
            "Cormorant Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Space Grotesk",
            "Josefin Sans",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
        {
          fieldName: "textFont",
          type: "enum",
          required: true,
          label: "Text Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Source Sans 3",
            "Noto Sans",
            "Lato",
            "Open Sans",
            "Roboto",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
      ],
    },

    // ── Feature Flags ──────────────────────────────────────────────────────
    { fieldName: "enableDarkMode",                 type: "boolean", required: false, label: "Enable Dark Mode Toggle" },
    { fieldName: "enableStories",                  type: "boolean", required: false, label: "Enable Stories Feature" },
    { fieldName: "enableReels",                    type: "boolean", required: false, label: "Enable Reels Feature" },
    { fieldName: "enableDMs",                      type: "boolean", required: false, label: "Enable Direct Messaging" },
    { fieldName: "enableVoiceVideoCalls",           type: "boolean", required: false, label: "Enable Voice & Video Calls" },
    { fieldName: "enableVerifiedBadge",            type: "boolean", required: false, label: "Enable Verified Badge System" },
    { fieldName: "enableAIFakeDetection",          type: "boolean", required: false, label: "Enable AI Fake Account Detection" },
    { fieldName: "enableGovernmentIDVerification", type: "boolean", required: false, label: "Enable Government ID Verification" },

    // ── App Logic Parameters ───────────────────────────────────────────────
    { fieldName: "maxPostCaptionLength", type: "number", required: false, label: "Max Post Caption Length", min: 50, max: 5000 },
    { fieldName: "maxBioLength",         type: "number", required: false, label: "Max Bio Length", min: 30, max: 500 },
    { fieldName: "storyExpirationHours", type: "number", required: false, label: "Story Expiration (hours)", min: 1, max: 72 },
    { fieldName: "feedPostsPerPage",     type: "number", required: false, label: "Feed Posts Per Page", min: 4, max: 50 },
    { fieldName: "reelsPerPage",         type: "number", required: false, label: "Reels Per Page", min: 3, max: 30 },
  ],
};
