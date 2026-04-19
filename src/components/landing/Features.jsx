import { motion } from 'framer-motion';
import { MousePointer2, Zap, Volume2, Hand } from 'lucide-react';

const features = [
  {
    icon: <Hand className="text-slate-900" />,
    title: "Real-time AI tracking",
    description: "Sub-millisecond hand landmark detection powered by MediaPipe and TensorFlow.js."
  },
  {
    icon: <MousePointer2 className="text-slate-600" />,
    title: "Zero-touch Interaction",
    description: "Play naturally which spatial depth sensing. No physical hardware required."
  },
  {
    icon: <Volume2 className="text-slate-500" />,
    title: "Studio-quality Sound",
    description: "High-fidelity Salamander Grand Piano samples and professional synth engines."
  },
  {
    icon: <Zap className="text-slate-400" />,
    title: "Multi-hand Chords",
    description: "Supports up to 10-finger detection for complete musical expression."
  }
];

export default function Features() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Elevated Tech Stack</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Combining state-of-the-art computer vision with low-latency audio processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-550 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
