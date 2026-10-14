import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Grid,
  CircleDollarSign,
  ClipboardList,
  Users,
  TrendingUp,
  Bell,
  Check,
  Ban,
  Search,
  UserCheck,
  RefreshCw,
  Layers,
  BatteryCharging,
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';

export default function OperatorApp() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'slots' | 'revenue' | 'bookings'
  const [selectedFloor, setSelectedFloor] = useState('G');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [searchPlate, setSearchPlate] = useState('');
  const [notificationLog, setNotificationLog] = useState([
    { id: 1, text: 'Auto-Gate reader validated entry: KA-03-HL-4821', time: '2 mins ago', type: 'info' },
    { id: 2, text: 'Warning: Slot 4W-B1 overstay limit exceeded', time: '15 mins ago', type: 'warning' },
    { id: 3, text: 'Slot 2W-A8 registered EV charging request', time: '1 hr ago', type: 'success' }
  ]);

  // Mock slot data that the operator can modify in-memory
  const [operatorSlots, setOperatorSlots] = useState({
    'G': [
      { id: '2W-A1', status: 'available', type: 'standard', vehicle: '' },
      { id: '2W-A2', status: 'occupied', type: 'standard', vehicle: 'KA-51-EF-9210' },
      { id: '2W-A3', status: 'available', type: 'ev', vehicle: '' },
      { id: '2W-A4', status: 'reserved', type: 'standard', vehicle: 'DL-4C-ZA-1100' },
      { id: '2W-A5', status: 'available', type: 'standard', vehicle: '' },
      { id: '4W-B1', status: 'occupied', type: 'standard', vehicle: 'MH-02-CD-5421' },
      { id: '4W-B2', status: 'available', type: 'ev', vehicle: '' },
      { id: '4W-B3', status: 'available', type: 'standard', vehicle: '' },
      { id: '4W-B4', status: 'occupied', type: 'standard', vehicle: 'KA-03-MY-8800' },
      { id: '4W-B5', status: 'blocked', type: 'standard', vehicle: 'Maintenance' }
    ],
    'B1': [
      { id: '2W-B1', status: 'occupied', type: 'standard', vehicle: 'DL-8C-HH-3311' },
      { id: '2W-B2', status: 'available', type: 'standard', vehicle: '' },
      { id: '2W-B3', status: 'available', type: 'ev', vehicle: '' },
      { id: '4W-C1', status: 'occupied', type: 'standard', vehicle: 'HR-26-AB-9898' },
      { id: '4W-C2', status: 'available', type: 'standard', vehicle: '' }
    ]
  });

  const [activeBookings, setActiveBookings] = useState([
    { id: 'BK-991', plate: 'KA-03-HL-4821', slot: '2W-A3', name: 'Rohan Sharma', inTime: '19:12', status: 'Active' },
    { id: 'BK-988', plate: 'DL-3C-BY-9011', slot: '4W-B2', name: 'Priya Patel', inTime: '18:45', status: 'Active' },
    { id: 'BK-980', plate: 'MH-02-CD-5421', slot: '4W-B1', name: 'Amit Verma', inTime: '15:20', status: 'Active' }
  ]);

  // Toggle slot status (Available <-> Blocked)
  const toggleBlockSlot = (floor, id) => {
    setOperatorSlots(prev => {
      const updatedFloor = prev[floor].map(slot => {
        if (slot.id === id) {
          const newStatus = slot.status === 'blocked' ? 'available' : 'blocked';
          return { ...slot, status: newStatus, vehicle: newStatus === 'blocked' ? 'Blocked by Operator' : '' };
        }
        return slot;
      });
      return { ...prev, [floor]: updatedFloor };
    });
  };

  // Check In validation from operator UI
  const handleCheckIn = (plateNum, slotId) => {
    if (!plateNum || !slotId) return;
    
    // Add to bookings list
    const newBk = {
      id: `BK-${Math.floor(100 + Math.random() * 900)}`,
      plate: plateNum.toUpperCase(),
      slot: slotId,
      name: 'Walk-in Driver',
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active'
    };

    setActiveBookings(prev => [newBk, ...prev]);

    // Mark slot occupied
    setOperatorSlots(prev => {
      const floors = Object.keys(prev);
      const updated = { ...prev };
      floors.forEach(f => {
        updated[f] = prev[f].map(slot => {
          if (slot.id === slotId) {
            return { ...slot, status: 'occupied', vehicle: plateNum.toUpperCase() };
          }
          return slot;
        });
      });
      return updated;
    });

    setNotificationLog(prev => [
      { id: Date.now(), text: `Manual Check-In: ${plateNum.toUpperCase()} registered at ${slotId}`, time: 'Just now', type: 'success' },
      ...prev
    ]);

    setSearchPlate('');
  };

  // Check Out validation
  const handleCheckOut = (bookingId) => {
    const targetBk = activeBookings.find(b => b.id === bookingId);
    if (!targetBk) return;

    // Remove from active list
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));

    // Release slot
    setOperatorSlots(prev => {
      const floors = Object.keys(prev);
      const updated = { ...prev };
      floors.forEach(f => {
        updated[f] = prev[f].map(slot => {
          if (slot.id === targetBk.slot) {
            return { ...slot, status: 'available', vehicle: '' };
          }
          return slot;
        });
      });
      return updated;
    });

    setNotificationLog(prev => [
      { id: Date.now(), text: `Check-Out validated: ${targetBk.plate} released slot ${targetBk.slot}`, time: 'Just now', type: 'info' },
      ...prev
    ]);
  };

  // Occupancy metrics calculations
  const occupancyStats = useMemo(() => {
    let total = 0;
    let occupied = 0;
    let reserved = 0;
    let blocked = 0;

    Object.values(operatorSlots).forEach(floorSlots => {
      floorSlots.forEach(s => {
        total++;
        if (s.status === 'occupied') occupied++;
        else if (s.status === 'reserved') reserved++;
        else if (s.status === 'blocked') blocked++;
      });
    });

    const rate = Math.round(((occupied + reserved) / total) * 100);
    return { total, occupied, reserved, blocked, rate };
  }, [operatorSlots]);

  return (
    <div className="main-content" style={{ flexDirection: 'row' }}>
      
      {/* 1. SIDE NAVIGATION MENU */}
      <div style={{ width: '260px', height: '100%', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: '800', letterSpacing: '0.05em' }}>
            OPERATOR DASHBOARD
          </span>
          <h3 style={{ fontSize: '18px', color: '#fff', marginTop: '4px' }}>Connaught Place Block E</h3>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button 
            className={`role-btn ${activeTab === 'dashboard' ? 'active operator-role' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ justifyContent: 'flex-start', width: '100%', border: 'none', borderRadius: '8px', padding: '12px 16px' }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>
          <button 
            className={`role-btn ${activeTab === 'slots' ? 'active operator-role' : ''}`}
            onClick={() => setActiveTab('slots')}
            style={{ justifyContent: 'flex-start', width: '100%', border: 'none', borderRadius: '8px', padding: '12px 16px' }}
          >
            <Grid size={18} />
            <span>Slot Control Room</span>
          </button>
          <button 
            className={`role-btn ${activeTab === 'revenue' ? 'active operator-role' : ''}`}
            onClick={() => setActiveTab('revenue')}
            style={{ justifyContent: 'flex-start', width: '100%', border: 'none', borderRadius: '8px', padding: '12px 16px' }}
          >
            <CircleDollarSign size={18} />
            <span>Revenue adjustor</span>
          </button>
          <button 
            className={`role-btn ${activeTab === 'bookings' ? 'active operator-role' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={{ justifyContent: 'flex-start', width: '100%', border: 'none', borderRadius: '8px', padding: '12px 16px' }}
          >
            <ClipboardList size={18} />
            <span>Booking Validations</span>
          </button>
        </nav>

        {/* Info label about Indian Vahan Portal integration */}
        <div style={{ marginTop: 'auto', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
          <Info size={14} style={{ marginBottom: '6px', color: 'var(--color-primary)' }} />
          Connected to local OCR gate camera feed for automated Vahan plate readings.
        </div>
      </div>

      {/* 2. MAIN WORKING REGION */}
      <div className="operator-main">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="slide-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#fff' }}>Analytics Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time statistics for slot occupancy and operations</p>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '13px', padding: '8px 16px' }}
                onClick={() => {
                  setNotificationLog(prev => [
                    { id: Date.now(), text: 'Forced OCR scan recalculation across G and B1 floors.', time: 'Just now', type: 'info' },
                    ...prev
                  ]);
                }}
              >
                <RefreshCw size={14} /> Re-scan Sensors
              </button>
            </div>

            {/* Metric counters */}
            <div className="operator-grid" style={{ padding: 0, marginBottom: '24px' }}>
              <div className="premium-card stat-card">
                <div className="stat-header">
                  <span>Occupancy Level</span>
                  <Layers size={18} color="var(--color-primary)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="stat-value">{occupancyStats.rate}%</span>
                  <span className="stat-trend trend-up">
                    <ArrowUpRight size={12} /> Live
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {occupancyStats.occupied + occupancyStats.reserved} of {occupancyStats.total} slots occupied
                </p>
              </div>

              <div className="premium-card stat-card">
                <div className="stat-header">
                  <span>Today's Earnings</span>
                  <CircleDollarSign size={18} color="var(--color-accent)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="stat-value">₹9,450</span>
                  <span className="stat-trend trend-up">+14%</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Peak pricing multiplier: {surgeMultiplier}x
                </p>
              </div>

              <div className="premium-card stat-card">
                <div className="stat-header">
                  <span>Active Two-Wheelers</span>
                  <Users size={18} color="var(--color-warning)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="stat-value">24</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bays active</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  15 EV chargers active
                </p>
              </div>

              <div className="premium-card stat-card">
                <div className="stat-header">
                  <span>Open Alerts</span>
                  <Bell size={18} color="var(--color-danger)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="stat-value">{notificationLog.filter(n => n.type === 'warning').length}</span>
                  <span className="stat-trend trend-down" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)' }}>
                    Attention
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Overstay sensors triggered
                </p>
              </div>
            </div>

            {/* Charts & Feed Columns */}
            <div className="operator-row">
              {/* Hourly analytics bar chart simulation */}
              <div className="premium-card">
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>Peak Occupancy Rates (Hourly Track)</h3>
                
                <div className="chart-sim-container">
                  {/* Bars representing hourly rates */}
                  <div className="chart-bar-col">
                    <div className="chart-bar" style={{ height: '30%' }}>
                      <div className="chart-tooltip">30%</div>
                    </div>
                    <span className="chart-label">08:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar" style={{ height: '55%' }}>
                      <div className="chart-tooltip">55%</div>
                    </div>
                    <span className="chart-label">10:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar secondary-bar" style={{ height: '80%' }}>
                      <div className="chart-tooltip">80% Peak</div>
                    </div>
                    <span className="chart-label">12:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar secondary-bar" style={{ height: '90%' }}>
                      <div className="chart-tooltip">90% Peak</div>
                    </div>
                    <span className="chart-label">14:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar" style={{ height: '70%' }}>
                      <div className="chart-tooltip">70%</div>
                    </div>
                    <span className="chart-label">16:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar" style={{ height: '85%' }}>
                      <div className="chart-tooltip">85%</div>
                    </div>
                    <span className="chart-label">18:00</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar" style={{ height: '40%' }}>
                      <div className="chart-tooltip">40%</div>
                    </div>
                    <span className="chart-label">20:00</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '12px', justifyContent: 'center' }}>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <span>Off-Peak hours</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: 'var(--color-accent)' }} />
                    <span>Surge/Peak Interval</span>
                  </div>
                </div>
              </div>

              {/* Feed logs */}
              <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>Gate Operations Feed</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                  {notificationLog.map((log) => (
                    <div key={log.id} style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: log.type === 'success' ? 'var(--color-accent)' : log.type === 'warning' ? 'var(--color-danger)' : 'var(--color-primary)',
                        marginTop: '5px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff' }}>{log.text}</p>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SLOT CONTROL ROOM */}
        {activeTab === 'slots' && (
          <div className="slide-in">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', color: '#fff' }}>Slot Control Room</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manually override slot statuses, block bays for repairs, and inspect sensors</p>
            </div>

            {/* Floor selector options */}
            <div className="floor-tabs" style={{ marginBottom: '20px' }}>
              <button 
                className={`floor-tab ${selectedFloor === 'G' ? 'active' : ''}`}
                onClick={() => setSelectedFloor('G')}
              >
                Ground Level (G)
              </button>
              <button 
                className={`floor-tab ${selectedFloor === 'B1' ? 'active' : ''}`}
                onClick={() => setSelectedFloor('B1')}
              >
                Basement level (B1)
              </button>
            </div>

            {/* Admin visual slot layout */}
            <div className="premium-card">
              <div className="legend-container" style={{ marginBottom: '20px' }}>
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
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: 'var(--text-muted)' }}></div>
                  <span>Blocked / Out of service</span>
                </div>
              </div>

              {/* Grid map */}
              <div className="slot-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                {operatorSlots[selectedFloor].map((slot) => {
                  let slotColor = 'var(--bg-secondary)';
                  let stroke = 'var(--border-color)';
                  
                  if (slot.status === 'available') {
                    slotColor = 'rgba(16, 185, 129, 0.05)';
                    stroke = 'var(--color-accent)';
                  } else if (slot.status === 'occupied') {
                    slotColor = 'rgba(239, 68, 68, 0.08)';
                    stroke = 'var(--color-danger)';
                  } else if (slot.status === 'reserved') {
                    slotColor = 'rgba(245, 158, 11, 0.08)';
                    stroke = 'var(--color-warning)';
                  } else if (slot.status === 'blocked') {
                    slotColor = 'rgba(100, 116, 139, 0.15)';
                    stroke = 'var(--text-muted)';
                  }

                  return (
                    <div 
                      key={slot.id}
                      className="premium-card"
                      style={{ 
                        padding: '16px 12px', 
                        borderColor: stroke, 
                        backgroundColor: slotColor,
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '6px',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{slot.id}</span>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          {slot.type}
                        </span>
                      </div>

                      {/* Display vehicle plate or state */}
                      <span style={{ fontSize: '11px', color: slot.vehicle ? '#fff' : 'var(--text-muted)', fontWeight: slot.vehicle ? '700' : '400', whiteSpace: 'nowrap' }}>
                        {slot.vehicle || 'Empty'}
                      </span>

                      {/* Action buttons */}
                      <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px', display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn" 
                          style={{ flex: 1, padding: '4px 0', fontSize: '10px', backgroundColor: 'var(--bg-primary)' }}
                          onClick={() => toggleBlockSlot(selectedFloor, slot.id)}
                        >
                          {slot.status === 'blocked' ? 'Unlock' : 'Block'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVENUE ADJUSTER */}
        {activeTab === 'revenue' && (
          <div className="slide-in">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', color: '#fff' }}>Smart Revenue & Surge Pricing</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Adjust parking price scaling based on peak metro demand and congestion</p>
            </div>

            <div className="operator-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              
              {/* Surge multiplier adjustment */}
              <div className="premium-card">
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Peak Surge Control</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Congestion in Connaught Place is currently <strong>High (84%)</strong>. Surge pricing will automatically scale user checkouts.
                </p>

                <div className="form-group" style={{ padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '700' }}>Active Pricing Multiplier</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-accent)' }}>
                      {surgeMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="2.5" 
                    step="0.1" 
                    value={surgeMultiplier} 
                    onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    <span>1.0x (Standard)</span>
                    <span>1.5x (Peak)</span>
                    <span>2.5x (Extreme Surge)</span>
                  </div>
                </div>

                {/* Surge Impact Simulation */}
                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>Estimated Rates Summary</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Two-Wheeler Standard</span>
                    <span style={{ fontWeight: '700', color: '#fff' }}>₹15/hr → <span style={{ color: 'var(--color-accent)' }}>₹{Math.round(15 * surgeMultiplier)}/hr</span></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Four-Wheeler Standard</span>
                    <span style={{ fontWeight: '700', color: '#fff' }}>₹40/hr → <span style={{ color: 'var(--color-accent)' }}>₹{Math.round(40 * surgeMultiplier)}/hr</span></span>
                  </div>
                </div>
              </div>

              {/* Congestion trends widget */}
              <div className="premium-card">
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Revenue Projections Today</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Surge adjustments are calculated based on these active projections.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span>Hourly Yield Target</span>
                      <span style={{ fontWeight: '700' }}>₹1,200 / hr</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span>Average Parking Duration</span>
                      <span style={{ fontWeight: '700' }}>2.4 Hours</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', backgroundColor: 'var(--color-accent)', width: '60%' }}></div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>REVENUE</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>₹3,45,200</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-accent)', display: 'block' }}>+12.4% MoM</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>USER RATINGS</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-warning)' }}>4.6★</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>3.2k reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING VALIDATIONS */}
        {activeTab === 'bookings' && (
          <div className="slide-in">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', color: '#fff' }}>Booking Validations</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manually check-in walk-in vehicles or manage check-out logs and billing</p>
            </div>

            <div className="operator-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
              {/* Check-In form panel */}
              <div className="premium-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Manual Gate Entrance</h3>
                
                <div className="form-group">
                  <label className="form-label">License Plate Number</label>
                  <div className="input-container">
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '16px' }}
                      value={searchPlate}
                      onChange={(e) => setSearchPlate(e.target.value)}
                      placeholder="e.g. DL-3C-AS-4512"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Available Slot</label>
                  <select 
                    id="assign-slot-select"
                    className="form-input" 
                    style={{ paddingLeft: '16px', background: 'var(--bg-secondary)' }}
                  >
                    <option value="2W-A1">2W-A1 (Ground Floor)</option>
                    <option value="2W-A3">2W-A3 (Ground EV)</option>
                    <option value="4W-B2">4W-B2 (Ground EV)</option>
                    <option value="4W-B3">4W-B3 (Ground Floor)</option>
                    <option value="2W-B2">2W-B2 (Basement B1)</option>
                  </select>
                </div>

                <button 
                  className="btn btn-accent" 
                  style={{ width: '100%' }}
                  disabled={!searchPlate}
                  onClick={() => {
                    const selectedSlotVal = document.getElementById('assign-slot-select').value;
                    handleCheckIn(searchPlate, selectedSlotVal);
                  }}
                >
                  Verify & Register Check-In
                </button>
              </div>

              {/* Active Bookings Feed list */}
              <div className="premium-card">
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px' }}>Active Parking Logs</h3>
                
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Plate Number</th>
                        <th>Assigned Slot</th>
                        <th>Driver / Phone</th>
                        <th>In Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBookings.map((b) => (
                        <tr key={b.id}>
                          <td style={{ fontWeight: '700' }}>{b.id}</td>
                          <td style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{b.plate}</td>
                          <td style={{ fontWeight: '700' }}>{b.slot}</td>
                          <td>{b.name}</td>
                          <td>{b.inTime}</td>
                          <td>
                            <span className="status-pill active">Parked</span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                              onClick={() => handleCheckOut(b.id)}
                            >
                              Check-Out
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
