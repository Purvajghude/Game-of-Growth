// Grid + Grain global background — lives behind every section, fixed to viewport.
// Cheap to render, sits at z-index 0 inside each section via the .bg-grid utility.
// This component is just a fixed-overlay alternate, when needed inline.
export default function GridGrain({ variant = "paper", className = "" }) {
  const isDark = variant === "dark";
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <div className={`absolute inset-0 ${isDark ? "bg-grid-dark" : "bg-grid"}`} />
      <div className={`absolute inset-0 grain ${isDark ? "grain-dark" : "grain-soft"}`} />
    </div>
  );
}
