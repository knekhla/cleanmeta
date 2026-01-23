'use client';

import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';
import { ShieldCheck, Zap, Laptop, MapPin, Cpu, Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-hidden relative selection:bg-lime-400/30 selection:text-black">
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none text-lime-400" />

      {/* Hero Glow - Toxic Green */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-lime-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-24 space-y-8">
          {/* Technical Status line - Brutalist */}
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-lime-400/10 border border-lime-400/30 text-[10px] font-mono tracking-[0.2em] text-lime-400 uppercase">
            <span className="w-2 h-2 bg-lime-400 animate-pulse" />
            Sys_Status: ONLINE
          </div>

          <h1 className="text-6xl lg:text-[110px] font-bold tracking-[-0.05em] leading-[0.85] text-white uppercase italic mix-blend-color-dodge">
            DATA HAZARD<br />
            <span className="text-lime-400 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]">
              NEUTRALIZED
            </span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed font-mono text-xs uppercase tracking-widest border-l-2 border-lime-400/50 pl-6 text-left">
            Forensic-grade scrubbing for digital assets. <br />
            Eliminate EXIF, XMP, and IPMTC tracers instantly.
          </p>
        </div>

        <DragDrop />

        {/* Triple Stat Row - Industrial Style */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStat label="Processed Assets" value="25M+" color="lime" />
          <QuickStat label="Data Incinerated" value="1.2TB" color="orange" />
          <QuickStat label="Clearance Level" value="AAA+" color="lime" />
        </div>

        {/* Deep Scrubbing Engine Section */}
        <div id="features" className="mt-48 space-y-12">
          <div className="border-b border-white/10 pb-8 flex justify-between items-end">
            <h2 className="text-4xl font-bold tracking-tight uppercase italic text-lime-400">Deep Cleaning Protocols</h2>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              V.3.1.0 // ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EngineCard
              title="Pattern Noise Injection"
              desc="Destroys AI-fingerprinting via stochastic noise overlays."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
              icon={<Cpu className="w-5 h-5 text-black" />}
            />
            <EngineCard
              title="Geospatial Wipe"
              desc="Zero-fill coordinates for absolute physical untraceability."
              image="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
              icon={<MapPin className="w-5 h-5 text-black" />}
            />
            <EngineCard
              title="Hardware Masking"
              desc="Obfuscates sensor ID and serial manufacturing data."
              image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
              icon={<Laptop className="w-5 h-5 text-black" />}
            />
          </div>
        </div>

        {/* Tiers Section - Toxic Data Style */}
        <div id="pricing" className="mt-48 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold tracking-tight uppercase italic">Access Levels</h2>
            <div className="w-24 h-1 bg-lime-400 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TierCard
              title="GHOST"
              price="0"
              features={["5 Daily Scrubs", "Basic Metadata Wipe", "Public Queue"]}
            />
            <TierCard
              title="SPECTRE"
              price="19"
              featured={true}
              features={["Unlimited Scans", "AI De-Identification", "Priority Processing", "API Access"]}
            />
            <TierCard
              title="PHANTOM"
              price="99"
              features={["Dedicated Node", "Custom Patterns", "SSO Integration", "SLA: 99.9%"]}
            />
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black mt-32">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="bg-lime-400 p-1">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white uppercase italic tracking-tighter">CleanMeta</span>
          </div>

          <div className="flex gap-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <Link href="#" className="hover:text-lime-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-lime-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-lime-400 transition-colors">Status</Link>
          </div>

          <div className="text-[10px] font-mono text-zinc-700">
            SYSTEM_ID: CM_PROD_01
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string, value: string, color: string }) {
  const isLime = color === 'lime';
  const isOrange = color === 'orange';

  return (
    <div className={clsx(
      "bg-[#0A0A0A] border p-6 transition-all hover:bg-white/5",
      isLime ? "border-lime-400/20 hover:border-lime-400" : "border-orange-500/20 hover:border-orange-500"
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono">{label}</p>
        {isLime ? <Check className="w-3 h-3 text-lime-400" /> : <AlertTriangle className="w-3 h-3 text-orange-500" />}
      </div>
      <div className={clsx("text-5xl font-bold italic tracking-tighter", isLime ? "text-lime-400" : "text-orange-500")}>{value}</div>
    </div>
  );
}

function EngineCard({ title, desc, image, icon }: any) {
  return (
    <div className="group relative border border-white/10 bg-black hover:border-lime-400 transition-colors duration-300">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-lime-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 p-3 bg-lime-400">
          {icon}
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-lg font-bold uppercase italic group-hover:text-lime-400 transition-colors">{title}</h3>
        <p className="text-zinc-500 text-xs font-mono leading-relaxed uppercase">{desc}</p>
      </div>
    </div>
  );
}

function TierCard({ title, price, features, featured }: any) {
  return (
    <div className={clsx(
      "relative p-8 border flex flex-col h-full group bg-black transition-all duration-300",
      featured
        ? "border-lime-400 shadow-[0_0_0_1px_rgba(204,255,0,0.5)] z-20 scale-105"
        : "border-white/10 hover:border-white/30"
    )}>
      {featured && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-lime-400 text-black text-[9px] font-bold uppercase tracking-widest font-mono">
          Rec_01
        </div>
      )}

      <div className="mb-8 space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-white uppercase italic">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className={clsx("text-6xl font-bold italic tracking-tighter", featured ? "text-lime-400" : "text-white")}>${price}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono uppercase">
            <div className={clsx("w-1 h-1", featured ? "bg-lime-400" : "bg-zinc-600")} />
            {f}
          </li>
        ))}
      </ul>

      <button className={clsx(
        "w-full py-4 uppercase text-[10px] font-bold tracking-[0.2em] transition-all border",
        featured
          ? "bg-lime-400 text-black border-lime-400 hover:bg-lime-300"
          : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white hover:text-black"
      )}>
        {featured ? "Engage" : "Init"}
      </button>
    </div>
  );
}
