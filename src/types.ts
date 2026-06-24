/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PageMetadata {
  title: string;
  description: string;
  primaryFont: "Inter" | "Space Grotesk" | "Outfit" | "Playfair Display";
  vibe: "minimalist" | "tech" | "warm" | "editorial" | "brutalist";
  palette: {
    background: string; // e.g. "#000000" or "#fafafa"
    text: string;       // e.g. "#ffffff" or "#111111"
    accent: string;     // e.g. "#38bdf8" or "#f43f5e"
    secondary: string;  // e.g. "#1e1b4b" or "#e2e8f0"
  };
}

export interface SectionItem {
  id: string;
  title?: string;
  description?: string;
  icon?: string; // Lucide icon name, e.g. "Brain", "Cpu", "Server"
  badge?: string;
  link?: string;
  price?: string;
  features?: string[];
  duration?: string;
}

export interface SectionButton {
  text: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  actionType: "link" | "scroll_to_cta" | "contact_modal";
  actionValue?: string;
}

export interface Section {
  id: string;
  type: "hero" | "vision" | "technology" | "power" | "product" | "cta" | "features_grid" | "pricing" | "faq" | "contact" | "numbers";
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  alignment: "left" | "center" | "right";
  mediaType?: "canvas_particles" | "neural_brain" | "geometric_matrix" | "mockup_saas" | "avatar_grid" | "none";
  items?: SectionItem[];
  buttons?: SectionButton[];
  customHtml?: string;
}

export interface LandingPage {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  prompt: string;
  metadata: PageMetadata;
  sections: Section[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
