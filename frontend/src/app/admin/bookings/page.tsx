'use client';

// ============================================
// ADMIN BOOKINGS PAGE - /admin/bookings
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiSearch, FiFilter, FiPhone, FiMail,
  FiCheckCircle, FiXCircle, FiClock, FiDollarSign,
  FiChevronLeft, FiChevronRight, FiEye, FiEdit
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Booking {
  _id: string;
  bookingNumber: string;
  guestInfo?: { 
    firstName: string; 
    lastName: string; 
    email: string;
    phone: string;
  };
  service: { name: string; price: number };
  vehicle: { year: number; make: string; model: string };
  appointment: { date: string; timeSlot: string; isMobileService: boolean };
  status: string;
  payment: { status: string; totalAmount: number; paidAmount: number };
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, [page, statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const res = await fetch(`${API_URL}/admin/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Booking ${newStatus}`);
        loadBookings();
        setSelectedBooking(null);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      case 'no-show': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'refunded': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      b.bookingNumber.toLowerCase().includes(search) ||
      b.guestInfo?.firstName?.toLowerCase().includes(search) ||
      b.guestInfo?.lastName?.toLowerCase().includes(search) ||
      b.guestInfo?.phone?.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600 mr-4">
                <FiChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-black">Bookings</h1>
                <p className="text-gray-500 text-sm">Manage all appointments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or booking #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Booking</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-mono font-medium text-brand-black">{booking.bookingNumber}</p>
                        <p className="text-xs text-gray-400">
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-brand-black">
                          {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <a href={`tel:${booking.guestInfo?.phone}`} className="text-xs text-brand-blue flex items-center">
                            <FiPhone className="w-3 h-3 mr-1" />
                          </a>
                          <a href={`mailto:${booking.guestInfo?.email}`} className="text-xs text-brand-blue flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-brand-black">{booking.service.name}</p>
                        <p className="text-sm text-gray-500">${booking.service.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-brand-black">{formatDate(booking.appointment.date)}</p>
                        <p className="text-sm text-gray-500">{booking.appointment.timeSlot}</p>
                        {booking.appointment.isMobileService && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Mobile</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-medium ${getPaymentColor(booking.payment.status)}`}>
                          {booking.payment.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${booking.payment.paidAmount || 0} / ${booking.payment.totalAmount}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FiXCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedBooking(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Booking Number</p>
                <p className="text-xl font-mono font-bold text-brand-black">{selectedBooking.bookingNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedBooking.guestInfo?.firstName} {selectedBooking.guestInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${selectedBooking.guestInfo?.phone}`} className="font-medium text-brand-blue">
                    {selectedBooking.guestInfo?.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedBooking.service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${selectedBooking.service.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedBooking.appointment.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedBooking.appointment.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.status !== 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'confirmed')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {selectedBooking.status !== 'in-progress' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'in-progress')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                  {selectedBooking.status !== 'completed' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'completed')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {selectedBooking.status !== 'no-show' && (
                    <button
                      onClick={() => updateBookingStatus(selectedBooking._id, 'no-show')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      No Show
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
