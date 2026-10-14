import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Compass,
  Star,
  Shield,
  BatteryCharging,
  Clock,
  ArrowRight,
  ArrowLeft,
  Bike,
  Car,
  Heart,
  User,
  Bell,
  ChevronRight,
  X,
  Info,
  CheckCircle2,
  Ticket,
  Map,
  Filter,
  Check,
  CreditCard,
  Phone
} from 'lucide-react';
import {
  mockDestinations,
  mockParkingLots,
  lastMileProviders,
  mockNotifications,
  mockBookingHistory
} from '../data/mockData';

export default function UserApp({ activeFavorites, onToggleFavorite, notifications, onAddNotification }) {
  // Navigation steps: 'search' | 'discovery' | 'slot_select' | 'payment' | 'navigation' | 'ticket'
  const [step, setStep] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState(null);
  const [vehicleType, setVehicleType] = useState('2W'); // '2W' or '4W'
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'closest' | 'cheapest' | 'safety' | 'ev'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map' (for mobile layout)
  const [selectedLastMile, setSelectedLastMile] = useState(null);
  
  // Checkout & Payment states
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [paymentTimer, setPaymentTimer] = useState(300); // 5 min countdown
  
  // Live navigation state
  const [navType, setNavType] = useState('outdoor'); // 'outdoor' | 'indoor'
  const [navStepIndex, setNavStepIndex] = useState(0);

  // Side drawers
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto UPI Plate Generator for user convenience
  useEffect(() => {
    if (vehicleType === '2W') {
      setVehicleNumber('KA-03-HL-4821');
    } else {
      setVehicleNumber('DL-3C-BY-9011');
    }
  }, [vehicleType]);

  // Payment Countdown Timer Simulation
  useEffect(() => {
    let interval = null;
    if (step === 'payment') {
      setPaymentTimer(300);
      interval = setInterval(() => {
        setPaymentTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Formatted timer
  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(paymentTimer / 60);
    const seconds = paymentTimer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [paymentTimer]);

  // Handle destination select
  const handleSelectDestination = (dest) => {
    setSelectedDest(dest);
    setSearchQuery(dest.name);
    setSelectedLot(null);
    setSelectedSlot(null);
    setStep('discovery');
  };

  // Filtered parking lots
  const filteredParkingLots = useMemo(() => {
    if (!selectedDest) return [];
    const lots = mockParkingLots[selectedDest.id] || [];
    
    // Sort or filter
    let processedLots = [...lots];
    if (activeFilter === 'closest') {
      processedLots.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (activeFilter === 'cheapest') {
      const priceKey = vehicleType === '2W' ? 'twoWheelerPrice' : 'fourWheelerPrice';
      processedLots.sort((a, b) => a[priceKey] - b[priceKey]);
    } else if (activeFilter === 'safety') {
      processedLots.sort((a, b) => b.safetyScore - a.safetyScore);
    } else if (activeFilter === 'ev') {
      processedLots = processedLots.filter(lot => lot.amenities.includes('EV Charging'));
    }
    return processedLots;
  }, [selectedDest, activeFilter, vehicleType]);

  // Suggest last-mile transport if walking distance > 300m
  const needsLastMile = useMemo(() => {
    if (!selectedLot) return false;
    const walkingDistMeters = selectedLot.walkingTime * 80; // Estimate 80m/min walking speed
    return walkingDistMeters > 300;
  }, [selectedLot]);

  // Handle slot reservation
  const handleSelectSlot = (slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
  };

  // Outdoor navigation step instructions
  const outdoorSteps = [
    { text: 'Head south on Main Street toward outer ring road', dist: '400m' },
    { text: 'At the roundabout, take the 2nd exit onto Destination Marg', dist: '300m' },
    { text: 'Turn left. FindMySlot selected parking entrance is on your right', dist: '50m' }
  ];

  // Indoor level slot navigation step instructions
  const indoorSteps = [
    { text: 'Pass the gate barrier. Scanner validated plate automatically.', dist: 'G Floor' },
    { text: 'Drive straight down the ramp to Floor Level ' + (selectedSlot?.floor || 'G'), dist: 'Ramp' },
    { text: 'Turn right at the Lane indicator. Drive 15 meters.', dist: 'Lane 3' },
    { text: 'Arrived! Park in Slot ' + (selectedSlot?.id || 'A3') + ' (marked Green/EV)', dist: 'Slot' }
  ];

  const handleNextNavStep = () => {
    const stepsArray = navType === 'outdoor' ? outdoorSteps : indoorSteps;
    if (navStepIndex < stepsArray.length - 1) {
      setNavStepIndex(navStepIndex + 1);
    } else {
      if (navType === 'outdoor') {
        // Switch to indoor parking floor map
        setNavType('indoor');
        setNavStepIndex(0);
      } else {
        // Booking checked in, go to final ticket screen
        setStep('ticket');
        onAddNotification({
          id: Date.now(),
          title: 'Journey Completed!',
          text: `You have successfully parked at slot ${selectedSlot?.id}. Check-in registered.`,
          time: 'Just now',
          type: 'success'
        });
      }
    }
  };

  const handleBookSelectedLastMile = (provider) => {
    setSelectedLastMile(provider);
    onAddNotification({
      id: Date.now(),
      title: `${provider.name} Booked!`,
      text: `Your last-mile ride is arriving at the parking exit gate in ${provider.eta}.`,
      time: 'Just now',
      type: 'success'
    });
  };

  const handleConfirmPayment = () => {
    setStep('navigation');
    setNavType('outdoor');
    setNavStepIndex(0);
    onAddNotification({
      id: Date.now(),
      title: 'Payment Successful',
      text: `₹${vehicleType === '2W' ? selectedLot.twoWheelerPrice : selectedLot.fourWheelerPrice} paid via UPI. Booking reference ${Math.floor(1000 + Math.random() * 9000)} generated.`,
      time: 'Just now',
      type: 'success'
    });
  };

  return (
    <div className="main-content">
      {/* 1. SIDEBAR PANEL */}
      <div className={`sidebar-panel ${viewMode === 'map' ? 'mobile-hidden' : ''}`}>
        
        {/* STEP 1: Search Home */}
        {step === 'search' && (
          <div className="slide-in" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <div className="india-badge" style={{ marginBottom: '8px' }}>
                🇮🇳 Designed for Indian Mobility
              </div>
              <h2 style={{ fontSize: '28px', lineHeight: '1.2', color: '#fff', marginBottom: '8px' }}>
                Where are you going?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Find & book slot-level parking and map your last-mile journey.
              </p>
            </div>

            {/* Vehicle Selection */}
            <div className="form-group">
              <label className="form-label">Select Vehicle Type</label>
              <div className="vehicle-selector">
                <div 
                  className={`vehicle-option ${vehicleType === '2W' ? 'selected' : ''}`}
                  onClick={() => setVehicleType('2W')}
                >
                  <Bike size={28} />
                  <span className="vehicle-label">Two-Wheeler</span>
                  <span className="vehicle-sub">Scooter / Bike</span>
                </div>
                <div 
                  className={`vehicle-option ${vehicleType === '4W' ? 'selected' : ''}`}
                  onClick={() => setVehicleType('4W')}
                >
                  <Car size={28} />
                  <span className="vehicle-label">Four-Wheeler</span>
                  <span className="vehicle-sub">Hatchback / SUV / EV</span>
                </div>
              </div>
            </div>

            {/* Destination Search Bar */}
            <div className="form-group">
              <label className="form-label">Destination Address</label>
              <div className="input-container">
                <Search className="input-icon-left" size={20} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter shopping mall, office, market..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Popular Quick Options */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: '#fff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Popular Locations Nearby
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockDestinations.map((dest) => (
                  <div 
                    key={dest.id}
                    className="premium-card"
                    style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => handleSelectDestination(dest)}
                  >
                    <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-primary)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{dest.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{dest.city}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Discovery & Recommendations */}
        {step === 'discovery' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header with Search Details */}
            <div style={{ padding: '20px 20px 12px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <button 
                onClick={() => setStep('search')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', fontWeight: '600' }}
              >
                <ArrowLeft size={14} /> Back to Search
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#fff' }}>{selectedDest?.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>{vehicleType === '2W' ? 'Two-Wheeler (2W)' : 'Four-Wheeler (4W)'}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Active Recommendations</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic filter chips */}
            <div className="filter-tabs">
              <div 
                className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </div>
              <div 
                className={`filter-chip ${activeFilter === 'closest' ? 'active' : ''}`}
                onClick={() => setActiveFilter('closest')}
              >
                Closest
              </div>
              <div 
                className={`filter-chip ${activeFilter === 'cheapest' ? 'active' : ''}`}
                onClick={() => setActiveFilter('cheapest')}
              >
                Cheapest First
              </div>
              <div 
                className={`filter-chip ${activeFilter === 'safety' ? 'active' : ''}`}
                onClick={() => setActiveFilter('safety')}
              >
                Safe & Guarded
              </div>
              <div 
                className={`filter-chip ${activeFilter === 'ev' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ev')}
              >
                EV Charging
              </div>
            </div>

            {/* Results list */}
            <div className="parking-list">
              {filteredParkingLots.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No parking lots found for this destination. Try another location.
                </div>
              ) : (
                filteredParkingLots.map((lot) => {
                  const isSelected = selectedLot?.id === lot.id;
                  const price = vehicleType === '2W' ? lot.twoWheelerPrice : lot.fourWheelerPrice;
                  
                  return (
                    <div 
                      key={lot.id}
                      className={`premium-card parking-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedLot(lot)}
                    >
                      <div className="card-header-row">
                        <div>
                          <h4 className="parking-title">{lot.name}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span className="rating-badge">
                              <Star size={12} fill="currentColor" /> {lot.rating}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              ({lot.reviewsCount} reviews)
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Distance</span>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{lot.distance}</span>
                        </div>
                      </div>

                      {/* Travel metadata */}
                      <div className="parking-meta">
                        <div className="meta-item">
                          <Clock size={14} /> <span>{lot.walkingTime} min walk</span>
                        </div>
                        <div className="meta-item" style={{ color: lot.safetyScore >= 95 ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
                          <Shield size={14} /> <span>{lot.safetyScore}% Safe</span>
                        </div>
                        {lot.amenities.includes('EV Charging') && (
                          <div className="meta-item animate-pulse" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
                            <BatteryCharging size={14} /> <span>EV Slots</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing and Action row */}
                      <div className="pricing-row">
                        <div>
                          <span className="price-label">Price per hour</span>
                          <div className="price-text">₹{price}/hr</div>
                        </div>
                        {isSelected && (
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setStep('slot_select');
                            }}
                          >
                            Select Slot <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Slot Selection */}
        {step === 'slot_select' && selectedLot && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header */}
            <div style={{ padding: '20px 20px 12px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <button 
                onClick={() => {
                  setSelectedSlot(null);
                  setStep('discovery');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', fontWeight: '600' }}
              >
                <ArrowLeft size={14} /> Change Parking Lot
              </button>
              
              <h3 style={{ fontSize: '18px', color: '#fff' }}>{selectedLot.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select an available slot ({vehicleType === '2W' ? '2W' : '4W'} Bays)
              </p>
            </div>

            {/* Interactive Grid */}
            <div className="slot-grid-container" style={{ flex: 1, overflowY: 'auto' }}>
              
              {/* Floor tabs */}
              <div className="floor-tabs">
                <button className="floor-tab active">Floor G (Ground)</button>
                <button className="floor-tab">Floor B1 (Basement)</button>
                <button className="floor-tab">Floor 1st</button>
              </div>

              {/* Grid Legend */}
              <div className="legend-container">
                <div className="legend-item">
                  <div className="legend-color color-available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color color-occupied"></div>
                  <span>Occupied</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color color-reserved"></div>
                  <span>Reserved</span>
                </div>
              </div>

              {/* Slot grid */}
              <div className="slot-grid">
                {selectedLot.slots[vehicleType].map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  let slotClass = slot.status;
                  if (isSelected) slotClass += ' selected-slot';
                  
                  return (
                    <div 
                      key={slot.id}
                      className={`slot-box ${slotClass}`}
                      onClick={() => handleSelectSlot(slot)}
                    >
                      <span className="slot-id">{slot.id}</span>
                      {slot.type === 'ev' && (
                        <span className="slot-type-badge ev">EV</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected spot details banner */}
              {selectedSlot ? (
                <div className="premium-card fade-in" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'var(--color-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', fontWeight: '700' }}>Slot Confirmed</span>
                      <h4 style={{ fontSize: '20px', color: '#fff', fontWeight: '800' }}>Slot {selectedSlot.id}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Hourly Price</span>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-accent)' }}>
                        ₹{vehicleType === '2W' ? selectedLot.twoWheelerPrice : selectedLot.fourWheelerPrice}/hr
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px' }}>
                    <Info size={14} />
                    <span>Includes direct indoor navigation straight to slot.</span>
                  </div>

                  <button 
                    className="btn btn-accent" 
                    style={{ width: '100%' }}
                    onClick={() => setStep('payment')}
                  >
                    Proceed to Payment <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  Please click an available slot (highlighted in Green outline) to proceed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Payment UPI Gateway */}
        {step === 'payment' && selectedLot && selectedSlot && (
          <div className="slide-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            
            <button 
              onClick={() => setStep('slot_select')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '20px', fontWeight: '600' }}
            >
              <ArrowLeft size={14} /> Back to Slot selection
            </button>

            <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '16px' }}>Booking Summary</h3>

            {/* Booking Details Summary Card */}
            <div className="premium-card" style={{ marginBottom: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Destination</div>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{selectedDest?.name}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>PARKING LOT</span>
                  <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{selectedLot.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>SLOT BAY</span>
                  <span style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '16px' }}>{selectedSlot.id}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: '700', color: '#fff' }}>Hourly Fee:</span>
                <span style={{ fontWeight: '800', color: 'var(--color-accent)' }}>
                  ₹{vehicleType === '2W' ? selectedLot.twoWheelerPrice : selectedLot.fourWheelerPrice}
                </span>
              </div>
            </div>

            {/* Form for Plate input */}
            <div className="form-group">
              <label className="form-label">Vehicle Plate Number (Vahan Registered)</label>
              <div className="input-container">
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '16px' }}
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. KA-03-HL-1234"
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Plate validation will be scanned at parking entrance bar.
              </span>
            </div>

            {/* UPI Option */}
            <div className="upi-modal-content">
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Pay Securely via UPI</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Choose provider to auto-generate request</p>
              
              <div className="upi-logos">
                <div 
                  className={`upi-logo-chip ${selectedUpi === 'gpay' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('gpay')}
                >
                  Google Pay
                </div>
                <div 
                  className={`upi-logo-chip ${selectedUpi === 'phonepe' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('phonepe')}
                >
                  PhonePe
                </div>
                <div 
                  className={`upi-logo-chip ${selectedUpi === 'paytm' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('paytm')}
                >
                  Paytm
                </div>
              </div>
              
              <div className="timer-countdown">
                Request expires in {formattedTimer}
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'auto', padding: '14px' }}
              disabled={!vehicleNumber}
              onClick={handleConfirmPayment}
            >
              Pay & Confirm Slot
            </button>
          </div>
        )}

        {/* STEP 5: Live Navigation */}
        {step === 'navigation' && selectedLot && selectedSlot && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header info */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="india-badge">
                  Live Navigation
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {navType === 'outdoor' ? 'Outdoor: To Gate' : 'Indoor: To Slot'}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', color: '#fff', marginTop: '8px' }}>{selectedLot.name}</h3>
            </div>

            {/* Instruction container */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              {/* Active Step Panel */}
              <div className="premium-card" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--border-focus)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="nav-direction-icon">
                  <Navigation size={22} style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                    {(navType === 'outdoor' ? outdoorSteps[navStepIndex].text : indoorSteps[navStepIndex].text)}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {(navType === 'outdoor' ? outdoorSteps[navStepIndex].dist : indoorSteps[navStepIndex].dist)}
                  </div>
                </div>
              </div>

              {/* Middle progress illustration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Current location</span>
                  <span>Slot {selectedSlot.id}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      backgroundColor: 'var(--color-primary)', 
                      width: navType === 'outdoor' 
                        ? `${((navStepIndex + 1) / (outdoorSteps.length + indoorSteps.length)) * 100}%` 
                        : `${((outdoorSteps.length + navStepIndex + 1) / (outdoorSteps.length + indoorSteps.length)) * 100}%`,
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
                {navType === 'outdoor' && (
                  <span style={{ fontSize: '12px', color: 'var(--color-primary)', textAlign: 'center', marginTop: '6px' }}>
                    Approaching Parking Gate barrier (Auto-plate read validation pending...)
                  </span>
                )}
                {navType === 'indoor' && (
                  <span style={{ fontSize: '12px', color: 'var(--color-accent)', textAlign: 'center', marginTop: '6px' }}>
                    Scanning indoor ultrasonic slot detector... Follow green guide.
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn btn-accent"
                  onClick={handleNextNavStep}
                >
                  {navType === 'outdoor' && navStepIndex === outdoorSteps.length - 1
                    ? 'Enter Gate (Indoor Nav)'
                    : navType === 'indoor' && navStepIndex === indoorSteps.length - 1
                      ? 'Arrived & Parked'
                      : 'Next Step'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setStep('ticket')}
                >
                  Skip to Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Finished Ticket Confirmation */}
        {step === 'ticket' && selectedLot && selectedSlot && (
          <div className="slide-in" style={{ padding: '24px', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-accent)', padding: '10px', borderRadius: '50%', marginBottom: '12px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: '800' }}>Slot Successfully Parked!</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Check-in timestamp: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Smart Ticket Display */}
            <div className="ticket-container">
              <div className="ticket-header">
                <span className="ticket-title">FindMySlot Digital Pass</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Scan for checking out</p>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">TICKET ID</span>
                <span className="ticket-value highlight">FMS-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">PARKING LOT</span>
                <span className="ticket-value">{selectedLot.name}</span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">VEHICLE TYPE</span>
                <span className="ticket-value">{vehicleType === '2W' ? 'Two-Wheeler (2W)' : 'Four-Wheeler (4W)'}</span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">VEHICLE PLATE</span>
                <span className="ticket-value">{vehicleNumber}</span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">SLOT RESERVED</span>
                <span className="ticket-value highlight" style={{ color: 'var(--color-accent)', fontSize: '16px' }}>
                  {selectedSlot.id}
                </span>
              </div>

              <div className="ticket-row">
                <span className="ticket-label">RATE</span>
                <span className="ticket-value">₹{vehicleType === '2W' ? selectedLot.twoWheelerPrice : selectedLot.fourWheelerPrice}/hr</span>
              </div>

              <div className="barcode-sim" />
            </div>

            {/* LAST MILE INTEGRATION CHECK */}
            {needsLastMile && (
              <div className="premium-card slide-in" style={{ marginTop: '24px', borderColor: 'var(--color-primary-hover)' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} color="var(--color-primary)" />
                  <span>Last-Mile Transportation</span>
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Your parked lot is <strong>{selectedLot.distance} ({selectedLot.walkingTime} min walk)</strong> from your final destination. We suggest taking a quick taxi:
                </p>

                <div className="last-mile-container">
                  {lastMileProviders.map((provider) => {
                    const isBooked = selectedLastMile?.id === provider.id;
                    return (
                      <div 
                        key={provider.id}
                        className="last-mile-option"
                        style={{ borderColor: isBooked ? 'var(--color-accent)' : 'var(--border-color)' }}
                        onClick={() => handleBookSelectedLastMile(provider)}
                      >
                        <div className="last-mile-left">
                          <div className="last-mile-icon">
                            {provider.icon === 'bike' ? <Bike size={18} /> : <Car size={18} />}
                          </div>
                          <div className="last-mile-details">
                            <span className="last-mile-name">{provider.name}</span>
                            <span className="last-mile-eta">ETA: {provider.eta}</span>
                          </div>
                        </div>
                        <div className="last-mile-right">
                          <span className="last-mile-fare">₹{provider.fare}</span>
                          {isBooked ? (
                            <span className="last-mile-speed" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-accent)' }}>
                              Booked!
                            </span>
                          ) : (
                            <span className="last-mile-speed">{provider.speed}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete Journey Actions */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setStep('search');
                  setSelectedLot(null);
                  setSelectedSlot(null);
                  setSelectedLastMile(null);
                }}
              >
                Complete Journey & Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. INTERACTIVE MAP PANEL */}
      <div className={`map-panel ${viewMode === 'list' ? 'mobile-hidden' : ''}`}>
        
        {/* Toggle list/map switcher for mobile */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: '30', display: 'flex', gap: '8px' }}>
          {selectedDest && (
            <button 
              className="btn btn-secondary" 
              style={{ display: 'none', gap: '6px', padding: '8px 14px', borderRadius: '30px' }} // Controlled in CSS or dynamically below
              onClick={() => onToggleFavorite(selectedDest)}
            >
              <Heart size={16} fill={activeFavorites.some(f => f.id === selectedDest.id) ? 'var(--color-danger)' : 'none'} color={activeFavorites.some(f => f.id === selectedDest.id) ? 'var(--color-danger)' : 'currentColor'} />
              <span>Fav</span>
            </button>
          )}
        </div>

        {/* Dynamic interactive SVG Map rendering */}
        <svg viewBox="0 0 800 500" className="svg-map">
          {/* SVG Map grids */}
          <defs>
            <pattern id="grid" width="40" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render roads and paths */}
          {/* Main roads */}
          <path d="M-50,250 L850,250" className="map-road-highway" strokeWidth="24" /> {/* West-East highway */}
          <path d="M400,-50 L400,550" className="map-road-highway" strokeWidth="24" /> {/* North-South highway */}
          
          {/* Sub avenues */}
          <path d="M150,-50 L150,550" className="map-road" strokeWidth="14" />
          <path d="M650,-50 L650,550" className="map-road" strokeWidth="14" />
          <path d="M-50,120 L850,120" className="map-road" strokeWidth="14" />
          <path d="M-50,380 L850,380" className="map-road" strokeWidth="14" />

          {/* Landmarks / Building outlines */}
          {/* Destination central district */}
          <rect x="340" y="210" width="120" height="80" className="map-building" rx="8" />
          
          {/* Other buildings */}
          <rect x="80" y="40" width="100" height="60" className="map-building" rx="6" />
          <rect x="200" y="40" width="120" height="60" className="map-building" rx="6" />
          <rect x="480" y="40" width="100" height="60" className="map-building" rx="6" />
          
          <rect x="80" y="400" width="120" height="70" className="map-building" rx="6" />
          <rect x="480" y="400" width="100" height="70" className="map-building" rx="6" />
          <rect x="620" y="400" width="120" height="70" className="map-building" rx="6" />

          {/* Destination Landmark Pin (Only shown if destination is chosen) */}
          {selectedDest && (
            <g transform="translate(400, 250)" className="map-pin">
              {/* Pulsating target circle */}
              <circle r="12" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="pin-pulse" />
              <circle r="6" fill="var(--color-primary)" />
              {/* Flag / Marker Pin */}
              <path d="M0,0 L0,-32" stroke="#fff" strokeWidth="2" />
              <polygon points="0,-32 20,-24 0,-16" fill="var(--color-primary)" />
              
              {/* Landmark Label */}
              <rect x="-60" y="8" width="120" height="24" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              <text x="0" y="24" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Destination</text>
            </g>
          )}

          {/* Render Parking Lots as custom Pins */}
          {selectedDest && (mockParkingLots[selectedDest.id] || []).map((lot) => {
            const isSelected = selectedLot?.id === lot.id;
            const markerColor = isSelected ? 'var(--color-primary)' : 'var(--color-accent)';
            const glowShadow = isSelected ? 'var(--shadow-glow-blue)' : 'var(--shadow-glow-emerald)';

            return (
              <g 
                key={lot.id} 
                transform={`translate(${lot.mapCoords.x}, ${lot.mapCoords.y})`}
                className="map-pin"
                onClick={() => setSelectedLot(lot)}
              >
                {/* Pin base hover glow */}
                <circle r="22" fill="none" stroke={markerColor} strokeWidth="1" opacity="0.3" />
                {isSelected && (
                  <circle r="16" fill="none" stroke={markerColor} strokeWidth="2" className="pin-pulse" />
                )}
                
                {/* Visual marker shape */}
                <path 
                  d="M0,0 C-12,-12 -12,-32 0,-38 C12,-32 12,-12 0,0 Z" 
                  fill={markerColor}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Parking letter P */}
                <text x="0" y="-23" fill="#fff" fontSize="12" fontWeight="900" textAnchor="middle">P</text>

                {/* Info bubble label */}
                <g transform="translate(0, -56)">
                  <rect x="-70" y="-12" width="140" height="24" rx="12" fill="var(--bg-surface)" stroke={markerColor} strokeWidth="1.5" />
                  <text x="0" y="4" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {lot.name.substring(0, 14)}... (₹{vehicleType === '2W' ? lot.twoWheelerPrice : lot.fourWheelerPrice})
                  </text>
                </g>
              </g>
            );
          })}

          {/* NAVIGATION ROUTING PATH (Rendered if step is 'navigation' or selectedLot) */}
          {selectedDest && selectedLot && (
            <>
              {/* Outdoor route path (Current position to selected lot entrance) */}
              {navType === 'outdoor' && (
                <>
                  {/* Start Point Dot */}
                  <g transform="translate(150, 120)">
                    <circle r="8" fill="var(--color-primary)" />
                    <circle r="16" fill="none" stroke="var(--color-primary)" strokeWidth="1" className="pin-pulse" />
                    <text x="0" y="24" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Current Location</text>
                  </g>

                  {/* Route path from (150, 120) to Lot Coordinates */}
                  <path 
                    d={`M150,120 L400,120 L400,${selectedLot.mapCoords.y} L${selectedLot.mapCoords.x},${selectedLot.mapCoords.y}`} 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="4" 
                    className="nav-path" 
                  />
                </>
              )}

              {/* Indoor turn-by-turn path directly to slot (Replaces main map with layout!) */}
              {navType === 'indoor' && (
                <g transform="translate(100, 50)">
                  {/* Inner Parking Garage Blueprint Outline */}
                  <rect width="600" height="380" fill="#0f172a" stroke="var(--border-color)" strokeWidth="3" rx="16" />
                  
                  {/* Drive Lanes */}
                  <line x1="100" y1="50" x2="100" y2="330" stroke="#334155" strokeWidth="40" strokeDasharray="10,10" />
                  <line x1="300" y1="50" x2="300" y2="330" stroke="#334155" strokeWidth="40" strokeDasharray="10,10" />
                  <line x1="500" y1="50" x2="500" y2="330" stroke="#334155" strokeWidth="40" strokeDasharray="10,10" />
                  <line x1="100" y1="190" x2="500" y2="190" stroke="#334155" strokeWidth="40" strokeDasharray="10,10" />

                  {/* Parking Slots outline details (Ground/Level Blueprint) */}
                  {/* Left Column slots */}
                  <rect x="20" y="70" width="50" height="40" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="4" />
                  <text x="45" y="95" fill="var(--text-muted)" fontSize="10" textAnchor="middle">G-01</text>
                  <rect x="20" y="120" width="50" height="40" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="4" />
                  <text x="45" y="145" fill="var(--text-muted)" fontSize="10" textAnchor="middle">G-02</text>
                  <rect x="20" y="220" width="50" height="40" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="4" />
                  <text x="45" y="245" fill="var(--text-muted)" fontSize="10" textAnchor="middle">G-03</text>
                  
                  {/* Target Slot (Highighted) */}
                  <rect x="20" y="270" width="50" height="40" fill="var(--color-accent-glow)" stroke="var(--color-accent)" strokeWidth="3" rx="4" />
                  <text x="45" y="295" fill="var(--color-accent)" fontSize="12" fontWeight="bold" textAnchor="middle">Slot {selectedSlot.id}</text>
                  <circle cx="45" cy="290" r="15" fill="none" stroke="var(--color-accent)" strokeWidth="1" className="pin-pulse" />

                  {/* Other middle slots */}
                  <rect x="180" y="70" width="50" height="40" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="4" />
                  <text x="205" y="95" fill="var(--text-muted)" fontSize="10" textAnchor="middle">G-05</text>
                  <rect x="180" y="120" width="50" height="40" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="4" />
                  <text x="205" y="145" fill="var(--text-muted)" fontSize="10" textAnchor="middle">G-06</text>

                  {/* Main Entry Gate */}
                  <rect x="520" y="165" width="80" height="50" fill="var(--bg-secondary)" stroke="var(--color-primary)" strokeWidth="2" />
                  <text x="560" y="195" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">GATE IN</text>

                  {/* Animated Indoor Routing Path (Entry Gate -> Lane -> Target Slot) */}
                  <path 
                    d="M 540,190 L 300,190 L 300,290 L 70,290" 
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth="5" 
                    strokeDasharray="8,6"
                    className="nav-path" 
                  />
                  {/* Pointer arrow representing vehicle moving */}
                  <circle cx="300" cy="190" r="8" fill="var(--color-accent)" className="nav-pulse" />
                </g>
              )}
            </>
          )}
        </svg>

        {/* Search Map details panel on startup */}
        {!selectedDest && (
          <div className="map-floating-overlay">
            <div className="premium-card map-floating-card">
              <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--color-primary)" />
                <span>Destination Centric Search</span>
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Tell us where you are going (Connaught Place, Indiranagar, Pondy Bazaar) to view slot-level smart recommendation maps and check real-time parking spaces.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE LIST/MAP TOGGLER BUTTON */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '24px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: '99',
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '30px',
          padding: '4px',
          boxShadow: 'var(--shadow-md)'
        }}
        className="desktop-hidden"
      >
        <button 
          className={`role-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          List View
        </button>
        <button 
          className={`role-btn ${viewMode === 'map' ? 'active font-bold' : ''}`}
          onClick={() => setViewMode('map')}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Interactive Map
        </button>
      </div>

      {/* 3. DRAWERS & PANELS */}
      {/* booking history drawer */}
      {showHistory && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="slide-in" style={{ width: '100%', maxWidth: '460px', height: '100%', backgroundColor: 'var(--bg-secondary)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', color: '#fff' }}>Booking Tickets History</h3>
              <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockBookingHistory.map((item) => (
                <div key={item.id} className="premium-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-primary)', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {item.id}
                    </span>
                    <span className="status-pill completed">{item.status}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', color: '#fff' }}>{item.parkingName}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span>{item.date}</span>
                    <span>Plate: {item.vehicleNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#fff', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontWeight: '700' }}>
                    <span>Slot: {item.slotId}</span>
                    <span style={{ color: 'var(--color-accent)' }}>Paid ₹{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorites drawer */}
      {showFavorites && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="slide-in" style={{ width: '100%', maxWidth: '460px', height: '100%', backgroundColor: 'var(--bg-secondary)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', color: '#fff' }}>Bookmarked Destinations</h3>
              <button onClick={() => setShowFavorites(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {activeFavorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                No favorites bookmarked. Add them via search results.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeFavorites.map((dest) => (
                  <div 
                    key={dest.id}
                    className="premium-card"
                    style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      handleSelectDestination(dest);
                      setShowFavorites(false);
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{dest.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{dest.city}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="slide-in" style={{ width: '100%', maxWidth: '460px', height: '100%', backgroundColor: 'var(--bg-secondary)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', color: '#fff' }}>Platform Alerts</h3>
              <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((notif) => (
                <div key={notif.id} className="premium-card" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: notif.type === 'success' ? 'var(--color-accent)' : notif.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)' }}>
                      {notif.title}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{notif.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{notif.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPOSE CONTROLS TO APP.JSX HEADER BY CLONE ELEMENT OR STATE PASSING */}
      {/* We add small floating buttons on the search interface for these drawers */}
      {step === 'search' && (
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 10, display: 'flex', gap: '10px' }}>
          <button className="icon-button" onClick={() => setShowHistory(true)} title="Booking History">
            <Ticket size={18} />
          </button>
          <button className="icon-button" onClick={() => setShowFavorites(true)} title="Favorites">
            <Heart size={18} />
          </button>
          <button className="icon-button" onClick={() => setShowNotifications(true)} title="Notifications">
            <Bell size={18} />
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
