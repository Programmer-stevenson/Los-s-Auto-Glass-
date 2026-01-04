import mongoose, { Schema } from 'mongoose';
import { IContact } from '../types';

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service selection is required']
  },
  message: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'referral', 'other'],
    default: 'website'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  responses: [{
    message: String,
    respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date, default: Date.now }
  }],
  convertedToBooking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export default mongoose.model<IContact>('Contact', contactSchema);
