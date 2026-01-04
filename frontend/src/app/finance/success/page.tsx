'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHome, FiFileText } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { paymentsApi } from '@/lib/api';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');
    const booking = searchParams.get('booking');

    if (token && booking) {
      capturePayment(token, booking);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const capturePayment = async (orderId: string, bookingNum: string) => {
    try {
      const result = await paymentsApi.captureOrder(orderId, bookingNum);
      setSuccess(result.success);
      setBookingNumber(bookingNum);
    } catch (error) {
      console.error('Payment capture failed:', error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-40 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue mb-4"></div>
          <p className="text-xl text-brand-grey">Processing your payment...</p>
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
          {success ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FiCheckCircle className="text-green-500 text-5xl" />
              </motion.div>

              <h1 className="text-3xl font-bold text-brand-black mb-4">
                Payment Successful!
              </h1>

              <p className="text-brand-grey mb-6">
                Thank you for your payment. Your booking has been confirmed and a receipt has been sent to your email.
              </p>

              {bookingNumber && (
                <div className="bg-green-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm text-brand-grey mb-2">Booking Number</p>
                  <p className="text-2xl font-mono font-bold text-green-600">{bookingNumber}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FiHome className="mr-2" /> Return Home
                  </motion.button>
                </Link>
                <Link href="/finance">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-brand-blue text-brand-blue rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <FiFileText className="mr-2" /> View Booking
                  </motion.button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-5xl">✕</span>
              </div>

              <h1 className="text-3xl font-bold text-brand-black mb-4">
                Payment Failed
              </h1>

              <p className="text-brand-grey mb-8">
                We couldn&apos;t process your payment. Please try again or contact us for assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/finance">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </motion.button>
                </Link>
                <a href="tel:3854246781">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-brand-blue text-brand-blue rounded-full font-bold hover:bg-blue-50 transition-colors"
                  >
                    Call (385) 424-6781
                  </motion.button>
                </a>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Processing...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
