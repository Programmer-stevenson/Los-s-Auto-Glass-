import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import smsService from '../utils/sms';

const router = express.Router();

/**
 * Twilio Webhook - Receives incoming SMS messages
 * 
 * Setup in Twilio Console:
 * 1. Go to Phone Numbers → Your Number
 * 2. Under "Messaging", set webhook URL to: https://yourdomain.com/api/sms/webhook
 * 3. Method: POST
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { From, Body } = req.body;
    
    if (!From || !Body) {
      return res.status(400).send('<Response></Response>');
    }

    const phone = From;
    const message = Body.trim().toUpperCase();
    
    console.log(`📱 Incoming SMS from ${phone}: ${message}`);

    // Find most recent booking for this phone number
    const booking = await Booking.findOne({
      $or: [
        { 'guestInfo.phone': { $regex: phone.replace('+1', '').slice(-10) } },
        { 'guestInfo.phone': { $regex: phone.slice(-10) } }
      ],
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ createdAt: -1 });

    // Handle different commands
    switch (message) {
      case 'Y':
      case 'YES':
      case 'CONFIRM':
        if (booking) {
          booking.status = 'confirmed';
          await booking.save();
          await smsService.sendConfirmationAck(phone, booking.bookingNumber);
          console.log(`✅ Booking ${booking.bookingNumber} confirmed via SMS`);
        } else {
          await smsService.sendSMS(phone, "We couldn't find an active booking for your number. Please call us at " + process.env.BUSINESS_PHONE);
        }
        break;

      case 'C':
      case 'CANCEL':
        if (booking) {
          booking.status = 'cancelled';
          booking.cancellation = {
            cancelledAt: new Date(),
            reason: 'Cancelled via SMS',
            cancelledBy: 'customer'
          };
          await booking.save();
          await smsService.sendBookingCancellation({
            phone,
            bookingNumber: booking.bookingNumber,
            appointment: booking.appointment
          });
          
          // Notify business of cancellation
          const businessPhone = process.env.BUSINESS_NOTIFY_PHONE;
          if (businessPhone) {
            await smsService.sendSMS(businessPhone, 
              `⚠️ CANCELLATION\n\nBooking ${booking.bookingNumber} was cancelled via SMS by customer.\n\nPhone: ${phone}`
            );
          }
          console.log(`❌ Booking ${booking.bookingNumber} cancelled via SMS`);
        } else {
          await smsService.sendSMS(phone, "We couldn't find an active booking to cancel. Please call us at " + process.env.BUSINESS_PHONE);
        }
        break;

      case 'R':
      case 'RESCHEDULE':
        if (booking) {
          // Mark as needing reschedule
          booking.notes = booking.notes || {};
          (booking.notes as any).rescheduleRequested = true;
          (booking.notes as any).rescheduleRequestedAt = new Date();
          await booking.save();
          
          await smsService.sendRescheduleRequest(phone, booking.bookingNumber);
          
          // Notify business
          const businessPhone = process.env.BUSINESS_NOTIFY_PHONE;
          if (businessPhone) {
            await smsService.sendSMS(businessPhone, 
              `📅 RESCHEDULE REQUEST\n\nBooking ${booking.bookingNumber}\nPhone: ${phone}\n\nPlease call customer to reschedule.`
            );
          }
          console.log(`🔄 Reschedule requested for ${booking.bookingNumber}`);
        } else {
          await smsService.sendSMS(phone, "We couldn't find an active booking. Please call us at " + process.env.BUSINESS_PHONE);
        }
        break;

      case 'HELP':
      case 'INFO':
        await smsService.sendHelpResponse(phone);
        break;

      case 'STOP':
      case 'UNSUBSCRIBE':
        // Twilio handles STOP automatically, but we can log it
        console.log(`🛑 ${phone} opted out of SMS`);
        // You could store this in a database to prevent future messages
        break;

      default:
        // Unknown command
        await smsService.sendUnknownCommand(phone);
        break;
    }

    // Return TwiML response (empty is fine)
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');

  } catch (error) {
    console.error('SMS webhook error:', error);
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
  }
});

/**
 * Get SMS status (for checking delivery)
 */
router.get('/status/:messageSid', async (req: Request, res: Response) => {
  try {
    // This would require storing message SIDs and checking with Twilio API
    res.json({ message: 'Status check not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

export default router;
