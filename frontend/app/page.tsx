import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';

export const metadata: Metadata = {
  title: 'CleanMeta - Remove Image Metadata & AI Prompts',
  description: 'Privacy-first image metadata remover. Strip EXIF, GPS, and AI prompts (Stable Diffusion, Midjourney) instantly. No permanent storage.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Metadata. <span className="text-blue-600">Gone.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Protect your privacy before sharing. Remove location, device info, and <span className="text-slate-900 font-semibold">AI prompts (Stable Diffusion, Midjourney)</span> from your photos instantly.
          </p>
        </div>

        <DragDrop />

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
          <Feature
            title="Privacy First"
            desc="No permanent storage. Files are processed in memory and deleted instantly after cleaning."
            icon="🛡️"
          />
          <Feature
            title="Deep AI Scrubbing"
            desc="We specifically target and remove hidden PNG chunks containing AI generation parameters (Stable Diffusion, Midjourney, DALL-E)."
            icon="✨"
          />
          <Feature
            title="Batch Ready"
            desc="Need to clean a whole dataset? Our robust API handles batch processing seamlessly."
            icon="⚡"
          />
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-gray-100 bg-white/50">
        &copy; {new Date().getFullYear()} CleanMeta. Secure Metadata Scrubber.
      </footer>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="space-y-4 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
