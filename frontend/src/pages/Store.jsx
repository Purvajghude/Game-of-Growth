import PageHero from "@/components/site/PageHero";
import Storefront from "@/components/landing/Storefront";

// Digital products.
export default function Store() {
  return (
    <>
      <PageHero
        kicker="Digital products"
        title="The store."
        blurb="Tools we use ourselves, packaged for you. LUT packs, motion kits and UI systems."
        testId="page-store-hero"
      />
      <Storefront />
    </>
  );
}
