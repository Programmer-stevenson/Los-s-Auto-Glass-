'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCheck, FiShield, FiPhone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useIsMobile } from '@/lib/useMobile';

const Services = () => {
  const isMobile = useIsMobile();

  const services = [
    {
      title: 'Windshield Replacement',
      description: 'Complete windshield replacement with high-quality glass and professional installation.',
      features: [
        'OEM and aftermarket glass options',
        'Same-day service available',
        'Lifetime warranty on installation',
        'Insurance claims assistance',
      ],
    },
    {
      title: 'Auto Glass Repair',
      description: 'Expert repair services for chips and cracks to restore your windshield integrity.',
      features: [
        'Quick 30-minute repairs',
        'Prevents crack spreading',
        'Maintains original factory seal',
        'Most insurance covers 100%',
      ],
    },
    {
      title: 'Side Window Replacement',
      description: 'Professional replacement of side door windows and vent glass.',
      features: [
        'All makes and models',
        'Factory-quality glass',
        'Proper sealing and installation',
        'Mobile service available',
      ],
    },
    {
      title: 'Back Glass Replacement',
      description: 'Complete rear windshield replacement with defrost line integration.',
      features: [
        'Heated rear glass available',
        'Antenna and defrost reconnection',
        'Perfect fit guarantee',
        'Competitive pricing',
      ],
    },
    {
      title: 'Mirror Replacement',
      description: 'Side mirror and rearview mirror replacement and repair services.',
      features: [
        'Heated mirror options',
        'Power mirror installation',
        'Glass and housing replacement',
        'Color-matched housings',
      ],
    },
    {
      title: 'General Auto Repair',
      description: 'Comprehensive auto repair services to keep your vehicle running smoothly.',
      features: [
        'Diagnostic services',
        'Maintenance and tune-ups',
        'Brake services',
        'Engine repair',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-black via-brand-blue/20 to-brand-black">
        {/* Animated Background — Desktop only */}
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
        {isMobile && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-light-green/5" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <FadeIn onMount className="order-2 lg:order-1">
              <span className="inline-block px-4 py-2 bg-brand-blue/20 border border-brand-blue/30 rounded-full text-brand-blue text-sm font-medium mb-6">
                Professional Auto Glass Services
              </span>

              <h1 
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              >
                Our <br />
                <span className="text-blue-600 drop-shadow-2xl">Services</span>
              </h1>

              <p 
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Expert windshield repair & replacement with mobile service available. We come to you!
              </p>

              {/* Service Highlights */}
              <div className="space-y-3 mb-10">
                {['Same-Day Service', 'Mobile Repairs', 'Insurance Claims Accepted', 'Lifetime Warranty'].map((item, index) => (
                  <FadeIn key={index} onMount delay={0.4 + index * 0.1} x={-20} y={0} className="flex items-center space-x-3">
                    <FiCheck className="text-brand-light-green text-xl" />
                    <span className="text-gray-300 text-lg">{item}</span>
                  </FadeIn>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/contact">
                  <button className="w-full sm:w-auto px-10 py-5 bg-white text-brand-blue rounded-full font-bold text-lg shadow-2xl hover:shadow-brand-blue/50 active:scale-[0.98] transition-all duration-300">
                    Get Free Quote
                  </button>
                </Link>
                <a
                  href="tel:3854431606"
                  className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold text-lg shadow-2xl border-2 border-white/20 hover:border-white/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiPhone />
                  <span>(385) 443-1606</span>
                </a>
              </div>
            </FadeIn>

            {/* Right Column - Image */}
            <FadeIn onMount delay={0.2} x={50} y={0} className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-md lg:max-w-lg">
                <Image 
                  src="/mobile_optimized.webp"
                  alt="Expert technician performing windshield replacement"
                  width={500}
                  height={625}
                  className="w-full aspect-[4/5] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 via-transparent to-brand-black/30" />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-brand-grey max-w-2xl mx-auto">
              Comprehensive auto glass and repair services for all makes and models
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <FadeIn key={index} delay={index * 0.05} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-black mb-2">
                      {service.title}
                    </h3>
                    <p className="text-brand-grey">{service.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <FiCheck className="text-brand-light-green text-xl mt-0.5 flex-shrink-0" />
                      <span className="text-brand-grey">{feature}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
              Our Process
            </h2>
            <p className="text-xl text-brand-grey max-w-2xl mx-auto">
              Simple, fast, and hassle-free service from start to finish
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call or fill out our online form' },
              { step: '02', title: 'Get Quote', desc: 'Receive instant pricing estimate' },
              { step: '03', title: 'Schedule', desc: 'Choose your preferred time slot' },
              { step: '04', title: 'Service', desc: 'Expert installation or repair' },
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.1} className="text-center">
                <div className="text-6xl font-bold text-brand-blue/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-brand-black mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-grey">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-100">
              Contact us today for a free quote and experience the difference of professional service
            </p>
            <a
              href="tel:3854431606"
              className="inline-block px-10 py-5 bg-white text-brand-blue rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl active:scale-[0.98] transition-all duration-300"
            >
              Call (385) 443-1606
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
