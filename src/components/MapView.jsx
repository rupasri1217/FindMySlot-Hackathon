import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapView({ 
  destination, 
  userOrigin = { name: 'Hauz Khas Social, New Delhi', lat: 28.5494, lng: 77.2001 },
  parkingLots = [], 
  selectedLot, 
  onSelectLot, 
  vehicleType = '2W',
  isDarkMode = false,
  navStep = 'discovery', // 'discovery' | 'slots' | 'payment' | 'outdoor_nav' | 'indoor_nav' | 'ticket'
  selectedSlot = null
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = destination ? destination.lat : 28.6315;
      const initialLng = destination ? destination.lng : 77.2197;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        zoomControl: false
      });

      // Tile URLs
      const tileUrl = isDarkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Handle Tile Theme Switch (Light vs Dark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDarkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
  }, [isDarkMode]);

  // Center update
  useEffect(() => {
    if (!mapInstanceRef.current || !destination) return;
    if (navStep === 'outdoor_nav') {
      // Zoom out to fit route from Hauz Khas to CP
      mapInstanceRef.current.fitBounds([
        [userOrigin.lat, userOrigin.lng],
        [destination.lat, destination.lng]
      ], { padding: [50, 50] });
    } else {
      mapInstanceRef.current.flyTo([destination.lat, destination.lng], 15, { duration: 1 });
    }
  }, [destination, navStep]);

  // Markers Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // 1. User Origin Marker (Hauz Khas Social)
    if (userOrigin && navStep === 'outdoor_nav') {
      const originIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white font-extrabold text-xs shadow-lg">
              START
            </div>
            <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              Hauz Khas Social
            </div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25]
      });

      const originMarker = L.marker([userOrigin.lat, userOrigin.lng], { icon: originIcon }).addTo(map);
      markersRef.current.push(originMarker);
    }

    // 2. Destination Marker (Connaught Place)
    if (destination) {
      const destIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white font-black shadow-lg">
              ★
            </div>
            <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              Destination: CP Block E
            </div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25]
      });

      const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(map);
      markersRef.current.push(destMarker);
    }

    // 3. Parking Lots Markers
    parkingLots.forEach((lot) => {
      const isSelected = selectedLot?.id === lot.id;
      const price = vehicleType === '2W' ? lot.price2W : lot.price4W;

      let badgeClass = 'badge-abundant';
      if (lot.availabilityStatus === 'low') badgeClass = 'badge-low';
      if (lot.availabilityStatus === 'full') badgeClass = 'badge-full';

      const lotIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="map-price-badge ${badgeClass} ${isSelected ? 'scale-125 ring-2 ring-indigo-500' : ''}">
            <span>P</span>
            <span>₹${price}/hr</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const lotMarker = L.marker([lot.lat, lot.lng], { icon: lotIcon }).addTo(map);
      lotMarker.on('click', () => onSelectLot(lot));
      markersRef.current.push(lotMarker);
    });

  }, [destination, userOrigin, parkingLots, selectedLot, vehicleType, navStep]);

  // Route polyline rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (navStep === 'outdoor_nav' && userOrigin && selectedLot) {
      // Outdoor route: Hauz Khas -> Parking Entrance
      const routePoints = [
        [userOrigin.lat, userOrigin.lng],
        [28.5800, 77.2100], // intermediate waypoint
        [selectedLot.lat, selectedLot.lng]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#4F46E5',
        weight: 6,
        dashArray: '10, 8',
        lineCap: 'round'
      }).addTo(map);

      polylineRef.current = polyline;
    } else if (destination && selectedLot) {
      const routePoints = [
        [destination.lat, destination.lng],
        [selectedLot.lat, selectedLot.lng]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#10B981',
        weight: 4,
        dashArray: '6, 6',
        lineCap: 'round'
      }).addTo(map);

      polylineRef.current = polyline;
    }
  }, [destination, userOrigin, selectedLot, navStep]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapRef} className="w-full h-full" />

      {/* INDOOR BLUEPRINT OVERLAY WHEN IN INDOOR NAV STEP */}
      {navStep === 'indoor_nav' && selectedSlot && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-white border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Indoor Vector Guidance</span>
              <h4 className="font-heading font-extrabold text-lg">Palika Underground Ramp Level B1</h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
              Target Slot: {selectedSlot.id}
            </span>
          </div>

          {/* Indoor Blueprint Vector Canvas */}
          <svg viewBox="0 0 600 350" className="w-full h-auto my-auto max-h-[300px]">
            {/* Garage Outline */}
            <rect width="600" height="350" fill="#0F172A" stroke="#334155" strokeWidth="4" rx="16" />
            
            {/* Driving Lanes */}
            <line x1="80" y1="40" x2="80" y2="310" stroke="#1E293B" strokeWidth="30" strokeDasharray="10,10" />
            <line x1="300" y1="40" x2="300" y2="310" stroke="#1E293B" strokeWidth="30" strokeDasharray="10,10" />
            <line x1="80" y1="175" x2="520" y2="175" stroke="#1E293B" strokeWidth="30" strokeDasharray="10,10" />

            {/* Pillar B2 Landmark */}
            <rect x="270" y="150" width="60" height="50" fill="#334155" rx="8" />
            <text x="300" y="180" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">Pillar B2</text>

            {/* Parking Slots */}
            <rect x="20" y="60" width="40" height="35" fill="none" stroke="#475569" strokeWidth="2" rx="4" />
            <text x="40" y="82" fill="#64748b" fontSize="9" textAnchor="middle">2W-A1</text>
            
            <rect x="20" y="110" width="40" height="35" fill="none" stroke="#475569" strokeWidth="2" rx="4" />
            <text x="40" y="132" fill="#64748b" fontSize="9" textAnchor="middle">2W-A2</text>

            {/* TARGET RESERVED SLOT (HIGHLIGHTED INDIGO) */}
            <rect x="20" y="240" width="40" height="35" fill="rgba(79, 70, 229, 0.3)" stroke="#4F46E5" strokeWidth="3" rx="4" />
            <text x="40" y="262" fill="#818CF8" fontSize="10" fontWeight="bold" textAnchor="middle">2W-A3</text>
            <circle cx="40" cy="257" r="14" fill="none" stroke="#4F46E5" strokeWidth="2" className="animate-ping" />

            {/* Entry Gate */}
            <rect x="510" y="150" width="70" height="50" fill="#1E293B" stroke="#10B981" strokeWidth="2" rx="6" />
            <text x="545" y="180" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">GATE 2 IN</text>

            {/* Animated Indoor Route Path (Gate -> Pillar B2 -> Slot 2W-A3) */}
            <path 
              d="M 510,175 L 300,175 L 300,257 L 65,257" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="4" 
              strokeDasharray="8,6"
              className="animate-pulse" 
            />
            <circle cx="300" cy="175" r="7" fill="#10B981" />
          </svg>

          <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
            Follow green guide line from Gate 2 → Pillar B2 → Park in Reserved Slot 2W-A3
          </div>
        </div>
      )}
    </div>
  );
}
