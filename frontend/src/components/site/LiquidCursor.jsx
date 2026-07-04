// Liquid-glass cursor — built to the ReactBits liquid-glass cursor pattern
// (their components are copy-paste code; the ReactBits MCP wasn't available
// this session, so this is a hand-authored equivalent).
// A refractive glass blob trails the pointer with spring easing; a precise
// dot rides the exact position; both grow/shift when over interactive targets.
// Desktop fine-pointer only. Touch + reduced-motion fall back to the OS cursor.
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"], .cursor-target';

export default function LiquidCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const blobX = useSpring(x, { stiffness: 200, damping: 24, mass: 0.7 });
  const blobY = useSpring(y, { stiffness: 200, damping: 24, mass: 0.7 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 50 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 50 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) {
      document.body.style.cursor = "auto";
      return;
    }
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) =>
      setHovering(!!(e.target.closest && e.target.closest(INTERACTIVE)));
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  const blobScale = down ? 0.82 : hovering ? 2.05 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* refractive glass blob */}
      <motion.div
        style={{ x: blobX, y: blobY, marginLeft: -21, marginTop: -21 }}
        animate={{ scale: blobScale }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute top-0 left-0 w-[42px] h-[42px] rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0.06) 60%)",
            border: "1px solid rgba(20,19,15,0.14)",
            backdropFilter: "blur(4px) saturate(150%) brightness(1.04)",
            WebkitBackdropFilter: "blur(4px) saturate(150%) brightness(1.04)",
            boxShadow:
              "inset 0 1px 3px rgba(255,255,255,0.6), inset 0 -2px 6px rgba(20,19,15,0.10), 0 6px 20px -6px rgba(20,19,15,0.25)",
          }}
        />
      </motion.div>

      {/* precise dot */}
      <motion.div
        style={{ x: dotX, y: dotY, marginLeft: -3, marginTop: -3 }}
        animate={{ opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-0 left-0 w-[6px] h-[6px] rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "var(--ink)", mixBlendMode: "difference" }}
        />
      </motion.div>
    </div>
  );
}
