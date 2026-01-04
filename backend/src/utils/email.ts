import nodemailer from 'nodemailer';
import { IBooking, IContact } from '../types';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email not configured. Emails will be logged to console.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    this.isConfigured = true;
  }

  private getBookingConfirmationTemplate(booking: IBooking): string {
    const appointmentDate = new Date(booking.appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed! ✓</h1>
      <p>Los Auto & Glass</p>
    </div>
    <div class="content">
      <p>Thank you for choosing Los Auto & Glass. Your appointment has been confirmed.</p>
      
      <div class="highlight">
        <strong>Booking Number:</strong> ${booking.bookingNumber}
      </div>
      
      <div class="booking-details">
        <h3>Appointment Details</h3>
        <div class="detail-row"><strong>Service:</strong> ${booking.service.name}</div>
        <div class="detail-row"><strong>Date:</strong> ${appointmentDate}</div>
        <div class="detail-row"><strong>Time:</strong> ${booking.appointment.timeSlot}</div>
        <div class="detail-row"><strong>Vehicle:</strong> ${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}</div>
        <div class="detail-row"><strong>Total:</strong> $${booking.payment.totalAmount.toFixed(2)}</div>
      </div>
      
      <p>Need to reschedule or cancel? Contact us at least 24 hours before your appointment.</p>
    </div>
    <div class="footer">
      <p>${process.env.BUSINESS_NAME || 'Los Auto & Glass'}</p>
      <p>Phone: ${process.env.BUSINESS_PHONE || '(385) 424-6781'}</p>
    </div>
  </div>
</body>
</html>`;
  }

  private getReminderTemplate(booking: IBooking): string {
    const appointmentDate = new Date(booking.appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #fbbf24; color: #1f2937; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .reminder-box { background: white; padding: 20px; border-radius: 8px; text-align: center; }
    .time { font-size: 36px; color: #1e40af; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Appointment Reminder</h1>
    </div>
    <div class="content">
      <p>This is a friendly reminder about your upcoming appointment.</p>
      <div class="reminder-box">
        <p><strong>${appointmentDate}</strong></p>
        <p class="time">${booking.appointment.timeSlot}</p>
        <p>${booking.service.name}</p>
        <p>${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  private getContactNotificationTemplate(contact: IContact): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field"><span class="label">Name:</span> ${contact.name}</div>
      <div class="field"><span class="label">Email:</span> ${contact.email}</div>
      <div class="field"><span class="label">Phone:</span> ${contact.phone}</div>
      <div class="field"><span class="label">Service:</span> ${contact.service}</div>
      <div class="field"><span class="label">Message:</span><br>${contact.message || 'No message'}</div>
    </div>
  </div>
</body>
</html>`;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<any> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `Los Auto & Glass <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, '')
    };

    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email would be sent:');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      return { messageId: 'not-configured' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(booking: IBooking, email: string): Promise<any> {
    const html = this.getBookingConfirmationTemplate(booking);
    return this.sendEmail(email, `Booking Confirmed - ${booking.bookingNumber}`, html);
  }

  async sendReminder(booking: IBooking, email: string): Promise<any> {
    const html = this.getReminderTemplate(booking);
    return this.sendEmail(email, `Reminder: Your appointment is tomorrow`, html);
  }

  async sendContactNotification(contact: IContact): Promise<any> {
    const html = this.getContactNotificationTemplate(contact);
    const adminEmail = process.env.BUSINESS_EMAIL || process.env.EMAIL_USER || '';
    return this.sendEmail(adminEmail, `New Contact Form: ${contact.name}`, html);
  }
}

export default new EmailService();
