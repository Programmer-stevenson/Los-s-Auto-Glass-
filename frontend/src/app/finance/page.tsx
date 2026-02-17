'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiDollarSign, FiPhone, FiMail, FiClock, FiCreditCard, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selector: string) => void };
      Messages: (config: Record<string, unknown>) => { render: (selector: string) => void };
    };
  }
}

export default function FinancePage() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonsRendered, setButtonsRendered] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  // Load PayPal SDK with Pay Later enabled
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) {
      if (window.paypal) setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&enable-funding=paylater`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => setErrorMessage('Failed to load PayPal. Please refresh and try again.');
    document.body.appendChild(script);
  }, [PAYPAL_CLIENT_ID]);

  // Render Pay Later messaging banner
  useEffect(() => {
    if (!paypalLoaded || !window.paypal?.Messages) return;

    const msgContainer = document.getElementById('paypal-message');
    if (msgContainer) {
      msgContainer.innerHTML = '';
      window.paypal.Messages({
        amount: parseFloat(amount) || 0,
        placement: 'payment',
        style: {
          layout: 'text',
          logo: { type: 'primary', position: 'left' },
          text: { color: 'black', size: '14' },
        },
      }).render('#paypal-message');
    }
  }, [paypalLoaded, amount]);

  // Render PayPal buttons when amount is valid
  const renderButtons = useCallback(() => {
    if (!paypalLoaded || !window.paypal) return;

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount < 1) return;

    const container = document.getElementById('paypal-buttons');
    if (container) container.innerHTML = '';

    setButtonsRendered(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    window.paypal.Buttons({
      fundingSource: undefined, // Show all funding sources including Pay Later
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
        label: 'pay',
        tagline: false,
      },
      createOrder: async () => {
        try {
          const response = await fetch(`${API_URL}/api/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: parsedAmount,
              description: `Payment from ${name || 'Customer'}`,
              returnUrl: `${window.location.origin}/thank-you`,
              cancelUrl: `${window.location.origin}/finance`,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to create order');
          return data.orderId;
        } catch (err) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to create payment');
          setPaymentStatus('error');
          throw err;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          setPaymentStatus('processing');
          const response = await fetch(`${API_URL}/api/payments/capture-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID }),
          });

          const captureData = await response.json();
          if (!response.ok) throw new Error(captureData.message || 'Payment capture failed');
          setPaymentStatus('success');
        } catch (err) {
          setErrorMessage(err instanceof Error ? err.message : 'Payment failed');
          setPaymentStatus('error');
        }
      },
      onError: (err: Error) => {
        console.error('PayPal error:', err);
        setErrorMessage('Something went wrong with PayPal. Please try again.');
        setPaymentStatus('error');
      },
      onCancel: () => {
        setPaymentStatus('idle');
      },
    }).render('#paypal-buttons');
  }, [paypalLoaded, amount, name, API_URL]);

  const handleAmountSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount < 1) {
      setErrorMessage('Please enter a valid amount of at least $1.00');
      return;
    }
    setErrorMessage('');
    renderButtons();
  };

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
              Pay your invoice securely online — with options to pay now or pay later
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Receive Quote CTA */}
        <FadeIn delay={0.1} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-brand-black mb-2">Don&apos;t have a quote yet?</h3>
          <p className="text-brand-grey mb-5">Get a free estimate before making a payment</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:3854431606"
              className="px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <FiPhone />
              <span>Call for Fastest Quote</span>
            </a>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-brand-black rounded-full font-bold text-lg border-2 border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all">
                Request Quote Online
              </button>
            </Link>
          </div>
        </FadeIn>

        {/* Payment Success */}
        {paymentStatus === 'success' ? (
          <FadeIn onMount className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <FiCheck className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">Payment Successful!</h2>
            <p className="text-lg text-brand-grey mb-8 max-w-xl mx-auto">
              Thank you for your payment of <span className="font-bold text-brand-black">${parseFloat(amount).toFixed(2)}</span>. 
              You&apos;ll receive a confirmation email from PayPal shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
                  Back to Home
                </button>
              </Link>
              <a
                href="tel:3854431606"
                className="px-8 py-4 bg-gray-100 text-brand-black rounded-full font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <FiPhone />
                <span>Questions? Call Us</span>
              </a>
            </div>
          </FadeIn>
        ) : (
          <>
            {/* Payment Form */}
            <FadeIn delay={0.2} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 mb-4">
                  <FiCreditCard className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-2">Make a Payment</h2>
                <p className="text-brand-grey">
                  Enter the amount from your quote to pay securely via PayPal
                </p>
              </div>

              {/* Name Input */}
              <div className="max-w-md mx-auto mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-brand-black mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-brand-blue focus:ring-0 focus:outline-none transition-colors"
                />
              </div>

              {/* Amount Input */}
              <div className="max-w-md mx-auto mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-brand-black mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-brand-grey font-bold">$</span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setButtonsRendered(false);
                    }}
                    placeholder="0.00"
                    className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl text-2xl font-bold focus:border-brand-blue focus:ring-0 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Pay Later Message */}
              <div id="paypal-message" className="max-w-md mx-auto mb-6" />

              {/* Error Message */}
              {errorMessage && (
                <div className="max-w-md mx-auto mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <FiAlertCircle className="text-xl flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Show Payment Button or PayPal Buttons */}
              <div className="max-w-md mx-auto">
                {!buttonsRendered && (
                  <button
                    onClick={handleAmountSubmit}
                    disabled={!paypalLoaded || !amount || parseFloat(amount) < 1}
                    className="w-full py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {!paypalLoaded ? 'Loading PayPal...' : 'Continue to Payment'}
                  </button>
                )}

                {/* PayPal Buttons Container */}
                <div id="paypal-buttons" className={buttonsRendered ? '' : 'hidden'} />

                {buttonsRendered && (
                  <button
                    onClick={() => {
                      setButtonsRendered(false);
                      setAmount('');
                      setName('');
                      const container = document.getElementById('paypal-buttons');
                      if (container) container.innerHTML = '';
                    }}
                    className="w-full mt-4 py-3 text-brand-grey hover:text-brand-black font-medium transition-colors text-sm"
                  >
                    ← Change Amount
                  </button>
                )}

                {paymentStatus === 'processing' && (
                  <div className="mt-6 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mb-3" />
                    <p className="text-brand-grey">Processing your payment...</p>
                  </div>
                )}
              </div>

              {/* Security Note */}
              <div className="max-w-md mx-auto mt-8 text-center">
                <p className="text-xs text-brand-grey">
                  🔒 Payments are processed securely through PayPal. We never see or store your payment details.
                </p>
              </div>
            </FadeIn>

            {/* Pay Later Info */}
            <FadeIn delay={0.3} className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg border border-blue-100">
              <h3 className="text-2xl font-bold text-brand-black mb-4 text-center">Pay Later with PayPal</h3>
              <p className="text-brand-grey text-center mb-6">
                Split your purchase into 4 interest-free payments with no late fees.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { step: '1', text: 'Choose PayPal Pay Later at checkout' },
                  { step: '2', text: 'Pay 25% today' },
                  { step: '3', text: 'Pay the rest in 3 bi-weekly payments' },
                  { step: '4', text: 'No interest, no late fees' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-blue text-white font-bold text-sm mb-2">
                      {item.step}
                    </div>
                    <p className="text-sm text-brand-grey">{item.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Contact & Info */}
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

            {/* CTA */}
            <FadeIn delay={0.5} className="mt-8 bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl p-8 md:p-10 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Pricing?</h3>
              <p className="text-gray-100 mb-6">
                Get a free quote for your auto glass service. No obligation, transparent pricing!
              </p>
              <a
                href="tel:3854431606"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue rounded-full font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
              >
                <FiPhone />
                <span>Call (385) 443-1606</span>
              </a>
            </FadeIn>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}