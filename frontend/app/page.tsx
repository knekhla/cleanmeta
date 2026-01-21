import Navbar from '@/components/Navbar';
import DragDrop from '@/components/DragDrop';

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
            Protect your privacy before sharing. Remove location, device info, and hidden tags from your photos instantly.
          </p>
        </div>

        <DragDrop />

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <Feature
            title="Privacy First"
            desc="No permanent storage. Files are processed in memory and deleted instantly."
          />
          <Feature
            title="Deep Cleaning"
            desc="We don't just delete tags; we scrub the file structure to remove hidden data."
          />
          <Feature
            title="Batch Ready"
            desc="Process hundreds of photos at once via our powerful API."
          />
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-gray-100">
        &copy; {new Date().getFullYear()} CleanMeta. Secure Metadata Scrubber.
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-3 p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
