import { Outlet } from "react-router-dom";
import LiquidCursor from "@/components/site/LiquidCursor";
import ScrollToTop from "@/components/site/ScrollToTop";
import SmoothScroll from "@/components/landing/SmoothScroll";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/landing/Footer";

// Shared shell for every public marketing page. The cursor, smooth-scroll
// engine, nav and footer persist across route changes; only <Outlet/> swaps.
export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] overflow-x-hidden">
      <LiquidCursor />
      <SmoothScroll />
      <ScrollToTop />
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
