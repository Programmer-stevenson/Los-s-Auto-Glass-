'use client';

// ============================================
// GALLERY PAGE - /gallery
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/gallery/1.jpg',
    alt: 'Auto glass work',
    title: 'Windshield Replacement',
    description: 'Complete windshield replacement with OEM glass'
  },
  {
    id: 2,
    src: '/gallery/2.jpg',
    alt: 'Auto glass work',
    title: 'Sedan Windshield Install',
    description: 'Factory-quality windshield installation'
  },
  {
    id: 3,
    src: '/gallery/3.jpg',
    alt: 'Auto glass work',
    title: 'Before & After',
    description: 'Damaged windshield restored to perfect condition'
  },
  {
    id: 4,
    src: '/gallery/4.jpg',
    alt: 'Auto glass work',
    title: 'Side Window Replacement',
    description: 'Quick side window replacement service'
  },
  {
    id: 5,
    src: '/gallery/5.jpg',
    alt: 'Auto glass work',
    title: 'Passenger Window Install',
    description: 'Seamless window installation'
  },
  {
    id: 6,
    src: '/gallery/6.jpg',
    alt: 'Auto glass work',
    title: 'Rear Windshield',
    description: 'Back glass with defrost lines restored'
  },
  {
    id: 7,
    src: '/gallery/7.jpg',
    alt: 'Auto glass work',
    title: 'Truck Back Glass',
    description: 'Heavy-duty back glass installation'
  },
  {
    id: 8,
    src: '/gallery/8.jpg',
    alt: 'Auto glass work',
    title: 'Rock Chip Repair',
    description: 'Quick chip repair prevents spreading'
  },
  {
    id: 9,
    src: '/gallery/9.jpg',
    alt: 'Auto glass work',
    title: 'Crack Repair',
    description: 'Professional crack repair service'
  },
  {
    id: 10,
    src: '/gallery/10.jpg',
    alt: 'Auto glass work',
    title: 'Mobile Service',
    description: 'We come to you - home or office'
  },
  {
    id: 11,
    src: '/gallery/11.jpg',
    alt: 'Auto glass work',
    title: 'On-Site Repair',
    description: 'Convenient mobile windshield service'
  },
  {
    id: 12,
    src: '/gallery/12.jpg',
    alt: 'Auto glass work',
    title: 'Our Facility',
    description: 'State-of-the-art auto glass shop'
  },
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Work Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Browse through our recent projects and see the quality of our workmanship
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                  {/* Placeholder - Replace with actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-black/40 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <FiZoomIn className="text-4xl mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-70">{image.src}</p>
                    </div>
                  </div>
                  
                  {/* Uncomment when you have actual images */}
                  {/* <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  /> */}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
                    >
                      <FiZoomIn className="text-brand-blue text-2xl" />
                    </motion.div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-brand-black">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-brand-grey mt-1">{image.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-10 text-white shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4">Ready for Quality Service?</h2>
            <p className="text-gray-200 mb-6">
              Let us add your vehicle to our gallery of satisfied customers!
            </p>
            <a href="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-brand-blue rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Book Your Appointment
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && galleryImages[currentImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Image Container */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Placeholder for actual image */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video flex items-center justify-center min-w-[300px] md:min-w-[600px]">
                  <div className="text-center text-white p-8">
                    <p className="text-lg mb-2">{galleryImages[currentImageIndex].title}</p>
                    <p className="text-sm text-gray-400">
                      {galleryImages[currentImageIndex].src}
                    </p>
                  </div>
                </div>
                
                {/* Uncomment when you have actual images */}
                {/* <img
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  className="max-w-full max-h-[70vh] object-contain"
                /> */}
              </div>

              {/* Caption */}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold">{galleryImages[currentImageIndex].title}</h3>
                {galleryImages[currentImageIndex].description && (
                  <p className="text-gray-400 mt-1">{galleryImages[currentImageIndex].description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {currentImageIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
