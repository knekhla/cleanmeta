import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';

export const metadata: Metadata = {
  title: 'CleanMeta - Futuristic Privacy Shield',
  description: 'AI-Powered Metadata Neutralizer. Secure your digital footprint.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none" />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-20 space-y-6">


          <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            METADATA. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              NEUTRALIZED.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Advanced privacy shield for the AI era. We strip <span className="text-white font-medium">GPS coordinates</span>, <span className="text-white font-medium">device fingerprints</span>, and <span className="text-cyan-400 font-medium">Generative AI signatures</span> from your digital assets.
          </p>
        </div>

        <DragDrop />

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="EPHEMERAL PROCESSING"
            desc="Zero persistence. Data exists only in volatile memory during the cleansing process."
            icon="🛡️"
          />
          <Feature
            title="DEEP AI SCRUBBING"
            desc="Detects and eliminates hidden steganographic layers from Stable Diffusion & Midjourney."
            icon="✨"
          />
          <Feature
            title="QUANTUM BATCH"
            desc="High-throughput parallel processing architecture for massive dataset sanitization."
            icon="⚡"
          />
        </div>
      </main>

      <footer className="py-12 text-center text-slate-600 text-xs font-mono tracking-widest border-t border-white/5 bg-black/50 backdrop-blur-sm">
        SECURE_CONNECTION_ESTABLISHED &copy; {new Date().getFullYear()} CLEANMETA
      </footer>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:bg-white/10 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/0 group-hover:to-cyan-500/5 rounded-3xl transition-all duration-500" />
      <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 origin-left">{icon}</div>
      <h3 className="font-bold text-lg text-white mb-2 font-mono tracking-wide group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
