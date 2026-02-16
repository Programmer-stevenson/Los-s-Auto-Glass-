'use client';

import { useState } from 'react';
import { FiPhone, FiChevronDown } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

const projects = [
  {
    id: 'red-mustang',
    vehicle: 'Ford Mustang GT 5.0',
    service: 'Windshield Replacement',
    before: '/red-mustang-before.jpg',
    after: '/red-mustang-after.jpg',
  },
  {
    id: 'box-truck',
    vehicle: 'GMC Box Truck',
    service: 'Commercial Windshield',
    before: '/box-truck-before.jpg',
    after: '/box-truck-after.jpg',
  },
  {
    id: 'lexus-suv',
    vehicle: 'Lexus RX SUV',
    service: 'Windshield Replacement',
    before: '/lexus-suv-before.jpg',
    after: '/lexus-suv-after.jpg',
  },
  {
    id: 'acura-rear',
    vehicle: 'Acura RDX Turbo',
    service: 'Rear Glass Replacement',
    before: '/acura-rear-before.jpg',
    after: '/acura-rear-after.jpg',
  },
  {
    id: 'red-rav4',
    vehicle: 'Toyota 4Runner',
    service: 'Windshield Replacement',
    before: '/red-rav4-before.jpg',
    after: '/red-rav4-after.jpg',
  },
  {
    id: 'red-gti',
    vehicle: 'Volkswagen Golf GTI',
    service: 'Windshield Replacement',
    before: '/red-gti-before.jpg',
    after: '/red-gti-after.jpg',
  },
  {
    id: 'red-truck',
    vehicle: 'Ram 2500 Heavy Duty',
    service: 'Windshield Replacement',
    before: '/red-truck-before.jpg',
    after: '/red-truck-after.jpg',
  },
  {
    id: 'orange-jeep',
    vehicle: 'Jeep Wrangler Sport',
    service: 'Windshield Replacement',
    before: '/orange-jeep-before.jpg',
    after: '/orange-jeep-after.jpg',
  },
  {
    id: 'kia-rear',
    vehicle: 'Kia Sorento',
    service: 'Rear Glass Replacement',
    before: '/kia-rear-before.jpg',
    after: '/kia-rear-after.jpg',
  },
  {
    id: 'honda-civic-gray',
    vehicle: 'Honda Civic',
    service: 'Windshield Replacement',
    before: '/honda-civic-gray-before.jpg',
    after: '/honda-civic-gray-after.jpg',
  },
  {
    id: 'ford-explorer',
    vehicle: 'Ford Explorer',
    service: 'Windshield Replacement',
    before: '/ford-explorer-before.jpg',
    after: '/ford-explorer-after.jpg',
  },
  {
    id: 'grey-jetta',
    vehicle: 'Volkswagen Jetta',
    service: 'Windshield Replacement',
    before: '/grey-jetta-before.jpg',
    after: '/grey-jetta-after.jpg',
  },
  {
    id: 'subie',
    vehicle: 'Subaru Forester',
    service: 'Windshield Replacement',
    before: '/subie-before.jpg',
    after: '/subie-after.jpg',
  },
  {
    id: 'van-side-window',
    vehicle: 'Passenger Van',
    service: 'Side Window Replacement',
    before: '/van-side-window-before.jpg',
    after: '/van-side-window-after.jpg',
  },
  {
    id: 'red-chevy-suv',
    vehicle: 'Chevrolet Equinox',
    service: 'Windshield Replacement',
    before: '/red-chevy-suv-before.jpg',
    after: '/red-chevy-suv-after.jpg',
  },
];

const VISIBLE_COUNT = 6;

export default function GalleryPage() {
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, VISIBLE_COUNT);
  const hasMore = projects.length > VISIBLE_COUNT;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <FadeIn onMount>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Real before &amp; after results from real customers
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {visibleProjects.map((project, index) => (
            <FadeIn key={project.id} delay={Math.min(index * 0.08, 0.3)}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                {/* Vehicle info bar */}
                <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                  <h3 className="font-bold text-brand-black">{project.vehicle}</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full">
                    {project.service}
                  </span>
                </div>

                {/* Before / After side by side */}
                <div className="grid grid-cols-2">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.before} alt={`${project.vehicle} before`} className="w-full aspect-[4/3] object-cover" />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.after} alt={`${project.vehicle} after`} className="w-full aspect-[4/3] object-cover" />
                    <span className="absolute top-2 right-2 bg-brand-blue/80 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                      After
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Show All Button */}
          {hasMore && !showAll && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
              >
                <span>Show All Gallery</span>
                <FiChevronDown className="text-xl" />
              </button>
              <p className="text-sm text-brand-grey mt-3">
                {projects.length - VISIBLE_COUNT} more {projects.length - VISIBLE_COUNT === 1 ? 'project' : 'projects'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready for Quality Service?</h2>
            <p className="text-gray-200 mb-6">
              Let us add your vehicle to our gallery of satisfied customers!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <button className="w-full sm:w-auto px-8 py-3 bg-white text-brand-blue rounded-lg font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
                  Get a Free Quote
                </button>
              </a>
              <a
                href="tel:3854431606"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/20 text-white rounded-lg font-bold border border-white/30 hover:bg-white/30 active:scale-[0.98] transition-all"
              >
                <FiPhone />
                <span>(385) 443-1606</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}