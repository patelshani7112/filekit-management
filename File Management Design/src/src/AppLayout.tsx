import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

/**
 * AppLayout Component
 * 
 * Main layout wrapper that provides Header and Footer for all pages.
 * The page content is rendered in the <Outlet /> component.
 */
export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
