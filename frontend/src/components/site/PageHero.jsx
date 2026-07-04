import ScrambleText from "@/components/site/ScrambleText";

// Top-of-page hero for the interior routes. The title decodes in with the
// scramble effect. Padding clears the fixed nav.
export default function PageHero({ kicker, title, blurb, testId }) {
  return (
    <section
      data-testid={testId}
      className="relative pt-36 lg:pt-48 pb-8 lg:pb-14 bg-[var(--paper)] grain-soft overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        {kicker && <p className="eyebrow">{kicker}</p>}
        <ScrambleText
          as="h1"
          text={title}
          className="headline block mt-4"
          style={{ fontSize: "clamp(48px, 9vw, 150px)", lineHeight: 0.92 }}
        />
        {blurb && <p className="lede mt-6 max-w-2xl">{blurb}</p>}
      </div>
    </section>
  );
}
