import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0b] border-t border-white/10 py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffb800] to-[#ff5e00] flex items-center justify-center">
                <span className="font-display italic text-black text-base leading-none mt-0.5">g</span>
              </div>
              <span className="font-sans font-medium">Game of Growth</span>
            </div>
            <p className="mt-4 max-w-md text-white/50 text-sm">A design-first creative studio for ambitious founders.</p>
            <p className="mt-8 font-display italic text-7xl md:text-9xl text-white/10 leading-none">gameofgrowth.</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Studio</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#work" className="hover:text-white">Work</a></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#process" className="hover:text-white">Process</a></li>
              <li><a href="#store" className="hover:text-white">Store</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Internal</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><Link to="/dashboard" className="hover:text-white">Founder Dashboard</Link></li>
              <li><a href="#contact" className="hover:text-white">Book a call</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>hello@gameofgrowth.studio</li>
              <li>Lisbon · NY · Remote</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} GAME OF GROWTH STUDIO</p>
          <p>BUILT WITH OBSESSION. SHIPPED WITH SPEED.</p>
        </div>
      </div>
    </footer>
  );
}
