import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Grid, 
  DollarSign, 
  Camera, 
  TrendingUp, 
  Users, 
  Layers, 
  Bell, 
  RefreshCw, 
  LogOut, 
  Sun, 
  Moon,
  Building2,
  Info
} from 'lucide-react';
import { gateOcrLogs } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function OperatorDashboard({ isDarkMode, onToggleTheme }) {
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.2);
  const [ocrFeed, setOcrFeed] = useState(gateOcrLogs);

  const [slotsState, setSlotsState] = useState([
    { id: '2W-A1', status: 'available', vehicle: '' },
    { id: '2W-A2', status: 'occupied', vehicle: 'KA-03-HL-4821' },
    { id: '2W-A3', status: 'available', vehicle: '' },
    { id: '2W-A4', status: 'reserved', vehicle: 'DL-3C-BY-9011' },
    { id: '4W-B1', status: 'occupied', vehicle: 'MH-02-CD-5421' },
    { id: '4W-B2', status: 'available', vehicle: '' },
    { id: '4W-B3', status: 'blocked', vehicle: 'Maintenance' },
    { id: '4W-B4', status: 'occupied', vehicle: 'TN-09-AX-7712' }
  ]);

  const handleToggleBlockSlot = (slotId) => {
    setSlotsState(prev => prev.map(s => {
      if (s.id === slotId) {
        const nextStatus = s.status === 'blocked' ? 'available' : 'blocked';
        return { ...s, status: nextStatus, vehicle: nextStatus === 'blocked' ? 'Blocked by Operator' : '' };
      }
      return s;
    }));
  };

  const handleFreeSlot = (slotId) => {
    setSlotsState(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, status: 'available', vehicle: '' };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP OPERATOR HEADER BAR */}
      <header className="h-16 glass-panel-light dark:glass-panel border-b border-slate-200 dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            O
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight">FindMySlot</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-2 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Operator Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-700"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              OP
            </div>
            <div className="text-xs">
              <div className="font-bold">Connaught Place Lot Owner</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">License #DEL-9812</div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition border border-slate-200 dark:border-slate-800"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* OPERATOR WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 flex-shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase px-3 py-2">Management Console</div>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Analytics Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('control')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'control' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Grid size={18} />
            <span>Slot Control Room</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'revenue' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign size={18} />
            <span>Dynamic Revenue Adjuster</span>
          </button>

          <button
            onClick={() => setActiveTab('gate')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'gate' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Camera size={18} />
            <span>Gate OCR Scanner Log</span>
          </button>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl">Analytics Overview</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time stats for Connaught Place Smart Hub</p>
              </div>

              {/* Metric Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold">OCCUPANCY RATE</span>
                    <Layers size={18} className="text-emerald-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-heading font-black text-3xl">84%</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">High Demand</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[84%]" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold">TODAY'S REVENUE</span>
                    <DollarSign size={18} className="text-indigo-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-heading font-black text-3xl">₹14,850</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+18% MoM</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">Surge multiplier: {surgeMultiplier}x</div>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold">ACTIVE 2W BAYS</span>
                    <Users size={18} className="text-amber-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-heading font-black text-3xl">42 / 50</span>
                    <span className="text-xs font-bold text-slate-400">84%</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">12 EV chargers active</div>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold">OCR GATE READS</span>
                    <Camera size={18} className="text-purple-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-heading font-black text-3xl">128</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Match</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">Auto-validated via Vahan</div>
                </div>

              </div>

              {/* Peak Bar Chart & Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-base">Peak Hour Occupancy Bar Chart</h3>
                  <div className="h-48 flex items-end justify-between pt-6 border-b border-slate-100 dark:border-slate-800 px-2">
                    {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time, idx) => {
                      const heights = [35, 60, 85, 90, 75, 88, 50];
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                          <div 
                            style={{ height: `${heights[idx]}%` }}
                            className={`w-8 rounded-t-lg transition-all ${heights[idx] >= 80 ? 'bg-emerald-500 shadow-md' : 'bg-indigo-600'}`}
                          />
                          <span className="text-[10px] text-slate-400">{time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
                  <h3 className="font-heading font-bold text-base mb-4">Gate Operations Stream</h3>
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-56">
                    {ocrFeed.map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-extrabold text-emerald-600 dark:text-emerald-400">{log.plate}</div>
                          <div className="text-[10px] text-slate-500">{log.action} • Slot {log.slot}</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: LIVE SLOT CONTROL ROOM */}
          {activeTab === 'control' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl">Live Slot Control Room</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Override slot statuses or block bays for maintenance</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {slotsState.map((slot) => {
                    let borderClass = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
                    if (slot.status === 'available') borderClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
                    if (slot.status === 'occupied') borderClass = 'border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-400';
                    if (slot.status === 'blocked') borderClass = 'border-slate-300 dark:border-slate-700 opacity-60 text-slate-400';

                    return (
                      <div key={slot.id} className={`p-4 rounded-2xl border ${borderClass} flex flex-col justify-between h-36 space-y-2`}>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-sm">{slot.id}</span>
                          <span className="text-[10px] font-bold uppercase">{slot.status}</span>
                        </div>

                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {slot.vehicle || 'Empty Bay'}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <button
                            onClick={() => handleToggleBlockSlot(slot.id)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                          >
                            {slot.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          {slot.status === 'occupied' && (
                            <button
                              onClick={() => handleFreeSlot(slot.id)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold"
                            >
                              Free
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: REVENUE ADJUSTER */}
          {activeTab === 'revenue' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-heading font-extrabold text-2xl">Dynamic Revenue Adjuster</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scale pricing multipliers based on local metro congestion</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Congestion Surge Multiplier</span>
                    <span className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">{surgeMultiplier}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.1"
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: GATE OCR LOGS */}
          {activeTab === 'gate' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl">Gate OCR Camera Log</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automated license plate reader feed</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="p-3 uppercase">Plate Number</th>
                      <th className="p-3 uppercase">Assigned Slot</th>
                      <th className="p-3 uppercase">Timestamp</th>
                      <th className="p-3 uppercase">OCR Action</th>
                      <th className="p-3 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {ocrFeed.map((row) => (
                      <tr key={row.id}>
                        <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">{row.plate}</td>
                        <td className="p-3">{row.slot}</td>
                        <td className="p-3 text-slate-400">{row.time}</td>
                        <td className="p-3">{row.action}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </main>

      </div>

    </div>
  );
}
