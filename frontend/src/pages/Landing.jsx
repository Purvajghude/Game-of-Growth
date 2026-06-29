import { useEffect, useRef, useState } from "react";
import Cursor from "@/components/landing/Cursor";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import Brutalism from "@/components/landing/Brutalism";
import Glassmorphism from "@/components/landing/Glassmorphism";
import Minimalism from "@/components/landing/Minimalism";
import Maximalism from "@/components/landing/Maximalism";
import SaasPro from "@/components/landing/SaasPro";
import Luxury from "@/components/landing/Luxury";
import Process from "@/components/landing/Process";
import CaseStudies from "@/components/landing/CaseStudies";
import Testimonials from "@/components/landing/Testimonials";
import Storefront from "@/components/landing/Storefront";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-x-hidden">
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Brutalism />
      <Glassmorphism />
      <Minimalism />
      <Maximalism />
      <SaasPro />
      <Luxury />
      <Process />
      <CaseStudies />
      <Testimonials />
      <Storefront />
      <FinalCta />
      <Footer />
    </div>
  );
}
