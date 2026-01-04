import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import { services } from '../config/services';
import { auth, optionalAuth } from '../middleware/auth';
import calendarService from '../utils/calendar';
import emailService from '../utils/email';
import smsService from '../utils/sms';

const router = express.Router();

// Create booking
router.post('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, email, phone,
      serviceId, vehicle, appointmentDate, timeSlot,
      isMobileService, location, notes, useInsurance, insuranceInfo
    } = req.body;

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(400).json({ error: 'Invalid service' });
    }

    const isAvailable = await calendarService.isSlotAvailable(appointmentDate, timeSlot);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const bookingData: any = {
      service: {
        serviceId: service.id,
        name: service.name,
        price: service.basePrice,
        estimatedDuration: service.estimatedDuration
      },
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin || '',
        licensePlate: vehicle.licensePlate || '',
        color: vehicle.color || ''
      },
      appointment: {
        date: new Date(appointmentDate),
        timeSlot,
        isMobileService: isMobileService || false
      },
      location: {
        type: isMobileService ? 'customer-location' : 'shop',
        address: location?.address || {},
        notes: location?.notes || ''
      },
      payment: {
        totalAmount: service.basePrice,
        status: 'pending'
      },
      notes: { customer: notes || '' }
    };

    if (req.user) {
      bookingData.customer = req.user._id;
    } else {
      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ error: 'Contact info required' });
      }
      bookingData.guestInfo = { firstName, lastName, email, phone };
    }

    if (useInsurance) {
      bookingData.insurance = {
        useInsurance: true,
        company: insuranceInfo?.company || '',
        policyNumber: insuranceInfo?.policyNumber || ''
      };
    }

    const booking = new Booking(bookingData);
    await booking.save();

    const customerEmail = req.user?.email || email;
    const customerPhone = req.user?.phone || phone;
    
    // Send email confirmation
    try {
      await emailService.sendBookingConfirmation(booking, customerEmail);
    } catch (e) {
      console.error('Email failed:', e);
    }

    // Send SMS confirmation
    try {
      await smsService.sendBookingConfirmation({
        firstName,
        lastName,
        phone: customerPhone,
        appointment: booking.appointment,
        bookingNumber: booking.bookingNumber,
        service: booking.service
      });
    } catch (e) {
      console.error('SMS failed:', e);
    }

    res.status(201).json({
      message: 'Booking created',
      booking: {
        bookingNumber: booking.bookingNumber,
        service: booking.service,
        appointment: booking.appointment,
        vehicle: booking.vehicle,
        payment: booking.payment,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { customer: req.user!._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .sort({ 'appointment.date': -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Lookup booking (for guests)
router.get('/lookup', async (req: Request, res: Response) => {
  try {
    const { bookingNumber, email } = req.query;

    if (!bookingNumber || !email) {
      return res.status(400).json({ error: 'Booking number and email required' });
    }

    const booking = await Booking.findOne({ 
      bookingNumber: (bookingNumber as string).toUpperCase() 
    }).populate('customer', 'email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingEmail = booking.guestInfo?.email || (booking.customer as any)?.email;
    if (bookingEmail?.toLowerCase() !== (email as string).toLowerCase()) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to lookup booking' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!['admin', 'technician'].includes(req.user!.role)) {
      if (booking.customer?.toString() !== req.user!._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
router.post('/:id/cancel', auth, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customer?.toString() !== req.user!._id.toString() && 
        !['admin'].includes(req.user!.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!booking.canCancel()) {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      reason: req.body.reason || 'Customer requested cancellation',
      cancelledBy: 'customer'
    };
    await booking.save();

    // Send cancellation SMS
    try {
      const phone = booking.guestInfo?.phone || (booking.customer as any)?.phone;
      if (phone) {
        await smsService.sendBookingCancellation({
          phone,
          bookingNumber: booking.bookingNumber,
          appointment: booking.appointment
        });
      }
    } catch (e) {
      console.error('Cancellation SMS failed:', e);
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
