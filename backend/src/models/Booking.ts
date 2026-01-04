import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IBooking } from '../types';

const bookingSchema = new Schema<IBooking>({
  bookingNumber: {
    type: String,
    unique: true,
    default: () => `LAG-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 4).toUpperCase()}`
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  guestInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  service: {
    serviceId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedDuration: Number
  },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: String,
    licensePlate: String,
    color: String
  },
  appointment: {
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    endTime: String,
    isMobileService: { type: Boolean, default: false }
  },
  location: {
    type: { type: String, enum: ['shop', 'customer-location'], default: 'shop' },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    notes: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'deposit-paid', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['paypal', 'card', 'cash', 'insurance'],
      default: 'paypal'
    },
    depositAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    transactions: [{
      transactionId: String,
      paypalOrderId: String,
      amount: Number,
      type: { type: String, enum: ['deposit', 'full-payment', 'refund'] },
      status: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  insurance: {
    useInsurance: { type: Boolean, default: false },
    company: String,
    policyNumber: String,
    claimNumber: String
  },
  notes: {
    customer: String,
    internal: String
  },
  assignedTechnician: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reminders: [{
    type: { type: String, enum: ['email', 'sms'] },
    sentAt: Date,
    scheduledFor: Date
  }],
  completionDetails: {
    completedAt: Date,
    technicianNotes: String,
    partsUsed: [{
      name: String,
      partNumber: String,
      cost: Number
    }],
    beforePhotos: [String],
    afterPhotos: [String]
  },
  cancellation: {
    cancelledAt: Date,
    reason: String,
    cancelledBy: { type: String, enum: ['customer', 'admin', 'system'] },
    refundIssued: Boolean
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ 'appointment.date': 1, 'appointment.timeSlot': 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ 'guestInfo.email': 1 });

// Check if booking can be cancelled
bookingSchema.methods.canCancel = function(): boolean {
  const now = new Date();
  const appointmentDate = new Date(this.appointment.date);
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 24 && ['pending', 'confirmed'].includes(this.status);
};

// Calculate refund amount
bookingSchema.methods.calculateRefund = function(): number {
  const now = new Date();
  const appointmentDate = new Date(this.appointment.date);
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilAppointment >= 48) {
    return this.payment.paidAmount;
  } else if (hoursUntilAppointment >= 24) {
    return this.payment.paidAmount * 0.5;
  }
  return 0;
};

export default mongoose.model<IBooking>('Booking', bookingSchema);
