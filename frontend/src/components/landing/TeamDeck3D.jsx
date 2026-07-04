// Team — a 3D circular deck. The four cards sit on a cylinder that rotates
// in real 3D. It auto-spins slowly, pauses and snaps to a card on hover,
// responds to drag with momentum, and to the arrows / a card click.
// Rotation is driven directly on the DOM via rAF (no per-frame React state).
// Reduced-motion + touch users get a clean responsive grid instead.
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TEAM } from "@/data/team";
import { LANDING } from "@/constants/testIds";
import { useReducedMotion } from "framer-motion";

const TONES = {
  paper: { bg: "#fbfaf6", ink: "var(--ink)", dim: "var(--muted)", accent: "var(--accent)", border: "var(--line-2)", chip: "var(--line-2)" },
  night: { bg: "var(--night)", ink: "var(--night-ink)", dim: "#bcb6aa", accent: "var(--gold)", border: "rgba(160,129,74,0.35)", chip: "rgba(236,232,222,0.25)" },
  soft: { bg: "var(--paper-2)", ink: "var(--ink)", dim: "var(--muted)", accent: "var(--accent)", border: "var(--line-2)", chip: "var(--line-2)" },
  ink: { bg: "var(--ink)", ink: "var(--paper)", dim: "rgba(245,243,238,0.65)", accent: "var(--gold)", border: "transparent", chip: "rgba(245,243,238,0.3)" },
};

