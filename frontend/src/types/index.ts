export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'admin' | 'technician';
  vehicles?: Vehicle[];
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  estimatedDuration: number;
  category: 'replacement' | 'repair';
  features: string[];
  popular: boolean;
}

export interface TimeSlot {
  time: string;
  display: string;
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  service: {
    serviceId: string;
    name: string;
    price: number;
    estimatedDuration: number;
  };
  vehicle: Vehicle;
  appointment: {
    date: string;
    timeSlot: string;
    isMobileService: boolean;
  };
  status: BookingStatus;
  payment: {
    status: PaymentStatus;
    totalAmount: number;
    paidAmount: number;
  };
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'pending' | 'deposit-paid' | 'paid' | 'refunded' | 'failed';

export interface CalendarDay {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  businessHours: string;
  availableSlots?: number;
  totalSlots?: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface BookingForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceId: string;
  vehicle: Vehicle;
  appointmentDate: string;
  timeSlot: string;
  isMobileService: boolean;
  location?: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    notes?: string;
  };
  notes?: string;
  useInsurance?: boolean;
  insuranceInfo?: {
    company?: string;
    policyNumber?: string;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
