'use client';

// ============================================
// ADMIN CALENDAR PAGE - /admin/calendar
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiClock, FiX,
  FiCalendar, FiPlus, FiTrash2
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BookingSlot {
  _id: string;
  bookingNumber: string;
  guestInfo?: { firstName: string; lastName: string };
  service: { name: string };
  appointment: { timeSlot: string };
  status: string;
}

interface BlockedSlot {
  _id: string;
  date: string;
  timeSlot?: string;
  reason: string;
  isAllDay: boolean;
}

interface DayData {
  date: Date;
  bookings: BookingSlot[];
  blockedSlots: BlockedSlot[];
  isToday: boolean;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const formatTime = (time24: string) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default function AdminCalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockAllDay, setBlockAllDay] = useState(false);

  useEffect(() => {
    loadWeekData();
  }, [currentWeek]);

  const loadWeekData = async () => {
    setLoading(true);
    try {
      const days: DayData[] = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeek, i);
        const dateStr = format(date, 'yyyy-MM-dd');

        // Get bookings for this day
        const bookingsRes = await fetch(`${API_URL}/admin/bookings?date=${dateStr}`);
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };

        // Get blocked slots for this day (would need to implement this endpoint)
        days.push({
          date,
          bookings: bookingsData.bookings || [],
          blockedSlots: [],
          isToday: isSameDay(date, today)
        });
      }

      setWeekData(days);
    } catch (error) {
      console.error('Failed to load calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async () => {
    if (!blockDate) {
      toast.error('Please select a date');
      return;
    }

    try {
      // This would call your block slot API
      toast.success('Time slot blocked');
      setShowBlockModal(false);
      setBlockDate('');
      setBlockTime('');
      setBlockReason('');
      setBlockAllDay(false);
      loadWeekData();
    } catch (error) {
      toast.error('Failed to block slot');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBookingForSlot = (day: DayData, slot: string) => {
    return day.bookings.find(b => b.appointment.timeSlot === slot);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600 mr-4">
                <FiChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-black">Calendar</h1>
                <p className="text-gray-500 text-sm">Manage your schedule</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Week Navigation */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <FiChevronLeft />
                </button>
                <span className="px-4 font-medium text-brand-black">
                  {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
                </span>
                <button
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>

              <button
                onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 0 }))}
                className="px-4 py-2 text-brand-blue border border-brand-blue rounded-lg hover:bg-blue-50 transition-colors"
              >
                Today
              </button>

              <button
                onClick={() => setShowBlockModal(true)}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiPlus className="mr-2" /> Block Time
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 overflow-x-auto">
        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-sm min-w-[900px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <span className="text-sm font-medium text-gray-500">Time</span>
            </div>
            {weekData.map((day, i) => (
              <div 
                key={i} 
                className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                  day.isToday ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <p className="text-sm text-gray-500">{format(day.date, 'EEE')}</p>
                <p className={`text-xl font-bold ${day.isToday ? 'text-brand-blue' : 'text-brand-black'}`}>
                  {format(day.date, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading calendar...</div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {timeSlots.map((slot) => (
                <div key={slot} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                  {/* Time Label */}
                  <div className="p-2 border-r border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{formatTime(slot)}</span>
                  </div>

                  {/* Day Cells */}
                  {weekData.map((day, i) => {
                    const booking = getBookingForSlot(day, slot);
                    const isSunday = format(day.date, 'EEE') === 'Sun';

                    return (
                      <div
                        key={i}
                        className={`p-1 border-r border-gray-100 last:border-r-0 min-h-[50px] ${
                          isSunday ? 'bg-gray-50' : ''
                        } ${day.isToday ? 'bg-blue-50/30' : ''}`}
                      >
                        {isSunday ? (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-xs text-gray-300">Closed</span>
                          </div>
                        ) : booking ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-2 rounded-lg text-white text-xs cursor-pointer ${getStatusColor(booking.status)}`}
                            title={`${booking.bookingNumber} - ${booking.service.name}`}
                          >
                            <p className="font-medium truncate">
                              {booking.guestInfo?.firstName} {booking.guestInfo?.lastName?.charAt(0)}.
                            </p>
                            <p className="truncate opacity-80">{booking.service.name}</p>
                          </motion.div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6">
          <span className="text-sm text-gray-500">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </main>

      {/* Block Time Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowBlockModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black">Block Time Slot</h2>
              <button onClick={() => setShowBlockModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="blockAllDay"
                  checked={blockAllDay}
                  onChange={(e) => setBlockAllDay(e.target.checked)}
                  className="rounded text-brand-blue"
                />
                <label htmlFor="blockAllDay" className="text-sm text-gray-700">Block entire day</label>
              </div>

              {!blockAllDay && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{formatTime(slot)}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Select reason</option>
                  <option value="lunch">Lunch Break</option>
                  <option value="maintenance">Equipment Maintenance</option>
                  <option value="holiday">Holiday</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={handleBlockSlot}
                className="w-full px-4 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Block Time
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
