// On route change: jump to top (through Lenis if it's running) and refresh
// ScrollTrigger so per-page pins/animations measure the new layout.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "@/lib/gsapSetup";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // let the new page paint, then remeasure scroll-driven animations
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
