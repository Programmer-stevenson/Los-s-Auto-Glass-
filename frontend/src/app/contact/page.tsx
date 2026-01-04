'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contactApi } from '@/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiPhone className="text-3xl" />,
      title: 'Phone',
      info: '(385) 424-6781',
      link: 'tel:3854246781',
    },
    {
      icon: <FiMail className="text-3xl" />,
      title: 'Email',
      info: 'info@lossautoglass.com',
      link: 'mailto:info@lossautoglass.com',
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: 'Location',
      info: 'Utah, USA',
      link: '#',
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: 'Hours',
      info: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Get in touch with us for a free quote or to schedule your service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="text-brand-blue mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-brand-black mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-grey text-sm">{item.info}</p>
              </motion.a>
            ))}
          </div>

          {/* Contact Form and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-6">
                Send Us A Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  >
                    <option value="">Select a service</option>
                    <option value="windshield">Windshield Replacement</option>
                    <option value="repair">Auto Glass Repair</option>
                    <option value="side-window">Side Window Replacement</option>
                    <option value="back-glass">Back Glass Replacement</option>
                    <option value="mirror">Mirror Replacement</option>
                    <option value="auto-repair">General Auto Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-grey mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-brand-light-green bg-green-50 p-4 rounded-xl"
                  >
                    <FiCheck className="text-xl" />
                    <span className="font-medium">
                      Thank you! We&apos;ll be in touch soon.
                    </span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl">
                <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </span>
                    <span>Free quotes with no obligation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </span>
                    <span>Same-day service available</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </span>
                    <span>Lifetime warranty on installations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </span>
                    <span>Mobile service at your location</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </span>
                    <span>Insurance claims handled</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                <h3 className="text-3xl font-bold text-brand-black mb-6">
                  Emergency Service
                </h3>
                <p className="text-brand-grey mb-6 leading-relaxed">
                  Need immediate assistance? We offer emergency auto glass services to get you safely back on the road.
                </p>
                <motion.a
                  href="tel:3854246781"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiPhone />
                  <span>(385) 424-6781</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
