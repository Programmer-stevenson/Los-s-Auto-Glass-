import { IService, IBusinessHoursConfig, ITimeSlotConfig } from '../types';

export const services: IService[] = [
  {
    id: 'windshield',
    name: 'Windshield Replacement',
    description: 'Complete windshield replacement with high-quality glass and professional installation.',
    shortDescription: 'Full windshield replacement',
    basePrice: 199.99,
    estimatedDuration: 90,
    category: 'replacement',
    features: [
      'OEM and aftermarket glass options',
      'Same-day service available',
      'Lifetime warranty on installation',
      'Insurance claims assistance'
    ],
    popular: true
  },
  {
    id: 'repair',
    name: 'Auto Glass Repair',
    description: 'Expert repair services for chips and cracks to restore your windshield integrity.',
    shortDescription: 'Chip and crack repair',
    basePrice: 49.99,
    estimatedDuration: 30,
    category: 'repair',
    features: [
      'Quick 30-minute repairs',
      'Prevents crack spreading',
      'Maintains original factory seal',
      'Most insurance covers 100%'
    ],
    popular: true
  },
  {
    id: 'side-window',
    name: 'Side Window Replacement',
    description: 'Professional replacement of side door windows and vent glass.',
    shortDescription: 'Side window replacement',
    basePrice: 149.99,
    estimatedDuration: 60,
    category: 'replacement',
    features: [
      'All makes and models',
      'Factory-quality glass',
      'Proper sealing and installation',
      'Mobile service available'
    ],
    popular: false
  },
  {
    id: 'back-glass',
    name: 'Back Glass Replacement',
    description: 'Complete rear windshield replacement with defrost line integration.',
    shortDescription: 'Rear windshield replacement',
    basePrice: 249.99,
    estimatedDuration: 120,
    category: 'replacement',
    features: [
      'Heated rear glass available',
      'Antenna and defrost reconnection',
      'Perfect fit guarantee',
      'Competitive pricing'
    ],
    popular: false
  },
  {
    id: 'mirror',
    name: 'Mirror Replacement',
    description: 'Side mirror and rearview mirror replacement and repair services.',
    shortDescription: 'Mirror replacement & repair',
    basePrice: 79.99,
    estimatedDuration: 45,
    category: 'replacement',
    features: [
      'Heated mirror options',
      'Power mirror installation',
      'Glass and housing replacement',
      'Color-matched housings'
    ],
    popular: false
  },
  {
    id: 'auto-repair',
    name: 'General Auto Repair',
    description: 'Comprehensive auto repair services to keep your vehicle running smoothly.',
    shortDescription: 'General maintenance & repair',
    basePrice: 99.99,
    estimatedDuration: 120,
    category: 'repair',
    features: [
      'Diagnostic services',
      'Maintenance and tune-ups',
      'Brake services',
      'Engine repair'
    ],
    popular: false
  }
];

export const businessHours: IBusinessHoursConfig = {
  monday: { open: '08:00', close: '18:00', isOpen: true },
  tuesday: { open: '08:00', close: '18:00', isOpen: true },
  wednesday: { open: '08:00', close: '18:00', isOpen: true },
  thursday: { open: '08:00', close: '18:00', isOpen: true },
  friday: { open: '08:00', close: '18:00', isOpen: true },
  saturday: { open: '09:00', close: '16:00', isOpen: true },
  sunday: { open: '00:00', close: '00:00', isOpen: false }
};

export const timeSlotConfig: ITimeSlotConfig = {
  slotDuration: 30,
  bufferBetweenSlots: 15,
  maxBookingsPerSlot: 2,
  advanceBookingDays: 30,
  minNoticeHours: 2
};
