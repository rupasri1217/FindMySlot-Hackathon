export const mockDestinations = [
  {
    id: 'del-cp',
    name: 'Connaught Place (Block E), New Delhi',
    city: 'New Delhi',
    lat: 28.6304,
    lng: 77.2177,
    popular: true,
  },
  {
    id: 'blr-indiranagar',
    name: 'Indiranagar 100ft Road, Bengaluru',
    city: 'Bengaluru',
    lat: 12.9716,
    lng: 77.6412,
    popular: true,
  },
  {
    id: 'chn-tnagar',
    name: 'Pondy Bazaar, T-Nagar, Chennai',
    city: 'Chennai',
    lat: 13.0405,
    lng: 80.2337,
    popular: true,
  },
  {
    id: 'mum-bkc',
    name: 'Bandra Kurla Complex (BKC), Mumbai',
    city: 'Mumbai',
    lat: 19.0657,
    lng: 72.8687,
    popular: true,
  }
];

export const mockParkingLots = {
  'del-cp': [
    {
      id: 'parking-del-1',
      name: 'Palika Bazaar Underground Smart Hub',
      distance: '90m',
      walkingTime: 1.5,
      rating: 4.8,
      reviewsCount: 1120,
      safetyScore: 98,
      lat: 28.6315,
      lng: 77.2185,
      price2W: 15,
      price4W: 40,
      availabilityStatus: 'abundant', // 'abundant' | 'low' | 'full'
      available2W: 42,
      available4W: 18,
      amenities: ['CCTV Secured', 'EV Charging', 'Covered', 'Wheelchair Accessible'],
      slots: {
        '2W': [
          { id: '2W-A1', status: 'available', type: 'standard', floor: 'G' },
          { id: '2W-A2', status: 'occupied', type: 'standard', floor: 'G' },
          { id: '2W-A3', status: 'available', type: 'ev', floor: 'G' },
          { id: '2W-A4', status: 'reserved', type: 'standard', floor: 'G' },
          { id: '2W-A5', status: 'available', type: 'standard', floor: 'G' },
          { id: '2W-A6', status: 'occupied', type: 'standard', floor: 'G' }
        ],
        '4W': [
          { id: '4W-B1', status: 'available', type: 'standard', floor: 'G' },
          { id: '4W-B2', status: 'occupied', type: 'standard', floor: 'G' },
          { id: '4W-B3', status: 'available', type: 'ev', floor: 'G' },
          { id: '4W-B4', status: 'available', type: 'standard', floor: '1st' }
        ]
      }
    },
    {
      id: 'parking-del-2',
      name: 'CP Outer Circle Block-B Ground Lot',
      distance: '290m',
      walkingTime: 3.5,
      rating: 4.2,
      reviewsCount: 245,
      safetyScore: 89,
      lat: 28.6290,
      lng: 77.2195,
      price2W: 20,
      price4W: 50,
      availabilityStatus: 'low',
      available2W: 4,
      available4W: 2,
      amenities: ['CCTV Secured', 'Guard Patrolled'],
      slots: {
        '2W': [
          { id: '2W-B1', status: 'occupied', type: 'standard', floor: 'G' },
          { id: '2W-B2', status: 'available', type: 'standard', floor: 'G' }
        ],
        '4W': [
          { id: '4W-C1', status: 'occupied', type: 'standard', floor: 'G' },
          { id: '4W-C2', status: 'available', type: 'standard', floor: 'G' }
        ]
      }
    },
    {
      id: 'parking-del-3',
      name: 'Shivaji Stadium Transit Terminus',
      distance: '870m',
      walkingTime: 11, // Last-mile triggered!
      rating: 4.4,
      reviewsCount: 310,
      safetyScore: 94,
      lat: 28.6275,
      lng: 77.2140,
      price2W: 10,
      price4W: 25,
      availabilityStatus: 'abundant',
      available2W: 85,
      available4W: 40,
      amenities: ['EV Charging', 'Covered', 'Multi-level'],
      slots: {
        '2W': [
          { id: '2W-SS1', status: 'available', type: 'standard', floor: 'G' },
          { id: '2W-SS2', status: 'available', type: 'standard', floor: 'G' }
        ],
        '4W': [
          { id: '4W-SS1', status: 'available', type: 'standard', floor: 'G' }
        ]
      }
    }
  ],
  'blr-indiranagar': [
    {
      id: 'parking-blr-1',
      name: 'SlotReserve Indiranagar Multi-Level',
      distance: '120m',
      walkingTime: 1.5,
      rating: 4.9,
      reviewsCount: 412,
      safetyScore: 99,
      lat: 12.9722,
      lng: 77.6420,
      price2W: 20,
      price4W: 60,
      availabilityStatus: 'abundant',
      available2W: 30,
      available4W: 15,
      amenities: ['EV Charging', 'CCTV Secured', 'Valet Service'],
      slots: {
        '2W': [
          { id: '2W-I1', status: 'available', type: 'standard', floor: 'G' },
          { id: '2W-I2', status: 'available', type: 'ev', floor: 'G' }
        ],
        '4W': [
          { id: '4W-I1', status: 'occupied', type: 'standard', floor: 'G' },
          { id: '4W-I2', status: 'available', type: 'ev', floor: 'G' }
        ]
      }
    },
    {
      id: 'parking-blr-2',
      name: 'Indiranagar Metro Smart Lot',
      distance: '340m',
      walkingTime: 4,
      rating: 4.3,
      reviewsCount: 198,
      safetyScore: 92,
      lat: 12.9705,
      lng: 77.6398,
      price2W: 15,
      price4W: 40,
      availabilityStatus: 'low',
      available2W: 3,
      available4W: 1,
      amenities: ['Covered', 'CCTV Secured'],
      slots: {
        '2W': [
          { id: '2W-M1', status: 'available', type: 'standard', floor: 'G' }
        ],
        '4W': [
          { id: '4W-M1', status: 'available', type: 'standard', floor: 'G' }
        ]
      }
    }
  ]
};

