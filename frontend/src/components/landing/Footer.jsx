import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--paper-2)] border-t border-[var(--line)] py-16 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
                <span className="font-display italic text-[var(--paper)] text-base leading-none mt-[1px]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>g</span>
              </div>
              <span className="font-sans font-medium text-[var(--ink)]">Game of Growth</span>
            </div>
            <p className="mt-4 max-w-md text-[var(--muted)] text-[15px]">A design-first creative studio for ambitious founders.</p>
            <p className="mt-8 font-display italic text-7xl md:text-9xl text-[var(--ink)]/15 leading-none" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>gameofgrowth.</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Studio</p>
            <ul className="mt-4 space-y-2 text-[15px] text-[var(--ink-2)]">
              <li><a href="#work" className="hover:text-[var(--ink)] transition">Work</a></li>
              <li><a href="#services" className="hover:text-[var(--ink)] transition">Services</a></li>
              <li><a href="#process" className="hover:text-[var(--ink)] transition">Process</a></li>
              <li><a href="#store" className="hover:text-[var(--ink)] transition">Store</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Internal</p>
            <ul className="mt-4 space-y-2 text-[15px] text-[var(--ink-2)]">
              <li><Link to="/dashboard" className="hover:text-[var(--ink)] transition">Founder Dashboard</Link></li>
              <li><a href="#contact" className="hover:text-[var(--ink)] transition">Book a call</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Contact</p>
            <ul className="mt-4 space-y-2 text-[15px] text-[var(--ink-2)]">
              <li>hello@gameofgrowth.studio</li>
              <li>Lisbon · NY · Remote</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px] text-[var(--muted)] uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Game of Growth Studio</p>
          <p>Built with obsession · Shipped with speed</p>
        </div>
      </div>
    </footer>
  );
}
