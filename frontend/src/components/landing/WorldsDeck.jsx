// Apple-demo scroll choreography for the six "design world" sections:
// as each world finishes, it pins in place and the next world slides over
// it like a card being dealt onto a deck, while the outgoing one settles
// back (slight scale-down + dim). No extra scroll distance is added; the
// travel the page already needs becomes the transition.
// Desktop + full-motion only; mobile and reduced-motion get normal flow.
import { Children, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

export default function WorldsDeck({ children }) {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray(":scope > .world-panel", root.current);
      const created = [];

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return; // last world scrolls out normally
        const next = panels[i + 1];

        // hold the finished world in place while the next covers it
        created.push(
          ScrollTrigger.create({
            trigger: panel,
            start: "bottom bottom",
            end: () => `+=${window.innerHeight}`,
            pin: true,
            pinSpacing: false,
          })
        );

        // the covered world settles back as the next slides over.
        // NOTE: animate the panel's child, not the pinned panel itself;
        // the pin's inline style management overwrites tweens on the same node.
        const inner = panel.firstElementChild;
        const tween = gsap.fromTo(
          inner,
          { scale: 1, opacity: 1 },
          {
            scale: 0.965,
            opacity: 0.72,
            ease: "none",
            transformOrigin: "center bottom",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
        created.push(tween.scrollTrigger);
      });

      return () => created.forEach((t) => t && t.kill());
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      {Children.map(children, (child, i) => (
        <div className="world-panel relative" style={{ zIndex: i + 1 }}>
          {child}
        </div>
      ))}
    </div>
  );
}
