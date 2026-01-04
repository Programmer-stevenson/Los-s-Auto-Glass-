import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize client only if credentials exist
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

const BUSINESS_NAME = process.env.BUSINESS_NAME || "Los's Auto Glass";
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || '(385) 424-6781';

/**
 * Send SMS message
 */
export const sendSMS = async (to: string, body: string): Promise<any> => {
  if (!client) {
    console.log('[SMS DISABLED] Would send to', to, ':', body);
    return { success: false, reason: 'Twilio not configured' };
  }

  try {
    // Format phone number to E.164
    const formattedPhone = formatPhoneNumber(to);
    
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to: formattedPhone,
    });

    console.log(`✅ SMS sent to ${formattedPhone}: ${message.sid}`);
    return { success: true, sid: message.sid, status: message.status };
  } catch (error: any) {
    console.error('❌ SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Format phone number to E.164 format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Add US country code if not present
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  return `+${digits}`;
};

/**
 * Send booking confirmation SMS
 */
export const sendBookingConfirmation = async (booking: any): Promise<any> => {
  const { firstName, lastName, phone, appointment, bookingNumber, service } = booking;
  
  if (!phone) {
    console.log('No phone number for booking confirmation');
    return { success: false, reason: 'No phone number' };
  }

  const date = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const message = 
    `${BUSINESS_NAME}: Your appointment is confirmed! ✅\n\n` +
    `📅 ${date}\n` +
    `⏰ ${appointment.timeSlot}\n` +
    `🔧 ${service.name}\n` +
    `🔖 Ref: ${bookingNumber}\n\n` +
    `Reply:\n` +
    `C - Cancel appointment\n` +
    `R - Request reschedule\n` +
    `HELP - Get assistance`;

  return sendSMS(phone, message);
};

/**
 * Send appointment reminder SMS (24 hours before)
 */
export const sendAppointmentReminder = async (booking: any): Promise<any> => {
  const { firstName, phone, appointment, bookingNumber } = booking;
  
  if (!phone) return { success: false, reason: 'No phone number' };

  const date = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const message = 
    `${BUSINESS_NAME} Reminder: Your appointment is TOMORROW! 📅\n\n` +
    `⏰ ${appointment.timeSlot}\n` +
    `🔖 Ref: ${bookingNumber}\n\n` +
    `Reply:\n` +
    `Y - Confirm attendance\n` +
    `C - Cancel appointment\n` +
    `R - Request reschedule`;

  return sendSMS(phone, message);
};

/**
 * Send contact form notification to business
 */
export const sendContactNotification = async (contact: any): Promise<any> => {
  const businessPhone = process.env.BUSINESS_NOTIFY_PHONE || fromPhone;
  
  if (!businessPhone || !client) {
    console.log('[SMS DISABLED] New contact form submission:', contact.name);
    return { success: false, reason: 'Notifications not configured' };
  }

  const message = 
    `📩 New Contact Form!\n\n` +
    `Name: ${contact.name}\n` +
    `Phone: ${contact.phone}\n` +
    `Email: ${contact.email}\n` +
    `Service: ${contact.service || 'Not specified'}\n\n` +
    `Message: ${contact.message?.substring(0, 100) || 'None'}`;

  return sendSMS(businessPhone, message);
};

/**
 * Send SMS to customer after contact form submission
 */
export const sendContactAutoReply = async (contact: any): Promise<any> => {
  if (!contact.phone) {
    return { success: false, reason: 'No phone number' };
  }

  const message = 
    `Thanks for contacting ${BUSINESS_NAME}! 🚗\n\n` +
    `We received your message and will get back to you within 24 hours.\n\n` +
    `Need immediate help? Call ${BUSINESS_PHONE}`;

  return sendSMS(contact.phone, message);
};

/**
 * Send booking cancellation SMS
 */
export const sendBookingCancellation = async (booking: any): Promise<any> => {
  const { phone, bookingNumber, appointment } = booking;
  
  if (!phone) return { success: false, reason: 'No phone number' };

  const date = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const message = 
    `${BUSINESS_NAME}: Your appointment has been cancelled.\n\n` +
    `📅 ${date} at ${appointment.timeSlot}\n` +
    `🔖 Ref: ${bookingNumber}\n\n` +
    `To rebook, visit our website or call ${BUSINESS_PHONE}`;

  return sendSMS(phone, message);
};

/**
 * Send reschedule request confirmation
 */
export const sendRescheduleRequest = async (phone: string, bookingNumber: string): Promise<any> => {
  const message = 
    `${BUSINESS_NAME}: We received your reschedule request for booking ${bookingNumber}.\n\n` +
    `We'll call you within 1 hour to find a new time.\n\n` +
    `Or call us now: ${BUSINESS_PHONE}`;

  return sendSMS(phone, message);
};

/**
 * Send confirmation acknowledgment
 */
export const sendConfirmationAck = async (phone: string, bookingNumber: string): Promise<any> => {
  const message = 
    `${BUSINESS_NAME}: Thanks for confirming! ✅\n\n` +
    `We'll see you at your appointment.\n` +
    `🔖 Ref: ${bookingNumber}`;

  return sendSMS(phone, message);
};

/**
 * Send help response
 */
export const sendHelpResponse = async (phone: string): Promise<any> => {
  const message = 
    `${BUSINESS_NAME} Help:\n\n` +
    `📞 Call: ${BUSINESS_PHONE}\n` +
    `🌐 Web: lossautoglass.com\n\n` +
    `Text Commands:\n` +
    `Y - Confirm appointment\n` +
    `C - Cancel appointment\n` +
    `R - Request reschedule\n` +
    `STOP - Opt out of texts`;

  return sendSMS(phone, message);
};

/**
 * Send unknown command response
 */
export const sendUnknownCommand = async (phone: string): Promise<any> => {
  const message = 
    `${BUSINESS_NAME}: Sorry, we didn't understand that.\n\n` +
    `Reply:\n` +
    `Y - Confirm\n` +
    `C - Cancel\n` +
    `R - Reschedule\n` +
    `HELP - Get assistance\n\n` +
    `Or call ${BUSINESS_PHONE}`;

  return sendSMS(phone, message);
};

export default {
  sendSMS,
  formatPhoneNumber,
  sendBookingConfirmation,
  sendAppointmentReminder,
  sendContactNotification,
  sendContactAutoReply,
  sendBookingCancellation,
  sendRescheduleRequest,
  sendConfirmationAck,
  sendHelpResponse,
  sendUnknownCommand,
};
