import mongoose, { Schema } from 'mongoose';
import { IBlockedSlot } from '../types';

const blockedSlotSchema = new Schema<IBlockedSlot>({
  date: {
    type: Date,
    required: true
  },
  timeSlot: String,
  reason: {
    type: String,
    enum: ['holiday', 'maintenance', 'staff-unavailable', 'fully-booked', 'other'],
    default: 'other'
  },
  description: String,
  isAllDay: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

blockedSlotSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.model<IBlockedSlot>('BlockedSlot', blockedSlotSchema);
