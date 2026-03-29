'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheck, FiCalendar, FiClock, FiPhone, FiMail } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { paymentsApi } from '@/lib/api';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get('bookingNumber');
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingNumber) {
      loadBookingInfo();
    }
  }, [bookingNumber]);

  const loadBookingInfo = async () => {
    try {
      const status = await paymentsApi.getStatus(bookingNumber!);
      setBookingInfo(status);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="text-green-500 text-4xl" />
          </motion.div>

          <h1 className="text-3xl font-bold text-brand-black mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-brand-grey mb-8">
            Your appointment has been scheduled. We&apos;ll send you a confirmation email shortly.
          </p>

          {/* Booking Number */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-brand-grey mb-2">Booking Number</p>
            <p className="text-2xl font-mono font-bold text-brand-blue">{bookingNumber}</p>
          </div>

          {/* What's Next */}
          <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-brand-black mb-4">What&apos;s Next?</h3>
            <ul className="space-y-3 text-brand-grey">
              <li className="flex items-start">
                <FiMail className="mr-3 mt-1 text-brand-blue flex-shrink-0" />
                <span>Check your email for confirmation details</span>
              </li>
              <li className="flex items-start">
                <FiCalendar className="mr-3 mt-1 text-brand-blue flex-shrink-0" />
                <span>We&apos;ll send a reminder before your appointment</span>
              </li>
              <li className="flex items-start">
                <FiClock className="mr-3 mt-1 text-brand-blue flex-shrink-0" />
                <span>Arrive 5-10 minutes before your scheduled time</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-brand-blue/5 rounded-2xl p-6 mb-8">
            <p className="text-brand-grey mb-2">Need to make changes?</p>
            <a
              href="tel:3854246781"
              className="inline-flex items-center text-brand-blue font-bold text-lg hover:underline"
            >
              <FiPhone className="mr-2" />
              (385) 424-6781
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                Return Home
              </motion.button>
            </Link>
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-brand-blue text-brand-blue rounded-full font-bold hover:bg-blue-50 transition-colors"
              >
                Book Another Service
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
