import React from "react";
import ReactDOM from "react-dom/root";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "./src/AppLayout";
import { HomePage } from "./src/pages/HomePage";
import { ContactPage } from "./src/pages/ContactPage";
import { HelpCenterPage } from "./src/pages/HelpCenterPage";
import { PrivacyPolicyPage } from "./src/pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "./src/pages/TermsOfUsePage";
import MergePdfPage from "./pages/pdf-tools/organize-manage-pdf/MergePdfPage";
import SplitPdfPage from "./pages/pdf-tools/organize-manage-pdf/SplitPdfPage";
import DeletePdfPagesPage from "./pages/pdf-tools/organize-manage-pdf/DeletePdfPagesPage";
import ExtractPdfPagesPage from "./pages/pdf-tools/organize-manage-pdf/ExtractPdfPagesPage";
import OrganizePdfPage from "./pages/pdf-tools/organize-manage-pdf/OrganizePdfPage";
import RotatePdfPage from "./pages/pdf-tools/organize-manage-pdf/RotatePdfPage";
import UnlockPdfPage from "./pages/pdf-tools/organize-manage-pdf/UnlockPdfPage";
import ProtectPdfPage from "./pages/pdf-tools/organize-manage-pdf/ProtectPdfPage";
import CompressPdfPage from "./pages/pdf-tools/optimize/CompressPdfPage";
import RepairPdfPage from "./pages/pdf-tools/repair/RepairPdfPage";
import EditPdfPage from "./pages/pdf-tools/edit-annotate/EditPdfPage";
import WatermarkPdfPage from "./pages/pdf-tools/edit-annotate/WatermarkPdfPage";
import AddPageNumbersPage from "./pages/pdf-tools/edit-annotate/AddPageNumbersPage";
import RedactPdfPage from "./pages/pdf-tools/edit-annotate/RedactPdfPage";
import SignPdfPage from "./pages/pdf-tools/edit-annotate/SignPdfPage_MULTI";
import RemoveWatermarkPage from "./pages/pdf-tools/edit-annotate/RemoveWatermarkPage";
import WordToPdfPage from "./pages/pdf-tools/convert-to-pdf/WordToPdfPage";
import ExcelToPdfPage from "./pages/pdf-tools/convert-to-pdf/ExcelToPdfPage";
import CompressImagePage from "./pages/image-tools/image-compression/CompressImagePage";
import CompressJPGPage from "./pages/image-tools/image-compression/CompressJPGPage";
import CompressPNGPage from "./pages/image-tools/image-compression/CompressPNGPage";
import CompressGIFPage from "./pages/image-tools/image-compression/CompressGIFPage";
import EditImagePage from "./pages/image-tools/editing/EditImagePage";
import ResizeImagePage from "./pages/image-tools/resizing/ResizeImagePage";
import ResizePngPage from "./pages/image-tools/resizing/ResizePngPage";
import RotateImagePage from "./pages/image-tools/editing/RotateImagePage";
import FlipImagePage from "./pages/image-tools/editing/FlipImagePage";
import RemoveBackgroundPage from "./pages/image-tools/editing/RemoveBackgroundPage";
import ImageEnlargerPage from "./pages/image-tools/editing/ImageEnlargerPage";
import ColorPickerPage from "./pages/image-tools/editing/ColorPickerPage";
import AddWatermarkPage from "./pages/image-tools/editing/AddWatermarkPage";
import MemeGeneratorPage from "./pages/image-tools/editing/MemeGeneratorPage";
import CropVideoPage from "./pages/video-audio-tools/video-editing/CropVideoPage";
import TrimVideoPage from "./pages/video-audio-tools/video-editing/TrimVideoPage";
import UnitConverterPage from "./pages/converters/other-converters/UnitConverterPage";
import TimeConverterPage from "./pages/converters/other-converters/TimeConverterPage";

import "./styles/globals.css";

/**
 * Main App Component with Router
 * 
 * This is the root component that sets up routing for the entire application.
 * All routes are defined here and wrapped with BrowserRouter.
 */
export default function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            
            {/* Tool Pages */}
            <Route path="/merge-pdf" element={<MergePdfPage />} />
            <Route path="/split-pdf" element={<SplitPdfPage />} />
            <Route path="/delete-pdf-pages" element={<DeletePdfPagesPage />} />
            <Route path="/extract-pdf-pages" element={<ExtractPdfPagesPage />} />
            <Route path="/organize-pdf" element={<OrganizePdfPage />} />
            <Route path="/rotate-pdf" element={<RotatePdfPage />} />
            <Route path="/unlock-pdf" element={<UnlockPdfPage />} />
            <Route path="/protect-pdf" element={<ProtectPdfPage />} />
            <Route path="/compress-pdf" element={<CompressPdfPage />} />
            <Route path="/repair-pdf" element={<RepairPdfPage />} />
            <Route path="/edit-pdf" element={<EditPdfPage />} />
            <Route path="/watermark-pdf" element={<WatermarkPdfPage />} />
            <Route path="/add-page-numbers-to-pdf" element={<AddPageNumbersPage />} />
            <Route path="/redact-pdf" element={<RedactPdfPage />} />
            <Route path="/sign-pdf" element={<SignPdfPage />} />
            <Route path="/remove-watermark-pdf" element={<RemoveWatermarkPage />} />
            <Route path="/word-to-pdf" element={<WordToPdfPage />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdfPage />} />
            <Route path="/compress-image" element={<CompressImagePage />} />
            <Route path="/compress-jpg" element={<CompressJPGPage />} />
            <Route path="/compress-png" element={<CompressPNGPage />} />
            <Route path="/compress-gif" element={<CompressGIFPage />} />
            <Route path="/edit-image" element={<EditImagePage />} />
            <Route path="/resize-image" element={<ResizeImagePage />} />
            <Route path="/resize-png" element={<ResizePngPage />} />
            <Route path="/rotate-image" element={<RotateImagePage />} />
            <Route path="/flip-image" element={<FlipImagePage />} />
            <Route path="/remove-background" element={<RemoveBackgroundPage />} />
            <Route path="/image-enlarger" element={<ImageEnlargerPage />} />
            <Route path="/color-picker" element={<ColorPickerPage />} />
            <Route path="/add-watermark" element={<AddWatermarkPage />} />
            <Route path="/meme-generator" element={<MemeGeneratorPage />} />
            <Route path="/crop-video" element={<CropVideoPage />} />
            <Route path="/trim-video" element={<TrimVideoPage />} />
            <Route path="/unit-converter" element={<UnitConverterPage />} />
            <Route path="/time-converter" element={<TimeConverterPage />} />
            
            {/* Catch-all route for preview environments and 404s - redirect to home */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}