'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiChevronRight, FiChevronLeft, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { servicesApi, calendarApi, bookingsApi } from '@/lib/api';
import { format, addDays, startOfDay } from 'date-fns';

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: number;
  features: string[];
}

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Form state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [vehicle, setVehicle] = useState({ year: '', make: '', model: '' });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [isMobileService, setIsMobileService] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [notes, setNotes] = useState('');

  // Calendar dates (next 14 days)
  const calendarDates = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i));

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadServices = async () => {
    try {
      const { services } = await servicesApi.getAll();
      setServices(services);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const loadTimeSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const { slots } = await calendarApi.getSlots(date);
      // Backend returns only available slots, so mark them all as available
      const slotsWithAvailability = slots.map((slot: any) => ({
        ...slot,
        available: true
      }));
      setAvailableSlots(slotsWithAvailability);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return !!vehicle.year && !!vehicle.make && !!vehicle.model;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: return !!contactInfo.firstName && !!contactInfo.lastName && !!contactInfo.email && !!contactInfo.phone;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        serviceId: selectedService!.id,
        vehicle: {
          year: parseInt(vehicle.year),
          make: vehicle.make,
          model: vehicle.model,
        },
        appointmentDate: selectedDate,
        timeSlot: selectedTime!.time,
        isMobileService,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        notes,
      };

      const { booking } = await bookingsApi.create(bookingData);
      toast.success('Booking created successfully!');
      router.push(`/booking/confirm?bookingNumber=${booking.bookingNumber}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (date: Date) => format(date, 'EEE');
  const getDayNumber = (date: Date) => format(date, 'd');
  const isSunday = (date: Date) => date.getDay() === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-black text-white overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Book Your Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200"
          >
            Schedule your auto glass service in minutes
          </motion.p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Vehicle' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Contact' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= s.num
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.num ? <FiCheck /> : s.num}
                  </div>
                  <span className="text-xs mt-1 text-brand-grey hidden sm:block">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s.num ? 'bg-brand-blue' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-brand-black mb-6">Select a Service</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-brand-blue bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-brand-blue/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-brand-black">{service.name}</h3>
                      {selectedService?.id === service.id && (
                        <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center">
                          <FiCheck className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                    <p className="text-brand-grey text-sm mb-3">{service.description}</p>
                    <p className="text-brand-blue font-bold">Starting at ${service.basePrice}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Vehicle Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-brand-black mb-6">Vehicle Information</h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">Year *</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={vehicle.year}
                      onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">Make *</label>
                    <input
                      type="text"
                      placeholder="Toyota"
                      value={vehicle.make}
                      onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">Model *</label>
                    <input
                      type="text"
                      placeholder="Camry"
                      value={vehicle.model}
                      onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Mobile Service Option */}
                <div className="mt-6 pt-6 border-t">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMobileService}
                      onChange={(e) => setIsMobileService(e.target.checked)}
                      className="w-5 h-5 text-brand-blue rounded mr-3"
                    />
                    <div>
                      <span className="font-semibold text-brand-black flex items-center">
                        <FiTruck className="mr-2 text-brand-blue" /> Mobile Service
                      </span>
                      <span className="text-sm text-brand-grey block">We come to your location</span>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-brand-black mb-6">
                <FiCalendar className="inline mr-2" /> Select Date & Time
              </h2>

              {/* Calendar */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-semibold text-brand-black mb-4">Choose a Date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const closed = isSunday(date);
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !closed && setSelectedDate(dateStr)}
                        disabled={closed}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-brand-blue text-white shadow-lg'
                            : closed
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-blue-50 hover:border-brand-blue border border-transparent'
                        }`}
                      >
                        <div className="text-xs font-medium">{getDayName(date)}</div>
                        <div className="text-lg font-bold">{getDayNumber(date)}</div>
                        {closed && <div className="text-xs">Closed</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-brand-black mb-4 flex items-center">
                    <FiClock className="mr-2 text-brand-blue" /> Available Times
                  </h3>

                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
                      <p className="text-brand-grey mt-2">Loading available times...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot)}
                          disabled={!slot.available}
                          className={`p-3 rounded-xl text-center transition-all ${
                            selectedTime?.time === slot.time
                              ? 'bg-brand-blue text-white shadow-lg'
                              : slot.available
                              ? 'bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-brand-blue'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.display}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-brand-grey text-center py-4">No available slots for this date</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-brand-black mb-6">
                <FiUser className="inline mr-2" /> Your Information
              </h2>

              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">First Name *</label>
                    <input
                      type="text"
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">
                      <FiMail className="inline mr-1" /> Email *
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-grey mb-2">
                      <FiPhone className="inline mr-1" /> Phone *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-brand-grey mb-2">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                    placeholder="Any special requests or details about your vehicle..."
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-xl mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-200">Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Vehicle</span>
                    <span className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Date</span>
                    <span className="font-medium">{selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Time</span>
                    <span className="font-medium">{selectedTime?.display}</span>
                  </div>
                  {isMobileService && (
                    <div className="flex justify-between">
                      <span className="text-gray-200">Service Type</span>
                      <span className="font-medium">Mobile Service</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-3 flex justify-between text-xl">
                    <span className="font-bold">Estimated Total</span>
                    <span className="font-bold">${selectedService?.basePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
              step === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-brand-black hover:bg-gray-300'
            }`}
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex items-center px-8 py-3 rounded-full font-bold transition-all ${
                canProceed()
                  ? 'bg-brand-blue text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue <FiChevronRight className="ml-2" />
            </button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              whileHover={{ scale: canProceed() && !loading ? 1.02 : 1 }}
              whileTap={{ scale: canProceed() && !loading ? 0.98 : 1 }}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                canProceed() && !loading
                  ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </motion.button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
