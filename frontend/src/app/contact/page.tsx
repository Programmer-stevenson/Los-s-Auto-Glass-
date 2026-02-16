'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheck, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

const Contact = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: `New Service Request from ${formData.name}`,
        }),
      });

      if (response.ok) {
        router.push('/thank-you');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again or call us directly.');
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <FiPhone className="text-3xl" />, title: 'Phone', info: '(385) 443-1606', link: 'tel:3854431606' },
    { icon: <FiMail className="text-3xl" />, title: 'Email', info: 'info@lossautoglass.com', link: 'mailto:info@lossautoglass.com' },
    { icon: <FiMapPin className="text-3xl" />, title: 'Location', info: 'Utah, USA', link: '#' },
    { icon: <FiClock className="text-3xl" />, title: 'Hours', info: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM', link: '#' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        {/* Static gradient on mobile instead of animated blob */}
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn onMount className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Get in touch with us for a free quote or to schedule your service
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <a
                  href={item.link}
                  className="block bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-center"
                >
                  <div className="text-brand-blue mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-lg font-bold text-brand-black mb-2">{item.title}</h3>
                  <p className="text-brand-grey text-sm">{item.info}</p>
                </a>
              </FadeIn>
            ))}
          </div>

          {/* Contact Form and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <FadeIn x={-50} y={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-6">
                Send Us A Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">Your Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="John Doe" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="(555) 123-4567" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">Service Needed *</label>
                  <select name="service" value={formData.service} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all">
                    <option value="">Select a service</option>
                    <option value="Windshield Replacement">Windshield Replacement</option>
                    <option value="Auto Glass Repair">Auto Glass Repair</option>
                    <option value="Side Window Replacement">Side Window Replacement</option>
                    <option value="Back Glass Replacement">Back Glass Replacement</option>
                    <option value="Mirror Replacement">Mirror Replacement</option>
                    <option value="General Auto Repair">General Auto Repair</option>
                    <option value="Other">Other / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">Additional Details</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your vehicle (year, make, model) and describe your needs..."></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="text-lg" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-brand-grey text-center">
                  By submitting this form, you agree to be contacted by Los&apos;s Auto Glass regarding your service request.
                </p>
              </form>
            </FadeIn>

            {/* Additional Info */}
            <FadeIn x={50} y={0} className="space-y-8">
              <div className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl">
                <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {['Free quotes with no obligation', 'Same-day service available', 'Lifetime warranty on installations', 'Mobile service at your location', 'Insurance claims handled'].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <FiCheck className="text-sm" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                <h3 className="text-3xl font-bold text-brand-black mb-6">Emergency Service</h3>
                <p className="text-brand-grey mb-6 leading-relaxed">
                  Need immediate assistance? We offer emergency auto glass services to get you safely back on the road.
                </p>
                <a
                  href="tel:3854431606"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300"
                >
                  <FiPhone />
                  <span>(385) 443-1606</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
