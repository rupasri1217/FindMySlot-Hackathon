import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Bike, 
  Car, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Star, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Navigation, 
  Compass, 
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import MapView from './MapView';
import { mockDestinations, mockParkingLots, lastMileProviders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function DriverDashboard({ isDarkMode, onToggleTheme }) {
  const { userProfile, logout } = useAuth();

  // 6 Steps Journey: 'discovery' | 'slots' | 'payment' | 'outdoor_nav' | 'indoor_nav' | 'last_mile'
  const [navStep, setNavStep] = useState('discovery');
  const [selectedDest, setSelectedDest] = useState(mockDestinations[0]); // CP New Delhi
  const [searchQuery, setSearchQuery] = useState(mockDestinations[0].name);
  const [vehicleType, setVehicleType] = useState('2W');
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [vehiclePlate, setVehiclePlate] = useState(userProfile?.vehicleNumber || 'KA-03-HL-4821');
  const [bookedLastMile, setBookedLastMile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('G');

  // Origin point
  const userOrigin = { name: 'Hauz Khas Social, New Delhi', lat: 28.5494, lng: 77.2001 };

  // Filtered parking lots
  const parkingList = useMemo(() => {
    if (!selectedDest) return [];
    let lots = mockParkingLots[selectedDest.id] || [];

    if (activeFilter === 'closest') {
      lots = [...lots].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (activeFilter === 'cheapest') {
      const key = vehicleType === '2W' ? 'price2W' : 'price4W';
      lots = [...lots].sort((a, b) => a[key] - b[key]);
    } else if (activeFilter === 'cctv') {
      lots = lots.filter(l => l.amenities.includes('CCTV Secured'));
    }
    return lots;
  }, [selectedDest, activeFilter, vehicleType]);

  const handleDestinationSelect = (dest) => {
    setSelectedDest(dest);
    setSearchQuery(dest.name);
    setSelectedLot(null);
    setSelectedSlot(null);
    setShowDropdown(false);
    setNavStep('discovery');
  };

  const handleSelectSlot = (slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP COMMUTER HEADER BAR */}
      <header className="h-16 glass-panel-light dark:glass-panel border-b border-slate-200 dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            P
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white">FindMySlot</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-2 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Commuter Hub
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

          {/* User profile */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {userProfile?.name?.charAt(0) || 'R'}
            </div>
            <div className="text-xs">
              <div className="font-bold">{userProfile?.name || 'Rohan Sharma'}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{vehiclePlate}</div>
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

      {/* DASHBOARD LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* LEFT FLOATING SEARCH SHEET / SIDEBAR */}
        <div className="w-full md:w-[460px] h-full bg-white dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-2xl overflow-y-auto">
          
          {/* SEARCH & VEHICLE PILLS HEADER */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
            
            {/* DESTINATION SEARCH BAR */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Where are you going?
              </label>
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-indigo-600 dark:text-indigo-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Enter shopping mall, metro, market..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {mockDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => handleDestinationSelect(dest)}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center gap-3 transition"
                    >
                      <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{dest.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{dest.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK VEHICLE SWITCHER PILLS: [🛵 Scooter | 🏍️ Bike | 🚗 Car | ⚡ EV] */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Select Vehicle Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setVehicleType('2W')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    vehicleType === '2W' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Bike size={16} />
                  <span>Scooter</span>
                </button>

                <button
                  onClick={() => setVehicleType('2W')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    vehicleType === '2W' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Bike size={16} />
                  <span>Bike</span>
                </button>

                <button
                  onClick={() => setVehicleType('4W')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    vehicleType === '4W' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Car size={16} />
                  <span>Car</span>
                </button>

                <button
                  onClick={() => setVehicleType('4W')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                    vehicleType === '4W' 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap size={16} className="text-emerald-500" />
                  <span>EV</span>
                </button>
              </div>
            </div>

            {/* SORTING FILTER CHIPS */}
            <div className="flex gap-2 overflow-x-auto pt-1 no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All Lots
              </button>
              <button
                onClick={() => setActiveFilter('closest')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  activeFilter === 'closest' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Closest First
              </button>
              <button
                onClick={() => setActiveFilter('cheapest')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  activeFilter === 'cheapest' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Cheapest
              </button>
              <button
                onClick={() => setActiveFilter('cctv')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  activeFilter === 'cctv' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                CCTV Secured
              </button>
            </div>

          </div>

          {/* DYNAMIC STEPS BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* STEP 1: PARKING DISCOVERY CARDS */}
            {navStep === 'discovery' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Smart Parking Lots
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    {parkingList.length} Available
                  </span>
                </div>

                {parkingList.map((lot) => {
                  const isSelected = selectedLot?.id === lot.id;
                  const price = vehicleType === '2W' ? lot.price2W : lot.price4W;
                  
                  return (
                    <motion.div
                      key={lot.id}
                      onClick={() => setSelectedLot(lot)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-5 rounded-2xl border transition cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading font-bold text-base">{lot.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <Star size={12} fill="currentColor" /> {lot.rating}
                            </span>
                            <span className="text-[11px] text-slate-500">({lot.reviewsCount} reviews)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Distance</div>
                          <div className="font-extrabold text-sm">{lot.distance}</div>
                        </div>
                      </div>

                      {/* Meta badges */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                          <span>{lot.walkingTime} min walk</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck size={14} />
                          <span>{lot.safetyScore}% Safe</span>
                        </div>
                        {lot.amenities.includes('EV Charging') && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Zap size={14} />
                            <span>EV Ports</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing & Selection CTA */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price per hour</span>
                          <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">₹{price}/hr</span>
                        </div>
                        
                        {isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNavStep('slots');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
                          >
                            Select Slot <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: SLOT MATRIX SELECTOR */}
            {navStep === 'slots' && selectedLot && (
              <div className="space-y-4">
                <button
                  onClick={() => setNavStep('discovery')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-2"
                >
                  <ArrowLeft size={14} /> Change Parking Lot
                </button>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h4 className="font-heading font-bold text-base">{selectedLot.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Floorplan Slot Bay Matrix</p>

                  {/* Floor Selector Pills */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentFloor('G')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${currentFloor === 'G' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                      Ground Floor (G)
                    </button>
                    <button
                      onClick={() => setCurrentFloor('1st')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${currentFloor === '1st' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                      Basement Level (B1)
                    </button>
                  </div>
                </div>

                {/* Grid legend */}
                <div className="flex gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-rose-500" />
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-500" />
                    <span>Reserved</span>
                  </div>
                </div>

                {/* Interactive slot grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {selectedLot.slots[vehicleType].map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    let colorClass = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed';
                    
                    if (slot.status === 'available') {
                      colorClass = 'bg-emerald-500/10 border-emerald-500/50 hover:border-emerald-500 cursor-pointer text-emerald-700 dark:text-emerald-400';
                    } else if (slot.status === 'reserved') {
                      colorClass = 'bg-amber-500/10 border-amber-500/30 opacity-70 cursor-not-allowed text-amber-600';
                    } else if (slot.status === 'occupied') {
                      colorClass = 'bg-rose-500/10 border-rose-500/30 opacity-60 cursor-not-allowed text-rose-600';
                    }

                    if (isSelected) {
                      colorClass = 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-400 shadow-md';
                    }

                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleSelectSlot(slot)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between h-20 ${colorClass}`}
                      >
                        <span className="text-xs font-extrabold">{slot.id}</span>
                        {slot.type === 'ev' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                            EV
                          </span>
                        )}
                        <span className="text-[10px] uppercase opacity-75">{slot.floor}</span>
                      </div>
                    );
                  })}
                </div>

                {selectedSlot && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                    <button
                      onClick={() => setNavStep('payment')}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      Proceed to Checkout (Slot {selectedSlot.id}) <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 3: UPI CHECKOUT & QR DIGITAL PASS */}
            {navStep === 'payment' && selectedLot && selectedSlot && (
              <div className="space-y-4">
                <button
                  onClick={() => setNavStep('slots')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-2"
                >
                  <ArrowLeft size={14} /> Back to Slot Grid
                </button>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-md">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">RESERVED BAY</span>
                      <div className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">Slot {selectedSlot.id}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">TOTAL FEE</span>
                      <div className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">₹{vehicleType === '2W' ? selectedLot.price2W : selectedLot.price4W}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Vehicle Plate Number</label>
                    <input
                      type="text"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                </div>

                {/* UPI SELECTOR */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Pay via UPI</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedUpi('gpay')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${selectedUpi === 'gpay' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'}`}
                    >
                      Google Pay
                    </button>
                    <button
                      onClick={() => setSelectedUpi('phonepe')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${selectedUpi === 'phonepe' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'}`}
                    >
                      PhonePe
                    </button>
                    <button
                      onClick={() => setSelectedUpi('paytm')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${selectedUpi === 'paytm' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'}`}
                    >
                      Paytm
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setNavStep('outdoor_nav')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  Pay ₹{vehicleType === '2W' ? selectedLot.price2W : selectedLot.price4W} & Start GPS Guidance <Navigation size={16} />
                </button>
              </div>
            )}

            {/* STEP 4: OUTDOOR GPS NAVIGATION (Hauz Khas -> CP Ramp) */}
            {navStep === 'outdoor_nav' && selectedLot && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-200">
                    <Navigation size={16} className="animate-pulse" />
                    <span>Outdoor Turn-by-Turn GPS</span>
                  </div>
                  <div className="text-base font-extrabold">In 200m, turn left into Gate 2 Parking Ramp</div>
                  <div className="text-xs text-indigo-100">Origin: Hauz Khas Social → Destination: CP Block E</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-2">
                  <span className="text-xs font-bold text-slate-500">APPROACHING PARKING BARRIER</span>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    Vahan OCR Reader Validating {vehiclePlate}...
                  </div>
                </div>

                <button
                  onClick={() => setNavStep('indoor_nav')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Enter Ramp Gate (Indoor Bay Nav) <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 5: INDOOR BAY NAVIGATION */}
            {navStep === 'indoor_nav' && selectedSlot && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Barrier Gate 2 Validated!</span>
                  </div>
                  <div className="text-sm font-extrabold">Drive straight past Pillar B2 → Slot {selectedSlot.id} is on left</div>
                </div>

                <button
                  onClick={() => setNavStep('last_mile')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Parked in Slot {selectedSlot.id}! Trigger Last-Mile Assistant <Compass size={16} />
                </button>
              </div>
            )}

            {/* STEP 6: LAST-MILE ASSISTANT MODAL (CRITICAL FEATURE) */}
            {navStep === 'last_mile' && (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl">Slot Parked Successfully!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vehicle safely locked in Bay 2W-A3</p>
                </div>

                {/* LAST-MILE POPUP CARD */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                    <Compass size={18} />
                    <span>Last-Mile Assistant</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Your destination is <strong>450m away</strong> from your parking slot. Select your last-mile option:
                  </p>

                  <div className="space-y-2">
                    {/* Walk Route Option */}
                    <div 
                      onClick={() => setBookedLastMile({ name: 'Walk Route', fare: 0 })}
                      className={`p-3.5 rounded-2xl border flex justify-between items-center cursor-pointer transition ${bookedLastMile?.name === 'Walk Route' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🚶</span>
                        <div>
                          <div className="text-xs font-bold">Walk Route</div>
                          <div className="text-[10px] opacity-75">Estimated 6 mins walk</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Free</span>
                    </div>

                    {/* Rapido Bike Taxi */}
                    <div 
                      onClick={() => setBookedLastMile(lastMileProviders[0])}
                      className={`p-3.5 rounded-2xl border flex justify-between items-center cursor-pointer transition ${bookedLastMile?.id === 'rapido' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛵</span>
                        <div>
                          <div className="text-xs font-bold">Book Rapido Bike Taxi</div>
                          <div className="text-[10px] opacity-75">ETA: 2 mins • Fast Traffic Navigation</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹25</span>
                    </div>

                    {/* Uber Auto */}
                    <div 
                      onClick={() => setBookedLastMile(lastMileProviders[1])}
                      className={`p-3.5 rounded-2xl border flex justify-between items-center cursor-pointer transition ${bookedLastMile?.id === 'ola' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🚗</span>
                        <div>
                          <div className="text-xs font-bold">Book Uber Auto</div>
                          <div className="text-[10px] opacity-75">ETA: 3 mins • Covered Ride</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹40</span>
                    </div>
                  </div>
                </motion.div>

                <button
                  onClick={() => {
                    setNavStep('discovery');
                    setSelectedLot(null);
                    setSelectedSlot(null);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition"
                >
                  Complete Journey & Home
                </button>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT MAP VIEW */}
        <div className="flex-1 h-full relative">
          <MapView
            destination={selectedDest}
            userOrigin={userOrigin}
            parkingLots={parkingList}
            selectedLot={selectedLot}
            onSelectLot={(lot) => {
              setSelectedLot(lot);
              setNavStep('slots');
            }}
            vehicleType={vehicleType}
            isDarkMode={isDarkMode}
            navStep={navStep}
            selectedSlot={selectedSlot}
          />
        </div>

      </div>

    </div>
  );
}
