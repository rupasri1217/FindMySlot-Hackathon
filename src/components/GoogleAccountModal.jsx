import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bike, 
  Car, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  Shield, 
  ChevronRight,
  Compass,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GoogleAccountModal({ isOpen, onClose, initialRole = 'driver' }) {
  const { login } = useAuth();
  const [step, setStep] = useState('account_chooser'); // 'account_chooser' | 'profile_setup'
  const [role, setRole] = useState(initialRole); // 'driver' | 'operator'
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Form states for profile setup
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [vehicleType, setVehicleType] = useState('2W');
  const [vehicleReg, setVehicleReg] = useState('KA-03-HL-4821');

  if (!isOpen) return null;

  const mockGoogleAccounts = [
    {
      id: 'acct-1',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@gmail.com',
      avatar: 'R',
      bgColor: 'bg-indigo-600'
    },
    {
      id: 'acct-2',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      avatar: 'P',
      bgColor: 'bg-emerald-600'
    }
  ];

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setFullName(account.name);
    setStep('profile_setup');
  };

  const handleCompleteSetup = (e) => {
    e.preventDefault();
    const route = login(role, {
      name: fullName,
      phone: `+91 ${phone}`,
      vehicleNumber: vehicleReg,
      vehicleType: vehicleType
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>

          {/* STEP 1: GOOGLE ACCOUNT CHOOSER */}
          {step === 'account_chooser' && (
            <div className="space-y-6">
              
              {/* Google Brand Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-1">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.2.0 10.04.0 12s.46 3.8 1.28 5.42l4-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <h3 className="font-heading font-extrabold text-xl">Sign in with Google</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose an account to continue to <strong>FindMySlot</strong></p>
              </div>

              {/* ROLE SELECTION TABS BEFORE GOOGLE LOGIN */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    role === 'driver' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Compass size={14} />
                  <span>Commuter / Driver</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('operator')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    role === 'operator' 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 size={14} />
                  <span>Lot Operator</span>
                </button>
              </div>

              {/* ACCOUNT CHOOSER LIST */}
              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                {mockGoogleAccounts.map((account) => (
                  <div
                    key={account.id}
                    onClick={() => handleSelectAccount(account)}
                    className="pt-2 first:pt-0 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${account.bgColor} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
                        {account.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{account.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{account.email}</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                ))}

                <div 
                  onClick={() => handleSelectAccount({ name: 'New Motorist', email: 'user@gmail.com', avatar: 'U', bgColor: 'bg-indigo-600' })}
                  className="pt-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center gap-3 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                >
                  <UserPlus size={18} />
                  <span>Use another Google account</span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: PROFILE & VEHICLE SETUP */}
          {step === 'profile_setup' && (
            <form onSubmit={handleCompleteSetup} className="space-y-4">
              
              <div className="text-center space-y-1">
                <div className="inline-flex p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Shield size={24} />
                </div>
                <h3 className="font-heading font-extrabold text-xl">Motorist Profile Setup</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Register your vehicle plate for automated OCR gate reading</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile (+91 Indian format)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-400">🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl pl-16 pr-3.5 py-3 focus:outline-none focus:border-indigo-500"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* VEHICLE TYPE SELECTOR PILLS */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Vehicle Type</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleType('2W')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${vehicleType === '2W' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <Bike size={16} />
                    <span>Scooter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('2W')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${vehicleType === '2W' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <Bike size={16} />
                    <span>Bike</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('4W')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${vehicleType === '4W' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <Car size={16} />
                    <span>Car</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('4W')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${vehicleType === '4W' ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <Zap size={16} />
                    <span>EV</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  placeholder="e.g. KA-03-HL-4821"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm rounded-xl px-3.5 py-3 uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 mt-2"
              >
                Complete Registration & Enter {role === 'driver' ? 'Commuter Hub' : 'Operator Hub'} <ArrowRight size={16} />
              </button>

            </form>
          )}

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
