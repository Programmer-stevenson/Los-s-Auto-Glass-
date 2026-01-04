import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import { contactValidation } from '../middleware/validation';
import emailService from '../utils/email';
import smsService from '../utils/sms';
import { auth, staffOnly } from '../middleware/auth';

const router = express.Router();

// Submit contact form
router.post('/', contactValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      service,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();

    // Send notification email to admin
    try {
      await emailService.sendContactNotification(contact);
    } catch (e) {
      console.error('Contact notification email failed:', e);
    }

    // Send SMS notification to business
    try {
      await smsService.sendContactNotification(contact);
    } catch (e) {
      console.error('Contact notification SMS failed:', e);
    }

    // Send auto-reply SMS to customer
    try {
      await smsService.sendContactAutoReply(contact);
    } catch (e) {
      console.error('Contact auto-reply SMS failed:', e);
    }

    res.status(201).json({
      message: 'Thank you! We will be in touch soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all contacts (staff only)
router.get('/', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('assignedTo', 'firstName lastName');

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

// Update contact status (staff only)
router.patch('/:id', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { status, assignedTo } = req.body;
    
    const updates: any = {};
    if (status) updates.status = status;
    if (assignedTo) updates.assignedTo = assignedTo;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Add response to contact (staff only)
router.post('/:id/respond', auth, staffOnly, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          responses: {
            message,
            respondedBy: req.user!._id,
            respondedAt: new Date()
          }
        },
        $set: { status: 'responded' }
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add response' });
  }
});

export default router;
