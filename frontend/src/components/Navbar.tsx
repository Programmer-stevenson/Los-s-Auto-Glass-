'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <Image
                src="/hero2.png"
                alt="Los's Auto Glass"
                width={75}
                height={75}
                className="h-[75px] w-auto"
                priority
              />
              <span className="text-2xl font-bold">
                <span className={scrolled ? 'text-brand-blue' : 'text-white'}>Los&apos;s</span>
                <span className={scrolled ? 'text-brand-black' : 'text-brand-black'}> Auto Glass</span>
              </span>
            </div>
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

          {/* Phone Number - Desktop */}
          <div className="hidden md:flex items-center">
            <a
              href="tel:3854431606"
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FiPhone className="text-lg" />
              <span>(385) 443-1606</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <FiX className={scrolled ? 'text-brand-blue' : 'text-white'} />
            ) : (
              <FiMenu className={scrolled ? 'text-brand-blue' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — CSS transition instead of AnimatePresence */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-200 ease-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block text-lg font-medium transition-colors py-2 ${
                pathname === link.path
                  ? 'text-brand-blue'
                  : 'text-brand-grey hover:text-brand-blue'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="tel:3854431606"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg mt-4"
          >
            <FiPhone />
            <span>(385) 443-1606</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;