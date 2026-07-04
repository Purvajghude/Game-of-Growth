import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import TeamDeck3D from "@/components/landing/TeamDeck3D";

const VALUES = [
  { n: "01", title: "In-house, always", desc: "Strategy, camera, design and code sit in the same room. No agencies inside the agency." },
  { n: "02", title: "Ship, then refine", desc: "We'd rather launch and improve in the open than polish in private for months." },
  { n: "03", title: "Numbers, not vibes", desc: "Everything we make points at a metric you actually care about." },
];

// Who we are. The 3D circular team deck is the centrepiece.
export default function Studio() {
  return (
    <>
      <PageHero
        kicker="The studio"
        title="Small room, loud output."
        blurb="Game of Growth is four people who shoot, design, and build for businesses that refuse to look like everyone else."
        testId="page-studio-hero"
      />

      <TeamDeck3D />

      {/* Values */}
      <section className="relative bg-[var(--paper-2)] py-20 lg:py-32 grain-soft border-t border-[var(--line)]">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
          <p className="eyebrow">How we work</p>
          <div className="mt-10 grid md:grid-cols-3 gap-10 lg:gap-14">
            {VALUES.map((v) => (
              <div key={v.n}>
                <p className="font-mono text-[11px] text-[var(--muted)]">{v.n}</p>
                <h3 className="font-display mt-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30", fontSize: "clamp(24px, 2.4vw, 34px)" }}>{v.title}</h3>
                <p className="mt-3 text-[15px] text-[var(--muted)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <Link to="/contact" className="cursor-target btn btn-primary" data-cursor="hover">
              Work with us <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
