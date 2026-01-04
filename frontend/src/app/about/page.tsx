'use client';

import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  const stats = [
    { icon: <FiUsers />, number: '5000+', label: 'Happy Customers' },
    { icon: <FiAward />, number: '15+', label: 'Years Experience' },
    { icon: <FiTrendingUp />, number: '99%', label: 'Satisfaction Rate' },
    { icon: <FiHeart />, number: '100%', label: 'Dedication' },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We never compromise on the quality of our materials or workmanship.',
    },
    {
      title: 'Customer Focused',
      description: 'Your satisfaction and safety are our top priorities in everything we do.',
    },
    {
      title: 'Honest Pricing',
      description: 'Transparent, competitive pricing with no hidden fees or surprises.',
    },
    {
      title: 'Expert Service',
      description: 'Certified technicians with extensive training and experience.',
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
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your trusted partner for professional auto glass and repair services in Utah
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">
                Our Story
              </h2>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-blue to-blue-600 shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              By The Numbers
            </h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Our commitment to excellence is reflected in our results
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
              Our Values
            </h2>
            <p className="text-xl text-brand-grey max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-brand-black mb-4">
                  {value.title}
                </h3>
                <p className="text-lg text-brand-grey leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience The Difference
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-100">
              Join thousands of satisfied customers who trust us with their auto glass needs
            </p>
            <motion.a
              href="tel:3854246781"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-white text-brand-blue rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Call (385) 424-6781
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
