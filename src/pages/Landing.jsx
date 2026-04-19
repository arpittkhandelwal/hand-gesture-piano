import React from 'react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-white">
      <Hero onStart={onStart} />
      <Features />
      
      {/* Testimonials (Fake but realistic) */}
      <section className="py-24 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The latency is non-existent. It feels like magic to play chords in the air and hear studio-quality sound instantly.",
                author: "Sarah J., Producer"
              },
              {
                text: "AirPiano AI completely changed how I think about digital instruments. The UI is breathtakingly clean.",
                author: "Marcus K., Designer"
              },
              {
                text: "Finally, a gesture-based tool that isn't just a gimmick. This is a real instrument.",
                author: "Elena V., Pianist"
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <p className="text-slate-600 mb-6 italic">"{t.text}"</p>
                <p className="font-bold text-slate-900">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2026 AirPiano AI. Crafted for the future of music.</p>
      </footer>
    </div>
  );
}
