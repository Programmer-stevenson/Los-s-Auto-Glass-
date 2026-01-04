'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Book Now', path: '/booking' },
    { name: 'Finance', path: '/finance' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              {<img src="/logo.png" alt="Los's Auto Glass" className="h-28 w-auto" />}
              <span className="text-2xl font-bold">
                <span className={scrolled ? 'text-brand-blue' : 'text-white'}>Los&apos;s</span>
                <span className={scrolled ? 'text-brand-black' : 'text-brand-blue'}> Auto Glass</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-base font-medium transition-colors duration-300 ${
                  pathname === link.path
                    ? 'text-brand-blue'
                    : scrolled
                    ? 'text-brand-grey hover:text-brand-blue'
                    : 'text-white hover:text-brand-light-green'
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-blue"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Phone Number */}
          <div className="hidden md:flex items-center">
            <motion.a
              href="tel:3854246781"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPhone className="text-lg" />
              <span>(385) 424-6781</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-brand-blue"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block text-lg font-medium transition-colors ${
                    pathname === link.path
                      ? 'text-brand-blue'
                      : 'text-brand-grey hover:text-brand-blue'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="tel:3854246781"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg mt-4"
              >
                <FiPhone />
                <span>(385) 424-6781</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
