import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import paypalService from '../utils/paypal';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

// Get PayPal client ID for frontend
router.get('/config', (req: Request, res: Response) => {
  res.json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
    mode: process.env.PAYPAL_MODE || 'sandbox'
  });
});

// Create PayPal order
router.post('/create-order', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { bookingId, bookingNumber } = req.body;

    let booking;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
    } else if (bookingNumber) {
      booking = await Booking.findOne({ bookingNumber });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.payment.status === 'paid') {
      return res.status(400).json({ error: 'Booking already paid' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const order = await paypalService.createOrder({
      amount: booking.payment.totalAmount,
      bookingNumber: booking.bookingNumber,
      description: `${booking.service.name} - ${booking.bookingNumber}`,
      returnUrl: `${frontendUrl}/finance/success?booking=${booking.bookingNumber}`,
      cancelUrl: `${frontendUrl}/finance/cancel`
    });

    booking.payment.transactions.push({
      paypalOrderId: order.orderId,
      amount: booking.payment.totalAmount,
      type: 'full-payment',
      status: 'created',
      timestamp: new Date()
    });
    await booking.save();

    res.json({
      orderId: order.orderId,
      approvalUrl: order.approvalUrl
    });
  } catch (error) {
    console.error('PayPal order error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Capture PayPal payment
router.post('/capture-order', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { orderId, bookingNumber } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    const booking = await Booking.findOne({ bookingNumber });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const capture = await paypalService.captureOrder(orderId);

    if (capture.status === 'COMPLETED') {
      booking.payment.status = 'paid';
      booking.payment.paidAmount = capture.amount;
      booking.status = 'confirmed';
      
      const transaction = booking.payment.transactions.find(
        t => t.paypalOrderId === orderId
      );
      if (transaction) {
        transaction.transactionId = capture.transactionId;
        transaction.status = 'completed';
      }
      
      await booking.save();

      res.json({
        success: true,
        message: 'Payment successful',
        booking: {
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          payment: booking.payment
        }
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// Get payment status
router.get('/status/:bookingNumber', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({ 
      bookingNumber: req.params.bookingNumber 
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      bookingNumber: booking.bookingNumber,
      paymentStatus: booking.payment.status,
      totalAmount: booking.payment.totalAmount,
      paidAmount: booking.payment.paidAmount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

export default router;
