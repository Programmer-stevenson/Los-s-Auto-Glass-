'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowLeft, FiPhone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiXCircle className="text-yellow-500 text-5xl" />
          </motion.div>

          <h1 className="text-3xl font-bold text-brand-black mb-4">
            Payment Cancelled
          </h1>

          <p className="text-brand-grey mb-8">
            Your payment was cancelled. No charges have been made to your account.
            You can try again whenever you&apos;re ready.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-brand-grey text-sm">
              Your booking is still reserved. Complete payment to confirm your appointment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/finance">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiArrowLeft className="mr-2" /> Try Again
              </motion.button>
            </Link>
            <a href="tel:3854246781">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-brand-blue text-brand-blue rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <FiPhone className="mr-2" /> Call Us
              </motion.button>
            </a>
          </div>

          <p className="text-sm text-brand-grey mt-8">
            Need help? Call us at <a href="tel:3854246781" className="text-brand-blue font-medium">(385) 424-6781</a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
