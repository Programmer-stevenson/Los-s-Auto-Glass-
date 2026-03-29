'use client';

// ============================================
// ADMIN DASHBOARD - /admin
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiDollarSign, FiUsers, FiClipboard, 
  FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle,
  FiSettings, FiLogOut, FiMenu, FiX, FiPhone, FiMail,
  FiChevronRight
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthRevenue: number;
  pendingContacts: number;
  confirmedToday: number;
  pendingPayments: number;
}

interface RecentBooking {
  _id: string;
  bookingNumber: string;
  guestInfo?: { firstName: string; lastName: string; phone: string };
  service: { name: string; price: number };
  appointment: { date: string; timeSlot: string };
  status: string;
  payment: { status: string };
}

interface RecentContact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    weekBookings: 0,
    monthRevenue: 0,
    pendingContacts: 0,
    confirmedToday: 0,
    pendingPayments: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsRes = await fetch(`${API_URL}/admin/stats`);
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Load recent bookings
      const bookingsRes = await fetch(`${API_URL}/admin/bookings?limit=5`);
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setRecentBookings(data.bookings || []);
      }

      // Load recent contacts
      const contactsRes = await fetch(`${API_URL}/admin/contacts?limit=5&status=new`);
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setRecentContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'new': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: FiTrendingUp, active: true },
    { name: 'Bookings', href: '/admin/bookings', icon: FiCalendar },
    { name: 'Calendar', href: '/admin/calendar', icon: FiClock },
    { name: 'Contacts', href: '/admin/contacts', icon: FiMail },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-brand-black w-64`}>
        <div className="h-full px-4 py-6 overflow-y-auto">
          {/* Logo */}
          <div className="mb-8 px-2">
            <h1 className="text-xl font-bold text-white">Los's Auto Glass</h1>
            <p className="text-gray-400 text-sm">Admin Dashboard</p>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  link.active 
                    ? 'bg-brand-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Links */}
          <div className="absolute bottom-6 left-4 right-4 space-y-2">
            <Link href="/" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <FiLogOut className="w-5 h-5 mr-3" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-brand-black text-white rounded-lg md:hidden"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Main Content */}
      <main className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'} p-6`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-500 font-medium">Today</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">{stats.todayBookings}</p>
            <p className="text-gray-500 text-sm">Appointments Today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-400 font-medium">This Month</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">${stats.monthRevenue.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FiClipboard className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-yellow-500 font-medium">Action Needed</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">{stats.pendingPayments}</p>
            <p className="text-gray-500 text-sm">Pending Payments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FiMail className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-500 font-medium">New</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">{stats.pendingContacts}</p>
            <p className="text-gray-500 text-sm">Contact Requests</p>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brand-black">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-brand-blue text-sm font-medium hover:underline flex items-center">
                  View All <FiChevronRight className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : recentBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No recent bookings</div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-black">
                          {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{booking.service.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(booking.appointment.date)} at {booking.appointment.timeSlot}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <p className="text-sm font-medium text-brand-black mt-1">
                          ${booking.service.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brand-black">New Contacts</h2>
                <Link href="/admin/contacts" className="text-brand-blue text-sm font-medium hover:underline flex items-center">
                  View All <FiChevronRight className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : recentContacts.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No new contacts</div>
              ) : (
                recentContacts.map((contact) => (
                  <div key={contact._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-black">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.service || 'General Inquiry'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <a href={`tel:${contact.phone}`} className="text-xs text-brand-blue flex items-center">
                            <FiPhone className="w-3 h-3 mr-1" /> {contact.phone}
                          </a>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-brand-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/bookings" className="flex items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-600">New Booking</span>
            </Link>
            <Link href="/admin/calendar" className="flex items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <FiClock className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-green-600">Block Time</span>
            </Link>
            <Link href="/admin/contacts" className="flex items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <FiMail className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-600">View Messages</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <FiSettings className="w-5 h-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-600">Settings</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
