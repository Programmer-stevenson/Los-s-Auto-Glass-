'use client';

import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-brand-black via-brand-grey to-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-brand-blue">Los&apos;s Auto</span> Glass
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for professional auto glass services in Utah. Auto Glass Without The Lag-time.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: FaFacebook, href: '#' },
                { Icon: FaInstagram, href: '#' },
                { Icon: FaTwitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center hover:bg-brand-blue transition-colors duration-200"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
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
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">Windshield Replacement</li>
              <li className="text-gray-400">Auto Glass Repair</li>
              <li className="text-gray-400">Window Replacement</li>
              <li className="text-gray-400">General Auto Repair</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiPhone className="text-brand-blue mt-1 flex-shrink-0" />
                <a href="tel:3854431606" className="text-gray-400 hover:text-brand-blue transition-colors">
                  (385) 443-1606
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© {currentYear} Los&apos;s Auto Glass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
