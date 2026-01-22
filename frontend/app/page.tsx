'use client';

import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';
import { ShieldCheck, Zap, Laptop, MapPin, Cpu, Check } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-hidden relative selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none" />

      {/* Hero Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-500/5 blur-[180px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 space-y-6">
          {/* Technical Status line */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[9px] font-mono tracking-[0.3em] text-cyan-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            System Status: Operational
          </div>

          <h1 className="text-5xl lg:text-[100px] font-bold tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            IDENTITY PURGED.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 drop-shadow-[0_10px_40px_rgba(0,242,255,0.2)]">
              METADATA ERASED.
            </span>
          </h1>

          <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg">
            Advanced AI-driven signature scrubbing for the privacy-conscious professional. Sanitize documents, images, and videos in milliseconds.
          </p>
        </div>

        <DragDrop />

        {/* Triple Stat Row */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <QuickStat label="Files Processed" value="25M+" color="cyan" />
          <QuickStat label="Metadata Purged" value="1.2TB" color="purple" />
          <QuickStat label="Security Rating" value="AAA+" color="emerald" />
        </div>

        {/* Deep Scrubbing Engine Section */}
        <div id="features" className="mt-48 space-y-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight uppercase italic mb-4">Deep Scrubbing Engine</h2>
            <p className="text-zinc-500 max-w-xl text-sm leading-relaxed">
              Our proprietary AI scans every byte to ensure your digital footprint is completely invisible to forensic tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EngineCard
              title="AI Signature Scrubbing"
              desc="Bypass AI-based fingerprinting with synthetic noise injection and neural pattern masking."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
              icon={<Cpu className="w-4 h-4 text-cyan-400" />}
            />
            <EngineCard
              title="Location Stripping"
              desc="Complete removal of GPS coordinates, altitude metadata, and cell tower triangulation data."
              image="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
              icon={<MapPin className="w-4 h-4 text-cyan-400" />}
            />
            <EngineCard
              title="Hardware De-identification"
              desc="Sanitize technical camera specs, serial numbers, and unique hardware identifiers from EXIF data."
              image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
              icon={<Laptop className="w-4 h-4 text-cyan-400" />}
            />
          </div>
        </div>

        {/* Tiers Section */}
        <div id="pricing" className="mt-48 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold tracking-tight uppercase italic">Choose Your Protection</h2>
            <p className="text-zinc-500 text-sm tracking-widest uppercase">Scale your privacy needs from single files to enterprise-grade pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TierCard
              title="GHOST"
              price="0"
              color="cyan"
              features={["5 Files per day", "Standard Metadata Stripping", "Web Interface Access"]}
            />
            <TierCard
              title="PHANTOM"
              price="19"
              color="cyan"
              featured={true}
              features={["Unlimited Processing", "Deep AI Signature Scrubbing", "Batch Upload Support", "Priority Infrastructure"]}
            />
            <TierCard
              title="SPECTRE"
              price="99"
              color="cyan"
              features={["Dedicated API Nodes", "Custom Scrubbing Models", "On-Premise Integration", "24/7 Forensic Support"]}
            />
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-xl text-white uppercase italic tracking-tighter">CleanMeta</span>
          </div>

          <div className="flex gap-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Bug Bounty</Link>
            <Link href="#" className="hover:text-white transition-colors">Status</Link>
          </div>

          <div className="text-[10px] font-mono text-zinc-700">
            &copy; {new Date().getFullYear()} CLEANMETA. ALL FOOTPRINTS ERASED.
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string, value: string, color: string }) {
  const colorMap: any = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500'
  };
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-lg backdrop-blur-sm group hover:border-white/10 transition-all">
      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-mono mb-2">{label}</p>
      <div className="text-4xl font-bold italic tracking-tighter mb-4">{value}</div>
      <div className={clsx("h-[2px] w-full bg-zinc-800 relative overflow-hidden")}>
        <div className={clsx("absolute inset-0 w-2/3 transition-all duration-1000", colorMap[color])} />
      </div>
    </div>
  );
}

function EngineCard({ title, desc, image, icon }: any) {
  return (
    <div className="group space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/5 group-hover:border-cyan-500/30 transition-all duration-700">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-4 left-4 p-2 bg-cyan-500/20 backdrop-blur-md rounded border border-cyan-500/40">
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold uppercase italic group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TierCard({ title, price, color, features, featured }: any) {
  return (
    <div className={clsx(
      "relative p-10 rounded-xl bg-zinc-900/30 border transition-all duration-700 flex flex-col h-full group",
      featured ? "border-cyan-400/50 shadow-[0_0_80px_rgba(0,242,255,0.05)] scale-105 z-20" : "border-white/5 hover:border-white/20"
    )}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 text-black text-[9px] font-bold uppercase tracking-widest rounded-full">
          Recommended
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold tracking-tight text-white mb-2 uppercase italic">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold italic tracking-tighter">${price}</span>
          <span className="text-zinc-600 font-mono text-[10px] uppercase">/mo</span>
        </div>
      </div>

      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors" />
            {f}
          </li>
        ))}
      </ul>

      <button className={clsx(
        "w-full py-4 rounded uppercase text-[10px] font-bold tracking-[0.3em] transition-all",
        featured
          ? "bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_30px_rgba(0,242,255,0.2)]"
          : "bg-zinc-800 text-zinc-400 border border-white/5 hover:border-white/20 hover:text-white"
      )}>
        {featured ? "Go Phantom" : "Initialize"}
      </button>
    </div>
  );
}
