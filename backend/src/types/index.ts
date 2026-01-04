import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'admin' | 'technician';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  vehicles: IVehicle[];
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  fullName: string;
}

export interface IVehicle {
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
}

// Booking Types
export interface IBooking extends Document {
  _id: Types.ObjectId;
  bookingNumber: string;
  customer?: Types.ObjectId;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  service: {
    serviceId: string;
    name: string;
    price: number;
    estimatedDuration: number;
  };
  vehicle: IVehicle;
  appointment: {
    date: Date;
    timeSlot: string;
    endTime?: string;
    isMobileService: boolean;
  };
  location: {
    type: 'shop' | 'customer-location';
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    notes?: string;
  };
  status: BookingStatus;
  payment: {
    status: PaymentStatus;
    method: PaymentMethod;
    depositAmount: number;
    totalAmount: number;
    paidAmount: number;
    transactions: ITransaction[];
  };
  insurance?: {
    useInsurance: boolean;
    company?: string;
    policyNumber?: string;
    claimNumber?: string;
  };
  notes?: {
    customer?: string;
    internal?: string;
  };
  assignedTechnician?: Types.ObjectId;
  reminders: IReminder[];
  completionDetails?: {
    completedAt?: Date;
    technicianNotes?: string;
    partsUsed?: { name: string; partNumber: string; cost: number }[];
    beforePhotos?: string[];
    afterPhotos?: string[];
  };
  cancellation?: {
    cancelledAt?: Date;
    reason?: string;
    cancelledBy?: 'customer' | 'admin' | 'system';
    refundIssued?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  canCancel(): boolean;
  calculateRefund(): number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'pending' | 'deposit-paid' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'paypal' | 'card' | 'cash' | 'insurance';

export interface ITransaction {
  transactionId?: string;
  paypalOrderId?: string;
  amount: number;
  type: 'deposit' | 'full-payment' | 'refund';
  status: string;
  timestamp: Date;
}

export interface IReminder {
  type: 'email' | 'sms';
  sentAt?: Date;
  scheduledFor?: Date;
}

// Contact Types
export interface IContact extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  status: 'new' | 'read' | 'responded' | 'converted' | 'closed';
  source: 'website' | 'phone' | 'email' | 'referral' | 'other';
  assignedTo?: Types.ObjectId;
  responses: {
    message: string;
    respondedBy: Types.ObjectId;
    respondedAt: Date;
  }[];
  convertedToBooking?: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// BlockedSlot Types
export interface IBlockedSlot extends Document {
  _id: Types.ObjectId;
  date: Date;
  timeSlot?: string;
  reason: 'holiday' | 'maintenance' | 'staff-unavailable' | 'fully-booked' | 'other';
  description?: string;
  isAllDay: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface IService {
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

// Business Hours Types
export interface IBusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface IBusinessHoursConfig {
  monday: IBusinessHours;
  tuesday: IBusinessHours;
  wednesday: IBusinessHours;
  thursday: IBusinessHours;
  friday: IBusinessHours;
  saturday: IBusinessHours;
  sunday: IBusinessHours;
}

// Time Slot Types
export interface ITimeSlot {
  time: string;
  display: string;
}

export interface ITimeSlotConfig {
  slotDuration: number;
  bufferBetweenSlots: number;
  maxBookingsPerSlot: number;
  advanceBookingDays: number;
  minNoticeHours: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

// PayPal Types
export interface PayPalOrderDetails {
  amount: number;
  currency?: string;
  description?: string;
  bookingNumber: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayPalOrderResponse {
  orderId: string;
  status: string;
  approvalUrl?: string;
  links?: any[];
}

export interface PayPalCaptureResponse {
  orderId: string;
  status: string;
  transactionId?: string;
  amount: number;
  currency?: string;
  payerEmail?: string;
  payerName?: any;
}

// Express Request Extension
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}
