'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCheck, FiShield, FiClock, FiTool, FiPhone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useIsMobile } from '@/lib/useMobile';

const Home = () => {
  const isMobile = useIsMobile();

  const features = useMemo(() => [
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
  ], []);

  const services = useMemo(() => [
    'Windshield Replacement',
    'Auto Glass Repair',
    'Side Window Replacement',
    'Back Glass Replacement',
    'Mirror Replacement',
    'General Auto Repair',
  ], []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - Two Column */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-black via-brand-blue/20 to-brand-black pt-16 lg:pt-0">
        {/* Animated Background Circles - Only on desktop */}
        {!isMobile && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-20 w-96 h-96 rounded-full bg-brand-blue/30 blur-3xl will-change-transform"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-brand-light-green/20 blur-3xl will-change-transform"
            />
          </>
        )}

        {/* Static gradient background for mobile */}
        {isMobile && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-light-green/5" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <FadeIn onMount className="text-center lg:text-left">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Los&apos;s Auto Glass <br />
                <span className="bg-gradient-to-r from-indigo-950 via-blue-800 to-sky-400 bg-clip-text text-transparent">
                  &amp; Auto Repair
                </span>
              </h1>

              {/* Mobile Logo */}
              <div className="relative lg:hidden my-8 flex justify-center">
                <div className="relative rounded-3xl overflow-hidden w-full max-w-md shadow-2xl">
                  <div className="aspect-[4/3] relative">
                    <Image 
                      src="/hero2.png"
                      alt="Los's Auto Glass - Professional Auto Glass Services"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-xl mx-auto lg:mx-0">
                Professional auto glass services with a commitment to quality and customer satisfaction
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300">
                    Get Free Quote
                  </button>
                </Link>
                <a
                  href="tel:3854431606"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 text-black rounded-full font-bold text-lg border-2 border-black/30 hover:bg-white/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiPhone />
                  <span>(385) 443-1606</span>
                </a>
              </div>
            </FadeIn>

            {/* Right Column - Image (Desktop Only) */}
            {!isMobile && (
              <FadeIn onMount delay={0.2} x={50} y={0} className="relative hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
                  <div className="aspect-[4/3] relative">
                    <Image 
                      src="/hero2.png"
                      alt="Los's Auto Glass - Professional Auto Glass Services"
                      fill
                      className="object-contain"
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
                  >
                    <motion.div
                      className="absolute -inset-full"
                      style={{
                        background: 'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.35) 38%, rgba(186,230,253,0.3) 42%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                      }}
                      animate={{ x: ['-50%', '150%'], y: ['-50%', '150%'] }}
                      transition={{ duration: 8, repeat: Infinity, repeatDelay: 10, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
                
                {/* Floating Badge */}
                <FadeIn onMount delay={0.8} className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center">
                      <FiShield className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-brand-black font-bold text-base">500+</p>
                      <p className="text-brand-grey font-bold text-xs">Satisfied Customers</p>
                    </div>
                  </div>
                </FadeIn>
              </FadeIn>
            )}

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-brand-black mb-3">
              Why Choose Us?
            </h2>
            <p className="text-base text-brand-grey max-w-2xl mx-auto">
              We&apos;re committed to providing the best auto glass and repair services in Utah
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.1} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-brand-blue mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-semibold text-brand-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-brand-grey text-sm leading-relaxed">
                  {feature.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Complete Auto Glass & Repair Solutions
              </h2>
              <p className="text-base text-gray-200 mb-6 leading-relaxed">
                From windshield replacements to comprehensive auto repairs, we&apos;ve got you covered with professional service and competitive pricing.
              </p>
              <Link href="/services">
                <button className="px-6 py-3 bg-white text-brand-blue rounded-lg font-medium text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300">
                  View All Services
                </button>
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service, index) => (
                <FadeIn key={index} delay={index * 0.05} className="bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <FiCheck className="text-brand-light-green text-lg flex-shrink-0" />
                    <span className="font-medium text-sm">{service}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-10 md:p-14 text-center text-white shadow-xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Need Auto Glass Service Today?
            </h2>
            <p className="text-base mb-8 max-w-2xl mx-auto text-gray-100">
              Don&apos;t wait - call us now for fast, professional service. Same-day appointments available!
            </p>
            <a
              href="tel:3854431606"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue rounded-lg font-medium text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300"
            >
              <FiPhone className="text-lg" />
              <span>(385) 443-1606</span>
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;