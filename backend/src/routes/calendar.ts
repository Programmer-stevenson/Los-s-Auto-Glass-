import express, { Request, Response } from 'express';
import calendarService from '../utils/calendar';
import { auth, staffOnly } from '../middleware/auth';
import BlockedSlot from '../models/BlockedSlot';

const router = express.Router();

// Get available slots for a date
router.get('/slots/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const slots = await calendarService.getAvailableSlots(date);
    res.json({ date, slots, count: slots.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// Get calendar overview
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    
    const startDate = start ? new Date(start as string) : new Date();
    const endDate = end ? new Date(end as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const calendar = await calendarService.getCalendarOverview(startDate, endDate);
    res.json({ calendar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Check slot availability
router.get('/check', async (req: Request, res: Response) => {
  try {
    const { date, timeSlot } = req.query;
    
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and time slot required' });
    }

    const available = await calendarService.isSlotAvailable(
      date as string, 
      timeSlot as string
    );
    
    res.json({ date, timeSlot, available });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Get bookings for a date (staff only)
router.get('/bookings/:date', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const bookings = await calendarService.getBookingsForDate(date);
    res.json({ date, bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Block a slot (staff only)
router.post('/block', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { date, timeSlot, reason, description, isAllDay } = req.body;

    const blockedSlot = new BlockedSlot({
      date: new Date(date),
      timeSlot: isAllDay ? undefined : timeSlot,
      reason: reason || 'other',
      description,
      isAllDay: isAllDay || false,
      createdBy: req.user!._id
    });

    await blockedSlot.save();
    res.status(201).json({ message: 'Slot blocked', blockedSlot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block slot' });
  }
});

// Unblock a slot (staff only)
router.delete('/block/:id', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    await BlockedSlot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot unblocked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock slot' });
  }
});

export default router;
