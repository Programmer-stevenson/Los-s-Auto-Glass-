import cron from 'node-cron';
import Booking from '../models/Booking';
import emailService from './email';
import smsService from './sms';

class CronJobs {
  private jobs: cron.ScheduledTask[] = [];

  sendReminders(): void {
    const job = cron.schedule('0 10 * * *', async () => {
      console.log('🔔 Running reminder job...');
      
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
          'appointment.date': { $gte: tomorrow, $lt: endOfTomorrow },
          status: { $in: ['pending', 'confirmed'] }
        }).populate('customer');

        for (const booking of bookings) {
          const email = (booking.customer as any)?.email || booking.guestInfo?.email;
          const phone = (booking.customer as any)?.phone || booking.guestInfo?.phone;
          
          // Send email reminder
          if (email) {
            try {
              await emailService.sendReminder(booking, email);
              booking.reminders.push({
                type: 'email',
                sentAt: new Date(),
                scheduledFor: booking.appointment.date
              });
              console.log(`📧 Email reminder sent for booking ${booking.bookingNumber}`);
            } catch (error) {
              console.error(`Failed to send email reminder for ${booking.bookingNumber}:`, error);
            }
          }

          // Send SMS reminder
          if (phone) {
            try {
              await smsService.sendAppointmentReminder({
                firstName: (booking.customer as any)?.firstName || booking.guestInfo?.firstName,
                phone,
                appointment: booking.appointment,
                bookingNumber: booking.bookingNumber
              });
              booking.reminders.push({
                type: 'sms',
                sentAt: new Date(),
                scheduledFor: booking.appointment.date
              });
              console.log(`📱 SMS reminder sent for booking ${booking.bookingNumber}`);
            } catch (error) {
              console.error(`Failed to send SMS reminder for ${booking.bookingNumber}:`, error);
            }
          }

          await booking.save();
        }

        console.log(`✅ Reminder job completed. Sent ${bookings.length} reminders.`);
      } catch (error) {
        console.error('Reminder job failed:', error);
      }
    });

    this.jobs.push(job);
    console.log('📅 Reminder job scheduled (daily at 10 AM)');
  }

  handleNoShows(): void {
    const job = cron.schedule('0 * * * *', async () => {
      console.log('🔍 Checking for no-shows...');
      
      try {
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

        const noShows = await Booking.find({
          'appointment.date': { $lt: twoHoursAgo },
          status: 'confirmed'
        });

        for (const booking of noShows) {
          booking.status = 'no-show';
          await booking.save();
          console.log(`⚠️ Marked as no-show: ${booking.bookingNumber}`);
        }

        if (noShows.length > 0) {
          console.log(`✅ Marked ${noShows.length} bookings as no-shows`);
        }
      } catch (error) {
        console.error('No-show check failed:', error);
      }
    });

    this.jobs.push(job);
    console.log('📅 No-show check scheduled (hourly)');
  }

  cleanupPending(): void {
    const job = cron.schedule('0 0 * * *', async () => {
      console.log('🧹 Cleaning up old pending bookings...');
      
      try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const result = await Booking.updateMany(
          {
            status: 'pending',
            'payment.status': 'pending',
            createdAt: { $lt: oneDayAgo }
          },
          {
            $set: {
              status: 'cancelled',
              'cancellation.cancelledAt': new Date(),
              'cancellation.reason': 'Auto-cancelled: No payment received within 24 hours',
              'cancellation.cancelledBy': 'system'
            }
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`✅ Cancelled ${result.modifiedCount} stale pending bookings`);
        }
      } catch (error) {
        console.error('Pending cleanup failed:', error);
      }
    });

    this.jobs.push(job);
    console.log('📅 Pending cleanup scheduled (daily at midnight)');
  }

  startAll(): void {
    console.log('\n🚀 Starting cron jobs...');
    this.sendReminders();
    this.handleNoShows();
    this.cleanupPending();
    console.log('✅ All cron jobs started\n');
  }

  stopAll(): void {
    this.jobs.forEach(job => job.stop());
    console.log('⏹️ All cron jobs stopped');
  }
}

export default new CronJobs();
