import { businessHours, timeSlotConfig } from '../config/services';
import Booking from '../models/Booking';
import BlockedSlot from '../models/BlockedSlot';
import { ITimeSlot, IBusinessHoursConfig } from '../types';

class CalendarService {
  private getDayName(date: Date): keyof IBusinessHoursConfig {
    const days: (keyof IBusinessHoursConfig)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  generateTimeSlots(date: Date): ITimeSlot[] {
    const dayName = this.getDayName(date);
    const hours = businessHours[dayName];
    
    if (!hours || !hours.isOpen) {
      return [];
    }

    const slots: ITimeSlot[] = [];
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    let currentTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    while (currentTime < closeTime) {
      const hour = Math.floor(currentTime / 60);
      const minute = currentTime % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      slots.push({
        time: timeString,
        display: this.formatTimeDisplay(timeString)
      });

      currentTime += timeSlotConfig.slotDuration;
    }

    return slots;
  }

  formatTimeDisplay(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  async getAvailableSlots(date: Date | string): Promise<ITimeSlot[]> {
    // Parse date string properly to avoid timezone issues
    let targetDate: Date;
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return [];
    }

    const now = new Date();
    const minNoticeTime = new Date(now.getTime() + timeSlotConfig.minNoticeHours * 60 * 60 * 1000);

    const allSlots = this.generateTimeSlots(targetDate);

    const blockedSlots = await BlockedSlot.find({
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const dayBlocked = blockedSlots.some(slot => slot.isAllDay);
    if (dayBlocked) {
      return [];
    }

    const blockedTimes = blockedSlots.map(slot => slot.timeSlot).filter(Boolean) as string[];

    const existingBookings = await Booking.find({
      'appointment.date': {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    const bookingCounts: Record<string, number> = {};
    existingBookings.forEach(booking => {
      const slot = booking.appointment.timeSlot;
      bookingCounts[slot] = (bookingCounts[slot] || 0) + 1;
    });

    const availableSlots = allSlots.filter(slot => {
      if (blockedTimes.includes(slot.time)) {
        return false;
      }

      const count = bookingCounts[slot.time] || 0;
      if (count >= timeSlotConfig.maxBookingsPerSlot) {
        return false;
      }

      if (targetDate.getTime() === today.getTime()) {
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotTime = new Date(targetDate);
        slotTime.setHours(hours, minutes, 0, 0);
        
        if (slotTime <= minNoticeTime) {
          return false;
        }
      }

      return true;
    });

    return availableSlots;
  }

  async getCalendarOverview(startDate: Date | string, endDate: Date | string): Promise<any[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const calendar: any[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayName = this.getDayName(currentDate);
      const hours = businessHours[dayName];
      
      const dayInfo: any = {
        date: currentDate.toISOString().split('T')[0],
        dayOfWeek: dayName,
        isOpen: hours?.isOpen || false,
        businessHours: hours ? `${hours.open} - ${hours.close}` : 'Closed'
      };

      if (dayInfo.isOpen) {
        const availableSlots = await this.getAvailableSlots(currentDate);
        dayInfo.availableSlots = availableSlots.length;
        dayInfo.totalSlots = this.generateTimeSlots(currentDate).length;
      }

      calendar.push(dayInfo);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }

  async isSlotAvailable(date: Date | string, timeSlot: string): Promise<boolean> {
    const slots = await this.getAvailableSlots(date);
    return slots.some(slot => slot.time === timeSlot);
  }

  async getBookingsForDate(date: Date | string): Promise<any[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return await Booking.find({
      'appointment.date': {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    })
    .sort({ 'appointment.timeSlot': 1 })
    .populate('customer', 'firstName lastName email phone')
    .lean();
  }
}

export default new CalendarService();
