'use client';

import Link from 'next/link';
import { FiDollarSign, FiPhone, FiMail, FiClock, FiCreditCard } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl opacity-20 hidden md:block" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <FadeIn onMount>
            <div className="flex items-center justify-center mb-4">
              <FiDollarSign className="text-5xl mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Finance & Payments</h1>
            </div>
            <p className="text-xl text-gray-200">
              Flexible payment options for your auto glass services
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Coming Soon Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <FadeIn delay={0.2} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 mb-6">
            <FiCreditCard className="text-white text-3xl" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">Coming Soon</h2>

          <p className="text-lg text-brand-grey mb-8 max-w-xl mx-auto">
            Our online payment and financing portal is currently under development. 
            We&apos;re building a secure and convenient way for you to manage payments!
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <div>
            <h3 className="text-xl font-semibold text-brand-black mb-6">
              For payment inquiries, contact us directly:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <a
                href="tel:3854431606"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
              >
                <FiPhone className="text-xl" />
                <span>(385) 443 - 1606</span>
              </a>

              <Link href="/contact">
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-brand-black rounded-xl font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer">
                  <FiMail className="text-xl text-brand-blue" />
                  <span>Contact Form</span>
                </div>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
              <h4 className="font-medium text-brand-black mb-3">Current Payment Options</h4>
              <ul className="text-brand-grey text-sm space-y-2">
                <li>• Cash payments accepted</li>
                <li>• Credit/Debit cards accepted on-site</li>
                <li>• Insurance claims handled</li>
                <li>• Payment plans available (call for details)</li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* Additional Info */}
        <FadeIn delay={0.4} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-brand-black mb-3">Insurance Claims</h3>
            <p className="text-brand-grey text-sm mb-4">
              We work directly with most insurance companies to handle your auto glass claims. 
              Let us take care of the paperwork!
            </p>
            <Link href="/contact">
              <span className="text-brand-blue font-medium hover:underline">Learn more →</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <FiClock className="text-brand-blue text-xl" />
              <h3 className="text-xl font-bold text-brand-black">Business Hours</h3>
            </div>
            <p className="text-brand-grey text-sm">
              Monday - Friday: 8AM - 6PM<br />
              Saturday: 9AM - 4PM<br />
              Sunday: Closed
            </p>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn delay={0.5} className="mt-8 bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl p-8 md:p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Pricing?</h3>
          <p className="text-gray-100 mb-6">
            Get a free quote for your auto glass service. No obligation, transparent pricing!
          </p>
          <a
            href="tel:3854246781"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue rounded-full font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
          >
            <FiPhone />
            <span>Get Free Quote</span>
          </a>
        </FadeIn>
      </div>

      <Footer />
    </div>
  );
}
