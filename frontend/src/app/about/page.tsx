'use client';

import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useIsMobile } from '@/lib/useMobile';

const About = () => {
  const isMobile = useIsMobile();

  const stats = [
    { icon: <FiUsers />, number: '500+', label: 'Satisfied Customers' },
    { icon: <FiAward />, number: '15+', label: 'Years Experience' },
    { icon: <FiTrendingUp />, number: '99%', label: 'Satisfaction Rate' },
    { icon: <FiHeart />, number: '100%', label: 'Dedication' },
  ];

  const values = [
    { title: 'Quality First', description: 'We never compromise on the quality of our materials or workmanship.' },
    { title: 'Customer Focused', description: 'Your satisfaction and safety are our top priorities in everything we do.' },
    { title: 'Honest Pricing', description: 'Transparent, competitive pricing with no hidden fees or surprises.' },
    { title: 'Expert Service', description: 'Certified technicians with extensive training and experience.' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        {!isMobile && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn onMount className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your trusted partner for professional auto glass and repair services in Utah
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn x={-50} y={0}>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-brand-grey leading-relaxed">
                <p>
                  Los&apos;s Auto Glass was founded with a simple mission: to provide the highest quality auto glass and repair services with honest pricing and exceptional customer service.
                </p>
                <p>
                  With over 15 years of experience serving the Utah community, we&apos;ve built our reputation on reliability, expertise, and a commitment to customer satisfaction. Our team of certified technicians uses only the best materials and latest techniques to ensure your vehicle is safe and looks great.
                </p>
                <p>
                  We understand that auto glass damage can be stressful and inconvenient. That&apos;s why we offer flexible scheduling, mobile services, and work with all major insurance companies to make the process as smooth as possible.
                </p>
              </div>
            </FadeIn>

            <FadeIn x={50} y={0}>
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1 / 1.09' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Carlos.jpg" alt="Carlos - Owner of Los's Auto Glass" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">By The Numbers</h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Our commitment to excellence is reflected in our results
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1} className="text-center">
                <div className="text-5xl mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-gray-200">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">Our Values</h2>
            <p className="text-xl text-brand-grey max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <FadeIn key={index} delay={index * 0.1} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <h3 className="text-2xl font-bold text-brand-black mb-4">{value.title}</h3>
                <p className="text-lg text-brand-grey leading-relaxed">{value.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Experience The Difference</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-100">
              Join thousands of satisfied customers who trust us with their auto glass needs
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

export default About;