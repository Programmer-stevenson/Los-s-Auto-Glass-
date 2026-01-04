'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-brand-black via-brand-grey to-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-brand-blue">Los&apos;s Auto</span> Glass
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for professional auto glass services in Utah. Auto Glass Without The Lag-time.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center hover:bg-brand-blue transition-colors"
              >
                <FaFacebook className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center hover:bg-brand-blue transition-colors"
              >
                <FaInstagram className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center hover:bg-brand-blue transition-colors"
              >
                <FaTwitter className="text-lg" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">Windshield Replacement</li>
              <li className="text-gray-400">Auto Glass Repair</li>
              <li className="text-gray-400">Window Replacement</li>
              <li className="text-gray-400">General Auto Repair</li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiPhone className="text-brand-blue mt-1 flex-shrink-0" />
                <a href="tel:3854246781" className="text-gray-400 hover:text-brand-blue transition-colors">
                  (385) 424-6781
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FiMail className="text-brand-blue mt-1 flex-shrink-0" />
                <a href="mailto:info@lossautoglass.com" className="text-gray-400 hover:text-brand-blue transition-colors">
                  info@lossautoglass.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-brand-blue mt-1 flex-shrink-0" />
                <span className="text-gray-400">Utah, USA</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiClock className="text-brand-blue mt-1 flex-shrink-0" />
                <span className="text-gray-400">Mon-Fri: 8AM - 6PM<br />Sat: 9AM - 4PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© {currentYear} Los&apos;s Auto Glass. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
