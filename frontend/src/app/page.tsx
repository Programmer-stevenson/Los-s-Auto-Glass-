'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheck, FiShield, FiClock, FiTool, FiPhone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Home = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const features = [
    {
      icon: <FiShield className="text-4xl" />,
      title: 'Quality Guaranteed',
      description: 'We stand behind our work with comprehensive warranties on all services.',
    },
    {
      icon: <FiClock className="text-4xl" />,
      title: 'Fast Service',
      description: 'Same-day service available for most repairs and replacements.',
    },
    {
      icon: <FiTool className="text-4xl" />,
      title: 'Expert Technicians',
      description: 'Highly Qualified professionals with years of experience in auto glass and repair.',
    },
  ];

  const services = [
    'Windshield Replacement',
    'Auto Glass Repair',
    'Side Window Replacement',
    'Back Glass Replacement',
    'Mirror Replacement',
    'General Auto Repair',
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - Two Column */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-black via-brand-blue/20 to-brand-black pt-16 lg:pt-0">
        {/* Animated Background Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-brand-blue/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-brand-light-green/20 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Los&apos;s Auto Glass <br />
                <span className="bg-gradient-to-r from-indigo-950 via-blue-800 to-sky-400 bg-clip-text text-transparent">
                  &amp; Auto Repair
                </span>
              </h1>

              {/* Mobile Logo - Shows between title and description on mobile only */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative lg:hidden my-8 flex justify-center"
              >
                <div className="relative rounded-3xl overflow-visible w-full max-w-md">
                  {/* Mobile Sparkles - Lightweight, CSS-based, only 5 sparkles */}
                  <div className="absolute -inset-6 pointer-events-none">
                    <motion.div
                      className="absolute -top-2 right-6"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frosty1)" />
                        <defs>
                          <linearGradient id="frosty1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    <motion.div
                      className="absolute top-1/3 -left-3"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frosty2)" />
                        <defs>
                          <linearGradient id="frosty2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="100%" stopColor="#7dd3fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    <motion.div
                      className="absolute bottom-1/4 -right-4"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.8, delay: 1 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frosty3)" />
                        <defs>
                          <linearGradient id="frosty3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f0f9ff" />
                            <stop offset="100%" stopColor="#bae6fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-2 left-10"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.2, delay: 0.3 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                      </svg>
                    </motion.div>
                    <motion.div
                      className="absolute top-1/2 -right-2 w-2 h-2 bg-white rounded-full"
                      animate={{ opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.6, delay: 0.8 }}
                    />
                  </div>

                  {/* Image */}
                  <div className="relative rounded-3xl overflow-hidden">
                    <div 
                      className="aspect-[4/3] bg-cover bg-center"
                      style={{ 
                        backgroundImage: 'url(/hero.png.png)',
                      }}
                    />
                    {/* Silvery Shine Wave Effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: 'linear',
                      }}
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(192, 192, 192, 0.2) 20%, rgba(255, 255, 255, 0.5) 50%, rgba(192, 192, 192, 0.2) 80%, transparent 100%)',
                        transform: 'skewX(-20deg)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 text-center">
                Fast, reliable, and affordable auto glass replacement and repair services in Utah
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-brand-blue text-white rounded-lg font-medium text-sm shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 transition-all duration-300"
                  >
                    Get Free Quote
                  </motion.button>
                </Link>
                <motion.a
                  href="tel:3854246781"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-slate-800 rounded-lg font-medium text-xs sm:text-sm shadow-md border border-slate-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiPhone className="text-brand-blue" />
                  <span>Financing Available</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Column - Image (Desktop only) with Sparkles */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-visible w-full max-w-lg mx-auto">
                {/* Sparkles - Only rendered on desktop */}
                {isDesktop && (
                  <div className="absolute -inset-8 pointer-events-none">
                    {/* Large 4-pointed stars with frosty gradient */}
                    <motion.div
                      className="absolute -top-4 right-8"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyA)" />
                        <defs>
                          <linearGradient id="frostyA" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="70%" stopColor="white" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute top-6 -left-4"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.3, delay: 0.4, ease: 'easeInOut' }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyB)" />
                        <defs>
                          <linearGradient id="frostyB" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f0f9ff" />
                            <stop offset="60%" stopColor="white" />
                            <stop offset="100%" stopColor="#7dd3fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/4 -right-6"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.8, delay: 0.9, ease: 'easeInOut' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyC)" />
                        <defs>
                          <linearGradient id="frostyC" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="70%" stopColor="white" />
                            <stop offset="100%" stopColor="#bae6fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 -left-6"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, delay: 1.2, ease: 'easeInOut' }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyD)" />
                        <defs>
                          <linearGradient id="frostyD" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="65%" stopColor="#f0f9ff" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-1/4 -right-5"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2, delay: 0.6, ease: 'easeInOut' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyE)" />
                        <defs>
                          <linearGradient id="frostyE" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="70%" stopColor="white" />
                            <stop offset="100%" stopColor="#7dd3fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-4 right-12"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.6, delay: 0.2, ease: 'easeInOut' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyF)" />
                        <defs>
                          <linearGradient id="frostyF" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f0f9ff" />
                            <stop offset="70%" stopColor="white" />
                            <stop offset="100%" stopColor="#bae6fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-2 left-8"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4, delay: 0.8, ease: 'easeInOut' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="url(#frostyG)" />
                        <defs>
                          <linearGradient id="frostyG" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" />
                            <stop offset="70%" stopColor="white" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute -top-2 left-1/3"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, delay: 1.5, ease: 'easeInOut' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                      </svg>
                    </motion.div>

                    {/* Medium stars */}
                    <motion.div
                      className="absolute top-8 right-0"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2, delay: 0.3, ease: 'easeInOut' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#e0f2fe" />
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-12 -left-2"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.9, delay: 1.1, ease: 'easeInOut' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/3 left-0"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.4, delay: 0.7, ease: 'easeInOut' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#bae6fd" />
                      </svg>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-6 right-0"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.7, delay: 1.4, ease: 'easeInOut' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#f0f9ff" />
                      </svg>
                    </motion.div>

                    {/* Tiny glint dots - mix of white and light blue */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5, delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-16 -right-2 w-1.5 h-1.5 bg-sky-200 rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.8, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute bottom-20 -left-1 w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.6, delay: 0.9 }}
                    />
                    <motion.div
                      className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-sky-100 rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, delay: 1.3 }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-2 w-1 h-1 bg-white rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.4, delay: 0.3 }}
                    />
                    <motion.div
                      className="absolute top-1/4 left-4 w-1 h-1 bg-sky-200 rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.9, delay: 0.7 }}
                    />
                    <motion.div
                      className="absolute bottom-1/3 left-2 w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.1, delay: 1.1 }}
                    />
                    <motion.div
                      className="absolute -top-1 right-1/3 w-1 h-1 bg-sky-100 rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.7, delay: 0.4 }}
                    />
                    <motion.div
                      className="absolute -bottom-1 left-1/4 w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.3, delay: 1.6 }}
                    />
                  </div>
                )}

                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden">
                  <div 
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ 
                      backgroundImage: 'url(/hero.png.png)',
                    }}
                  />
                  {/* Silvery Shine Wave Effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'linear',
                    }}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(192, 192, 192, 0.2) 20%, rgba(255, 255, 255, 0.5) 50%, rgba(192, 192, 192, 0.2) 80%, transparent 100%)',
                      transform: 'skewX(-20deg)',
                    }}
                  />
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center">
                    <FiShield className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-brand-black font-bold text-base">500+</p>
                    <p className="text-brand-grey font-bold text-xs">Happy Customers</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-brand-black mb-3">
              Why Choose Us?
            </h2>
            <p className="text-base text-brand-grey max-w-2xl mx-auto">
              We&apos;re committed to providing the best auto glass and repair services in Utah
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-brand-blue mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-semibold text-brand-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-brand-grey text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Complete Auto Glass & Repair Solutions
              </h2>
              <p className="text-base text-gray-200 mb-6 leading-relaxed">
                From windshield replacements to comprehensive auto repairs, we&apos;ve got you covered with professional service and competitive pricing.
              </p>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white text-brand-blue rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View All Services
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <FiCheck className="text-brand-light-green text-lg flex-shrink-0" />
                    <span className="font-medium text-sm">{service}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-10 md:p-14 text-center text-white shadow-xl"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Need Auto Glass Service Today?
            </h2>
            <p className="text-base mb-8 max-w-2xl mx-auto text-gray-100">
              Don&apos;t wait - call us now for fast, professional service. Same-day appointments available!
            </p>
            <motion.a
              href="tel:3854246781"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue rounded-lg font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPhone className="text-lg" />
              <span>(385) 424-6781</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;