'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCreditCard, FiCheckCircle, FiAlertCircle, FiDollarSign, FiCalendar, FiClock } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { bookingsApi, paymentsApi } from '@/lib/api';

interface BookingInfo {
  bookingNumber: string;
  service: {
    name: string;
    price: number;
  };
  appointment: {
    date: string;
    timeSlot: string;
  };
  vehicle: {
    year: number;
    make: string;
    model: string;
  };
  payment: {
    status: string;
    totalAmount: number;
    paidAmount: number;
    paypalOrderId?: string;
  };
  status: string;
}

export default function FinancePage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const lookupBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingNumber || !email) {
      toast.error('Please enter booking number and email');
      return;
    }

    setLoading(true);
    setBooking(null);
    setPaymentSuccess(false);

    try {
      const { booking } = await bookingsApi.lookup(bookingNumber.toUpperCase(), email);
      setBooking(booking);
    } catch (error: any) {
      toast.error(error.message || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    if (!booking) return;

    setPaymentLoading(true);
    try {
      // Create PayPal order
      const { orderId, approvalUrl } = await paymentsApi.createOrder(booking.bookingNumber);
      
      // Redirect to PayPal for payment
      window.location.href = approvalUrl;
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize payment');
      setPaymentLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500 bg-green-50';
      case 'pending': return 'text-yellow-500 bg-yellow-50';
      case 'failed': return 'text-red-500 bg-red-50';
      case 'refunded': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const remainingBalance = booking ? booking.payment.totalAmount - (booking.payment.paidAmount || 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <FiDollarSign className="text-5xl mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">Finance & Payments</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200"
          >
            Look up your booking and make secure payments with PayPal
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Lookup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-brand-black mb-6 flex items-center">
            <FiSearch className="mr-3 text-brand-blue" />
            Look Up Your Booking
          </h2>

          <form onSubmit={lookupBooking} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-grey mb-2">
                  Booking Number *
                </label>
                <input
                  type="text"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. BK-ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-grey mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find My Booking'}
            </motion.button>
          </form>
        </motion.div>

        {/* Booking Details & Payment */}
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Booking Info Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-brand-black">
                  Booking #{booking.bookingNumber}
                </h3>
                <span className={`px-4 py-2 rounded-full font-medium capitalize ${getStatusColor(booking.payment.status)}`}>
                  {booking.payment.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiCreditCard className="text-brand-blue mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-brand-grey">Service</p>
                      <p className="font-semibold text-brand-black">{booking.service.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiCalendar className="text-brand-blue mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-brand-grey">Appointment Date</p>
                      <p className="font-semibold text-brand-black">{formatDate(booking.appointment.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiClock className="text-brand-blue mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-brand-grey">Time</p>
                      <p className="font-semibold text-brand-black">{booking.appointment.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Payment */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-brand-grey">Vehicle</p>
                    <p className="font-semibold text-brand-black">
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-brand-grey">Service Total</span>
                      <span className="font-medium">${booking.payment.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-brand-grey">Paid</span>
                      <span className="font-medium text-green-600">
                        -${(booking.payment.paidAmount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-brand-black">Balance Due</span>
                      <span className="font-bold text-brand-blue text-xl">
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {booking.payment.status === 'paid' || remainingBalance <= 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
              >
                <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Complete!</h3>
                <p className="text-green-600">
                  Your booking is fully paid. Thank you for your business!
                </p>
              </motion.div>
            ) : paymentSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
              >
                <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
                <p className="text-green-600">
                  Your payment has been processed. You will receive a confirmation email shortly.
                </p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-brand-black mb-6 flex items-center">
                  <FiCreditCard className="mr-3 text-brand-blue" />
                  Make a Payment
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-brand-grey">Amount to Pay</p>
                      <p className="text-3xl font-bold text-brand-blue">${remainingBalance.toFixed(2)}</p>
                    </div>
                    <FaPaypal className="text-5xl text-[#003087]" />
                  </div>
                </div>

                <motion.button
                  onClick={handlePayPalPayment}
                  disabled={paymentLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-[#0070ba] hover:bg-[#003087] text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {paymentLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaPaypal className="mr-3 text-2xl" />
                      Pay with PayPal
                    </>
                  )}
                </motion.button>

                <p className="text-center text-sm text-brand-grey mt-4">
                  Secure payment powered by PayPal. You can pay with your PayPal account or credit/debit card.
                </p>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h4 className="font-bold text-brand-black mb-4 flex items-center">
                <FiAlertCircle className="mr-2 text-brand-blue" />
                Payment Information
              </h4>
              <ul className="space-y-2 text-brand-grey text-sm">
                <li>• Payments are processed securely through PayPal</li>
                <li>• You can pay with PayPal balance, bank account, or credit/debit card</li>
                <li>• A receipt will be sent to your email after payment</li>
                <li>• For payment plans or questions, call us at (385) 424-6781</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* No Booking Found State */}
        {!booking && !loading && bookingNumber && email && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center"
          >
            <FiAlertCircle className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Booking Not Found</h3>
            <p className="text-yellow-600">
              Please check your booking number and email address and try again.
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
