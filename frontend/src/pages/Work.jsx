import PageHero from "@/components/site/PageHero";
import WorldsDeck from "@/components/landing/WorldsDeck";
import Brutalism from "@/components/landing/Brutalism";
import Glassmorphism from "@/components/landing/Glassmorphism";
import Minimalism from "@/components/landing/Minimalism";
import Maximalism from "@/components/landing/Maximalism";
import SaasPro from "@/components/landing/SaasPro";
import Luxury from "@/components/landing/Luxury";
import CaseStudies from "@/components/landing/CaseStudies";
import Testimonials from "@/components/landing/Testimonials";

// The proof. Six design "worlds" stack over each other like a dealt deck,
// then measurable case studies, then what clients said.
export default function Work() {
  return (
    <>
      <PageHero
        kicker="Selected work"
        title="The work."
        blurb="Every section below is a different design language. Same studio, same obsession, six distinct worlds."
        testId="page-work-hero"
      />
      <WorldsDeck>
        <Brutalism />
        <Glassmorphism />
        <Minimalism />
        <Maximalism />
        <SaasPro />
        <Luxury />
      </WorldsDeck>
      <CaseStudies />
      <Testimonials />
    </>
  );
}
