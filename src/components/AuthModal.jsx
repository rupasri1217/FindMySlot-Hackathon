import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bike, 
  Car, 
  Building2, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Lock,
  User,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialRole = 'driver' }) {
  const { login } = useAuth();
  const [role, setRole] = useState(initialRole); // 'driver' | 'operator'
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    const route = login(role, { name: role === 'driver' ? 'Rohan Sharma' : 'Connaught Place Gate Admin' });
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setOtpStep(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode) return;
    const route = login(role, { 
      phone: `+91 ${phoneNumber}`,
      name: role === 'driver' ? 'Motorist Commuter' : 'Lot Manager' 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
              <Shield size={28} />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-white">
              Welcome to FindMySlot
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Select your role and authenticate to continue
            </p>
          </div>

          {/* ROLE SELECTOR TABS */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
                role === 'driver' 
                  ? 'bg-indigo-600 text-white shadow-glow-indigo' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass size={16} />
              <span>I am a Commuter / Driver</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('operator')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
                role === 'operator' 
                  ? 'bg-emerald-600 text-white shadow-glow-emerald' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={16} />
              <span>I am a Lot Operator</span>
            </button>
          </div>

          {/* AUTHENTICATION OPTIONS */}
          <div className="space-y-4">
            
            {/* Option A: Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-3 shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.2.0 10.04.0 12s.46 3.8 1.28 5.42l4-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase">Or Login with Mobile</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Option B: Indian +91 Phone OTP */}
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-medium text-sm rounded-2xl pl-16 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    maxLength={10}
                  />
                </div>
                <button
                  type="submit"
                  disabled={phoneNumber.length < 10}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-glow-indigo"
                >
                  Send OTP Code <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="text-xs text-emerald-400 font-semibold text-center mb-1">
                  OTP sent to +91 {phoneNumber}
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 4-digit OTP (e.g. 1234)"
                  className="w-full bg-slate-900 border border-slate-700 text-white tracking-widest text-center font-bold text-base rounded-2xl px-4 py-3.5 focus:outline-none focus:border-emerald-500"
                  maxLength={4}
                />
                <button
                  type="submit"
                  disabled={!otpCode}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-glow-emerald"
                >
                  Verify & Enter Dashboard <CheckCircle2 size={16} />
                </button>
              </form>
            )}

          </div>

          {/* Redirection Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
            Redirecting to: <span className="font-bold text-white">{role === 'driver' ? '/driver/dashboard' : '/operator/dashboard'}</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
