'use client';

import Link from 'next/link';
import { FiCheckCircle, FiPhone, FiArrowLeft, FiClock } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl opacity-20 hidden md:block" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <FadeIn onMount>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              <FiCheckCircle className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Request Received!</h1>
            <p className="text-xl text-gray-200">
              Thank you for contacting Los&apos;s Auto Glass
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <FadeIn delay={0.2} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8">
            <FiCheckCircle className="text-5xl text-green-500" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-4">
            We&apos;ve Got Your Message!
          </h2>

          <p className="text-lg text-brand-grey mb-8 max-w-lg mx-auto leading-relaxed">
            Thanks for reaching out to Los&apos;s Auto Glass. We&apos;ll review your request and 
            contact you shortly to confirm details and pricing.
          </p>

          {/* What to Expect */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-brand-black mb-4 flex items-center gap-2">
              <FiClock className="text-brand-blue" />
              What happens next?
            </h3>
            <ul className="space-y-3 text-brand-grey">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue text-white text-sm flex items-center justify-center font-medium">1</span>
                <span>Our team will review your request within 1-2 business hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue text-white text-sm flex items-center justify-center font-medium">2</span>
                <span>We&apos;ll call or text you to discuss your needs and provide a quote</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue text-white text-sm flex items-center justify-center font-medium">3</span>
                <span>Schedule your service at a time that works for you</span>
              </li>
            </ul>
          </div>

          {/* Urgent Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-brand-black mb-2">Need help right away?</h3>
            <p className="text-brand-grey mb-4">
              For urgent requests or immediate assistance, please call us directly:
            </p>
            <a
              href="tel:3854431606"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              <FiPhone className="text-lg" />
              <span>(385) 443-1606</span>
            </a>
          </div>

          {/* Back to Home */}
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-brand-black rounded-full font-medium hover:bg-gray-200 active:scale-[0.98] transition-all">
              <FiArrowLeft />
              <span>Back to Home</span>
            </button>
          </Link>
        </FadeIn>

        <FadeIn delay={0.4} className="mt-8 text-center">
          <p className="text-brand-grey text-sm">
            A confirmation email has been sent to your email address.
          </p>
        </FadeIn>
      </div>

      <Footer />
    </div>
  );
}
