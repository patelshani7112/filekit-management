/**
 * Site Configuration
 * 
 * Change your website name and branding here - it will update everywhere automatically!
 */

export const siteConfig = {
  // Main website name
  name: "WorkflowPro",
  
  // Tagline/Description
  tagline: "Your complete file toolkit. Convert, compress, edit, and manage any file format — fast, secure, and 100% browser-based.",
  
  // Copyright year
  copyrightYear: "2025",
  
  // Contact email
  email: "support@workflowpro.com",
  
  // Social media links (optional)
  social: {
    twitter: "#",
    linkedin: "#",
    github: "#",
  }
} as const;

// Helper function to get copyright text
export const getCopyrightText = () => {
  return `Copyright © ${siteConfig.copyrightYear} ${siteConfig.name} — All Rights Reserved`;
};