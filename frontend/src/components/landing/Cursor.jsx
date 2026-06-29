import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf;

    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const isInteractive = t.closest("a, button, [data-cursor='hover'], input, textarea, select, [role='button']");
      setHover(!!isInteractive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={`gog-cursor-ring ${hover ? "hovering" : ""}`} />
      <div ref={dotRef} className={`gog-cursor-dot ${hover ? "hovering" : ""}`} />
    </>
  );
}
