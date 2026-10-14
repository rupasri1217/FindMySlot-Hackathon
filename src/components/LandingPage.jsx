import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bike, 
  Car, 
  CreditCard, 
  Compass, 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Building2,
  Navigation,
  Sun,
  Moon,
  Camera,
  QrCode
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, isDarkMode, onToggleTheme }) {
  const [activeStep, setActiveStep] = useState(0);

  // 6 Interactive 3D Flashcards Data
  const flashcards = [
    {
      id: 1,
      title: 'Destination-First Engine',
      emoji: '🗺️',
      badge: 'Mental Model Shift',
      desc: "We ask where you're going, not where you want to park. Input your final mall or metro destination and we handle the rest.",
      color: 'border-indigo-500/30 bg-indigo-500/5',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    },
    {
      id: 2,
      title: 'First-Class 2-Wheeler Support',
      emoji: '🏍️',
      badge: '2W Priority Equality',
      desc: 'Equal priority & dedicated slot algorithms for bikes, scooters, and electric two-wheelers with fair pricing.',
      color: 'border-emerald-500/30 bg-emerald-500/5',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 3,
      title: 'Indoor Bay Navigation',
      emoji: '🏢',
      badge: 'Exact Slot Routing',
      desc: 'Turn-by-turn guidance right down to your exact slot (e.g., Slot 2W-A3) via indoor vector blueprint layouts.',
      color: 'border-blue-500/30 bg-blue-500/5',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      id: 4,
      title: 'Last-Mile Assistant',
      emoji: '🛵',
      badge: 'Uber & Rapido Bridge',
      desc: 'Integrated Rapido bike taxi, Uber Auto, & walking routes automatically recommended if parking is >200m away.',
      color: 'border-purple-500/30 bg-purple-500/5',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    {
      id: 5,
      title: 'Instant UPI & QR Pass',
      emoji: '💳',
      badge: 'One-Tap Checkout',
      desc: 'One-tap payment via Google Pay, PhonePe, or Paytm generating an offline cryptographic QR entry pass.',
      color: 'border-amber-500/30 bg-amber-500/5',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 6,
      title: 'OCR Gate Validation',
      emoji: '📷',
      badge: 'Zero-Wait Entry',
      desc: 'Automated license plate recognition at parking ramp barriers for seamless automatic validation.',
      color: 'border-teal-500/30 bg-teal-500/5',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* 1. LIGHT/DARK TOP NAVBAR */}
      <header className="sticky top-0 z-40 glass-panel-light dark:glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            P
          </div>
          <div>
            <span className="font-heading font-black text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              FindMySlot
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-2 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              India Mobility
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-700"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          <button 
            onClick={() => onOpenAuth('driver')}
            className="hidden sm:flex text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            Sign In
          </button>
          
          <button 
            onClick={() => onOpenAuth('driver')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            Find Parking Now <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        
        {/* Hero Pill */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6"
        >
          <Zap size={14} className="text-emerald-500 animate-pulse" />
          <span>India's 1st Destination-Centric Mobility Platform</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading font-black text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-slate-900 dark:text-white max-w-5xl"
        >
          Park Smart. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Reach Smarter.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed"
        >
          Stop searching for parking spaces. Search your final destination, lock your 2W/4W slot bay, and complete your journey with Rapido or Uber.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={() => onOpenAuth('driver')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/25 transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Compass size={20} />
            Find Parking Now
          </button>

          <button 
            onClick={() => onOpenAuth('operator')}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 font-bold text-base px-8 py-4 rounded-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Building2 size={20} />
            Partner as Lot Operator
          </button>
        </motion.div>

      </section>

      {/* 3. WHY FINDMYSLOT SUPERIORITY: 6 INTERACTIVE 3D FLASHCARDS */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            Platform Superiority
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Why FindMySlot Superiority
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Hover over each elevated 3D card to discover why FindMySlot transforms urban mobility.
          </p>
        </div>

        {/* 6 FLASHCARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flashcard-3d bg-white dark:bg-slate-900 border ${card.color} p-7 rounded-3xl shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start">
                <span className="text-4xl">{card.emoji}</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1">
                <span>Explore Feature</span> <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            © 2026 FindMySlot Smart Urban Mobility India. All rights reserved.
          </div>
          <div className="flex gap-6 font-semibold text-slate-600 dark:text-slate-400">
            <button onClick={() => onOpenAuth('driver')} className="hover:text-indigo-600 dark:hover:text-white">Commuter Hub</button>
            <button onClick={() => onOpenAuth('operator')} className="hover:text-emerald-600 dark:hover:text-white">Operator Hub</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
