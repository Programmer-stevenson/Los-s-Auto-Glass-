import express, { Request, Response } from 'express';
import { auth, adminOnly, staffOnly } from '../middleware/auth';
import Booking from '../models/Booking';
import User from '../models/User';
import Contact from '../models/Contact';

const router = express.Router();

// Dashboard stats (public for demo - add auth in production)
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayBookings,
      weekBookings,
      monthRevenueResult,
      pendingContacts,
      confirmedToday,
      pendingPayments
    ] = await Promise.all([
      Booking.countDocuments({
        'appointment.date': { $gte: today, $lt: tomorrow }
      }),
      Booking.countDocuments({
        'appointment.date': { $gte: weekStart }
      }),
      Booking.aggregate([
        { 
          $match: { 
            'payment.status': 'paid',
            createdAt: { $gte: monthStart }
          } 
        },
        { $group: { _id: null, total: { $sum: '$payment.paidAmount' } } }
      ]),
      Contact.countDocuments({ status: 'new' }),
      Booking.countDocuments({
        'appointment.date': { $gte: today, $lt: tomorrow },
        status: 'confirmed'
      }),
      Booking.countDocuments({ 'payment.status': 'pending' })
    ]);

    res.json({
      todayBookings,
      weekBookings,
      monthRevenue: monthRevenueResult[0]?.total || 0,
      pendingContacts,
      confirmedToday,
      pendingPayments
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all bookings (public for demo - add auth in production)
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (date) {
      const [year, month, day] = (date as string).split('-').map(Number);
      const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      query['appointment.date'] = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('customer', 'firstName lastName email phone');

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
    console.error('Bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Get all contacts
router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Dashboard stats (authenticated)
router.get('/dashboard', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todayBookings,
      pendingBookings,
      totalRevenue,
      newContacts
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({
        'appointment.date': {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$payment.paidAmount' } } }
      ]),
      Contact.countDocuments({ status: 'new' })
    ]);

    res.json({
      stats: {
        totalBookings,
        todayBookings,
        pendingBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        newContacts
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// Update booking (admin)
router.patch('/bookings/:id', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { status, notes, assignedTechnician } = req.body;
    
    const updates: any = {};
    if (status) updates.status = status;
    if (notes) updates['notes.internal'] = notes;
    if (assignedTechnician) updates.assignedTechnician = assignedTechnician;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate('customer', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Get all users (admin only)
router.get('/users', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (admin only)
router.patch('/users/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { role, isActive } = req.body;
    
    const updates: any = {};
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
