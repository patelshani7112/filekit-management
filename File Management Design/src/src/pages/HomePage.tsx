import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "../../components/sections/HeroSection";
import { FileTypesBanner } from "../../components/sections/FileTypesBanner";
import { PopularToolsSection } from "../../components/sections/PopularToolsSection";
import { ConvertAnythingSection } from "../../components/sections/ConvertAnythingSection";
import { QuickToolsSection } from "../../components/sections/QuickToolsSection";
import { AllToolsSection } from "../../components/sections/AllToolsSection";
import { WhyArcticSection } from "../../components/sections/WhyArcticSection";
import { FAQSection } from "../../components/sections/FAQSection";
import { FileUploadDialog, ToolConfig } from "../../components/dialogs/FileUploadDialog";

/**
 * Home Page Component
 * 
 * This is the main landing page that displays all sections.
 * Header and Footer are handled by AppLayout wrapper.
 * Navigation to dedicated tool pages (like /merge-pdf) is handled by React Router.
 */
export function HomePage() {
  const navigate = useNavigate();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);

  const handleToolClick = (toolConfig: ToolConfig) => {
    // Check if the tool has a dedicated page
    if (toolConfig.name === "Merge PDF") {
      navigate("/merge-pdf");
    } else if (toolConfig.name === "Split PDF") {
      navigate("/split-pdf");
    } else {
      // For tools without dedicated pages, open the dialog
      setSelectedTool(toolConfig);
      setIsUploadDialogOpen(true);
    }
  };

  return (
    <>
      <HeroSection />
      <FileTypesBanner />
      <PopularToolsSection onToolClick={handleToolClick} />
      <ConvertAnythingSection />
      <QuickToolsSection onToolClick={handleToolClick} />
      <AllToolsSection onToolClick={handleToolClick} />
      <WhyArcticSection />
      <FAQSection />

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        toolConfig={selectedTool}
      />
    </>
  );
}