function CardFace({ member, tone }) {
  const t = TONES[tone] ?? TONES.paper;
  return (
    <div
      className="w-full h-full rounded-[20px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden grain-soft"
      style={{ background: t.bg, color: t.ink, border: `1px solid ${t.border}`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9.5px] tracking-[0.3em] uppercase" style={{ color: t.accent }}>{member.name}</p>
          <div className="h-px w-12 mt-3" style={{ background: t.accent, opacity: 0.6 }} />
        </div>
        <span className="font-display italic text-xl leading-none select-none" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1", color: t.accent }}>g</span>
      </div>
      <div>
        <h3 className="font-display leading-[0.95]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30", fontSize: "clamp(30px, 3.4vw, 46px)", letterSpacing: "-0.02em" }}>
          {member.role}
        </h3>
        <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: t.dim, fontFamily: "var(--font-sans)" }}>{member.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {member.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full" style={{ border: `1px solid ${t.chip}`, color: t.dim }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeamDeck3D() {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [dims, setDims] = useState({ radius: 340, cardW: 300, cardH: 420 });

  // animation state kept in refs so the rAF loop never triggers React renders
  const rot = useRef(0);
  const mode = useRef("auto"); // auto | drag | settle
  const target = useRef(0);
  const vel = useRef(0);
  const drag = useRef({ startX: 0, startRot: 0, lastX: 0 });

  const n = TEAM.length;
  const step = 360 / n;

  useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? 1000;
      if (w < 640) setDims({ radius: 250, cardW: 230, cardH: 340 });
      else if (w < 1024) setDims({ radius: 320, cardW: 280, cardH: 400 });
      else setDims({ radius: 380, cardW: 320, cardH: 440 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf;
    const norm = (a) => { while (a > 180) a -= 360; while (a < -180) a += 360; return a; };

    const loop = () => {
      if (mode.current === "auto") {
        rot.current += 0.14;
      } else if (mode.current === "settle") {
        rot.current += (target.current - rot.current) * 0.12;
        if (Math.abs(target.current - rot.current) < 0.05) rot.current = target.current;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${dims.radius}px) rotateY(${rot.current}deg)`;
      }
      // depth shading per card + track the front card
      let frontIdx = 0, frontFacing = 999;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const facing = Math.abs(norm(i * step + rot.current));
        if (facing < frontFacing) { frontFacing = facing; frontIdx = i; }
        const k = Math.min(facing / 90, 1);
        el.style.opacity = `${1 - k * 0.72}`;
        el.style.filter = `brightness(${1 - k * 0.25})`;
        el.style.pointerEvents = facing < 45 ? "auto" : "none";
      });
      setActive((p) => (p === frontIdx ? p : frontIdx));

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce, dims.radius, step]);

  // pointer drag
  useEffect(() => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;

    const snapTarget = (extra = 0) => {
      const raw = rot.current + extra;
      target.current = Math.round(raw / step) * step;
      mode.current = "settle";
    };
    const down = (e) => {
      mode.current = "drag";
      drag.current = { startX: e.clientX, startRot: rot.current, lastX: e.clientX };
      vel.current = 0;
      stage.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (mode.current !== "drag") return;
      const dx = e.clientX - drag.current.startX;
      rot.current = drag.current.startRot + dx * 0.35;
      vel.current = (e.clientX - drag.current.lastX) * 0.35;
      drag.current.lastX = e.clientX;
    };
    const up = () => {
      if (mode.current !== "drag") return;
      snapTarget(vel.current * 6);
    };
    const enter = () => { if (mode.current === "auto") snapTarget(); };
    const leave = () => { if (mode.current !== "drag") mode.current = "auto"; };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("pointerenter", enter);
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
    };
  }, [reduce, step]);

  const goTo = (idx) => {
    // rotate the shortest way so card `idx` faces front (front when rot = -idx*step)
    let want = -idx * step;
    while (want - rot.current > 180) want -= 360;
    while (want - rot.current < -180) want += 360;
    target.current = want;
    mode.current = "settle";
  };
  const nudge = (dir) => goTo((active + dir + n) % n);

  // ---- Reduced-motion / no-JS-friendly fallback: honest grid ----
  if (reduce) {
    return (
      <section id="team" data-testid={LANDING.sectionTeam} className="relative bg-[var(--paper)] py-20 lg:py-32 grain-soft">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
          <p className="eyebrow">10 — The people behind it</p>
          <h2 className="headline mt-4" style={{ fontSize: "clamp(40px, 6vw, 96px)" }}>Four people. <em>Zero handoffs.</em></h2>
          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} style={{ height: 340 }}><CardFace member={m} tone={m.tone} /></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" data-testid={LANDING.sectionTeam} className="relative bg-[var(--paper)] py-20 lg:py-28 grain-soft overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="eyebrow">10 — The people behind it</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(40px, 6vw, 96px)" }}>Four people. <em>Zero handoffs.</em></h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => nudge(-1)} className="cursor-target w-11 h-11 rounded-full border border-[var(--line-2)] flex items-center justify-center hover:bg-[var(--paper-2)] transition" data-cursor="hover" aria-label="Previous member">
              <ChevronLeft className="w-5 h-5 text-[var(--ink)]" />
            </button>
            <button onClick={() => nudge(1)} className="cursor-target w-11 h-11 rounded-full border border-[var(--line-2)] flex items-center justify-center hover:bg-[var(--paper-2)] transition" data-cursor="hover" aria-label="Next member">
              <ChevronRight className="w-5 h-5 text-[var(--ink)]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D stage */}
      <div
        ref={stageRef}
        className="relative mt-10 select-none touch-none"
        style={{ height: dims.cardH + 90, perspective: "1600px", cursor: "grab" }}
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(-${dims.radius}px)`, width: 0, height: 0 }}
        >
          {TEAM.map((m, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => goTo(i)}
              className="cursor-target absolute"
              data-cursor="hover"
              style={{
                width: dims.cardW,
                height: dims.cardH,
                left: -dims.cardW / 2,
                top: -dims.cardH / 2,
                transform: `rotateY(${i * step}deg) translateZ(${dims.radius}px)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CardFace member={m} tone={m.tone} />
            </div>
          ))}
        </div>

        {/* soft floor shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ bottom: 18, width: dims.cardW * 1.2, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(20,19,15,0.18), transparent 70%)", filter: "blur(6px)" }}
        />
      </div>

      {/* dots */}
      <div className="relative mt-6 flex items-center justify-center gap-2">
        {TEAM.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Show ${TEAM[i].role}`}
            className="cursor-target rounded-full transition-all"
            data-cursor="hover"
            style={{
              width: active === i ? 26 : 8,
              height: 8,
              background: active === i ? "var(--ink)" : "var(--line-2)",
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ))}
      </div>
      <p className="relative mt-5 text-center font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
        Drag to spin · hover to hold
      </p>
    </section>
  );
}
