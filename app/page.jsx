'use client';

import { motion } from 'framer-motion';

export default function Home() {
  const techStack = [
    { name: 'HTML5', category: 'Markup' },
    { name: 'CSS3', category: 'Styling' },
    { name: 'TailwindCSS', category: 'Utility CSS' },
    { name: 'JavaScript', category: 'Core' },
    { name: 'React', category: 'UI Library' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'Bootstrap', category: 'CSS System' },
    { name: 'Framer Motion', category: 'Animation Engine' },
  ];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 tracking-wide"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Only UI No UX Max Pro Ultra Ready
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-4 leading-tight"
        >
          Frontend UI Workspace
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10"
        >
          Zero backend overhead. Pure high-fidelity UI design, component systems, and fluid Framer Motion animations configured for fast Vercel deployment.
        </motion.p>

        {/* Tech Stack Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full mb-10"
        >
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left flex flex-col justify-between"
            >
              <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                {tech.category}
              </div>
              <div className="text-base font-bold text-slate-100">
                {tech.name}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full p-6 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/90 border border-indigo-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-200">
              Antigravity UI Skills Active
            </span>
            <span className="text-xs text-slate-400">
              Installed in <code className="text-indigo-300">.agents/skills/</code> • 79 Styles, 192 Palettes, Framer Motion
            </span>
          </div>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Setup Complete
          </span>
        </motion.div>
      </div>
    </main>
  );
}
