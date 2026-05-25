import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Activity,
  Smartphone,
  Cpu,
  Layers,
  Stars,
  Play,
  CheckCircle2,
} from "lucide-react";

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const featureList = [
    {
      title: "AI Caption Generator",
      desc: "Create viral social captions for Instagram, LinkedIn, and X with advanced AI intelligence.",
      icon: Sparkles,
      color: "from-cyan-400 to-blue-500",
    },
    {
      title: "AI Blog Writer",
      desc: "Generate SEO-ready long-form articles with premium formatting and structure.",
      icon: Layers,
      color: "from-blue-500 to-violet-500",
    },
    {
      title: "AI Study Notes",
      desc: "Turn heavy topics into clean summaries, key points, and smart revision notes instantly.",
      icon: Cpu,
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  const stats = [
    "10K+ Generations",
    "99.9% AI Uptime",
    "Fast OpenRouter AI",
  ];

  return (
    <div className="min-h-screen bg-[#050816] overflow-hidden relative text-white">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* GRADIENT BLOBS */}
        <div className="absolute top-[-200px] left-[-120px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-200px] right-[-120px] w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full animate-pulse" />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      {/* HEADER */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">

            <Zap className="w-5 h-5 text-black fill-black" />

          </div>

          <div>

            <h1 className="text-xl font-black tracking-tight">
              Lumina AI
            </h1>

            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Future Workspace
            </p>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >

          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-300 hover:text-white transition-all"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>

        </motion.div>

      </header>

      {/* HERO */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-xl"
            >

              <Stars className="w-4 h-4 text-cyan-300 animate-pulse" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                AI Powered Productivity
              </span>

            </motion.div>

            {/* TITLE */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">

                Build Faster With

                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent mt-3">
                  Next-Gen AI Tools
                </span>

              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                Lumina AI combines blogging, captions,
                notes, and smart AI workflows into one
                futuristic workspace designed for creators,
                developers, and students.
              </p>

            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >

              <button
                onClick={() => navigate("/register")}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/20"
              >

                Start Creating

                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >

                <Play className="w-4 h-4" />

                Explore Platform

              </button>

            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 pt-4"
            >

              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >

                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />

                  {item}

                </div>
              ))}

            </motion.div>

          </div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
            }}
            className="relative"
          >

            {/* FLOATING GLASS PANEL */}
            <div className="relative backdrop-blur-2xl border border-white/10 bg-white/[0.04] rounded-[32px] p-8 shadow-2xl overflow-hidden">

              {/* TOP GLOW */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-3xl" />

              {/* PANEL CONTENT */}
              <div className="relative z-10 space-y-6">

                {/* SMALL TOP BAR */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-red-400" />

                    <div className="w-3 h-3 rounded-full bg-yellow-400" />

                    <div className="w-3 h-3 rounded-full bg-green-400" />

                  </div>

                  <span className="text-xs text-slate-500">
                    Lumina Dashboard
                  </span>

                </div>

                {/* MOCK AI OUTPUT */}
                <div className="space-y-4">

                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                    <p className="text-xs text-cyan-300 uppercase mb-2">
                      AI Caption
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      “Your future is created by what you
                      do today — not tomorrow. 🚀”
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                    <p className="text-xs text-violet-300 uppercase mb-2">
                      AI Blog
                    </p>

                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-slate-700 w-full" />
                      <div className="h-2 rounded-full bg-slate-700 w-4/5" />
                      <div className="h-2 rounded-full bg-slate-700 w-3/5" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                    <p className="text-xs text-blue-300 uppercase mb-2">
                      AI Notes
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300">
                        Quantum
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300">
                        AI
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-300">
                        Productivity
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

        {/* FEATURES */}
        <section className="mt-32">

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >

            <h2 className="text-4xl font-black">
              Powerful AI Features
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Everything you need to create faster,
              smarter, and more beautifully.
            </p>

          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {featureList.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.1,
                }}
                whileHover={{
                  y: -10,
                }}
                className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 group"
              >

                {/* HOVER GLOW */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.color} blur-3xl`}
                />

                <div className="relative z-10 space-y-6">

                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl`}
                  >

                    <feature.icon className="w-6 h-6 text-black" />

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        </section>

        {/* BOTTOM SECTION */}
        <section className="mt-32 text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >

            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Ready To Experience
              <span className="block bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                The Future Of AI?
              </span>
            </h2>

            <p className="text-slate-400 text-lg">
              Join creators using Lumina AI to generate
              captions, blogs, notes, and smart content
              faster than ever before.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-black text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-violet-500/20"
            >
              Launch Lumina AI
            </button>

          </motion.div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8 mt-24">

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">

          <p>
            © 2026 Lumina AI Suite. Crafted with futuristic design.
          </p>

          <div className="flex items-center gap-6">

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Docs
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Landing;