export const lastMileProviders = [
  { id: 'rapido', name: 'Rapido Bike Taxi', eta: '3 mins', fare: 35, icon: 'bike', speed: 'Fastest in Traffic' },
  { id: 'ola', name: 'Ola Auto / Cab', eta: '5 mins', fare: 60, icon: 'car', speed: 'Comfortable' },
  { id: 'uber', name: 'Uber Moto / Go', eta: '4 mins', fare: 55, icon: 'car', speed: 'Reliable' }
];

export const gateOcrLogs = [
  { id: 1, plate: 'KA-03-HL-4821', slot: '2W-A3', time: '19:40', action: 'Entry Validated', status: 'Active' },
  { id: 2, plate: 'DL-3C-BY-9011', slot: '4W-B2', time: '19:25', action: 'Entry Validated', status: 'Active' },
  { id: 3, plate: 'MH-02-CD-5421', slot: '4W-B1', time: '18:10', action: 'Payment Verified', status: 'Completed' },
  { id: 4, plate: 'TN-09-AX-7712', slot: '2W-A1', time: '17:30', action: 'Manual Override', status: 'Completed' }
];

export const comparisonGridData = [
  { feature: 'Destination-First Search ("Where are you going?")', findMySlot: true, traditionalApps: false },
  { feature: 'Two-Wheeler Equality & First-Class 2W Pricing', findMySlot: true, traditionalApps: false },
  { feature: 'Turn-by-Turn Indoor Slot Bay Navigation', findMySlot: true, traditionalApps: false },
  { feature: 'Integrated Last-Mile Rideshare Bridge (Rapido/Ola)', findMySlot: true, traditionalApps: false },
  { feature: 'Instant UPI Payment & Scannable QR Pass', findMySlot: true, traditionalApps: 'Partial' },
  { feature: 'Live Operator OCR License Plate Reader Feed', findMySlot: true, traditionalApps: false }
];
