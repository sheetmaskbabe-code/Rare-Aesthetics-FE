import { Router } from 'express';
import mongoose from 'mongoose';
import { Enquiry } from '../models/Enquiry.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';
import { sendMail } from '../config/mailer.js';

const router = Router();

// POST /api/enquiry - Public contact form submission
router.post('/', async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      company,
      service,
      timeline,
      budget,
      message,
      description,
      attachmentName,
      attachmentUrl,
      attachmentPublicId,
    } = req.body || {};

    const clientName = name || fullName;
    const clientMessage = message || description || '';

    if (!clientName || !email) {
      return res.status(400).json({ error: 'Name and email are required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is currently offline. Please configure MongoDB.' });
    }

    const id = `enquiry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newEnquiry = await Enquiry.create({
      id,
      name: clientName,
      email,
      phone: phone || '',
      company: company || '',
      service: service || '',
      timeline: timeline || '',
      budget: budget || '',
      message: clientMessage,
      attachmentName: attachmentName || null,
      attachmentUrl: attachmentUrl || null,
      attachmentPublicId: attachmentPublicId || null,
      status: 'new',
    });

    // Send customer notification via SMTP if configured
    sendMail({
      to: email,
      subject: `Consultation Received – My Rare Aesthetics`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #6a1b9a; margin-top: 0;">My Rare Aesthetics</h2>
          <p>Hi <strong>${clientName}</strong>,</p>
          <p>Thank you for scheduling a consultation with us. We have successfully received your request:</p>
          <div style="background: #fbf7fb; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #f3e5f5;">
            <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${service || 'Consultation Booking'}</p>
            <p style="margin: 0; white-space: pre-wrap;">${clientMessage || ''}</p>
          </div>
          <p>We will update you with a confirmation email shortly.</p>
          <p style="margin-top: 25px; color: #777; font-size: 13px;">Warm regards,<br/><strong>My Rare Aesthetics Team</strong></p>
        </div>
      `,
    }).catch((err) => console.warn('[SMTP] Background confirmation error:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Enquiry received successfully',
      enquiry: newEnquiry,
    });
  } catch (err) {
    console.error('[Enquiry] Create error:', err);
    return res.status(500).json({ error: 'Failed to record enquiry' });
  }
});

// Helper to parse appointment date, time, and name
function extractAppointmentDetails(enquiry) {
  const customerName = enquiry.name || 'Valued Customer';
  let appointmentDate = 'Scheduled Date';
  let appointmentTime = 'Scheduled Time';

  const message = enquiry.message || '';
  const service = enquiry.service || '';

  // 1. Try match from message: "Scheduled Date: Monday, November 23, 2026"
  const dateMatch = message.match(/Scheduled Date:\s*([^\n\r]+)/i);
  if (dateMatch && dateMatch[1]) {
    appointmentDate = dateMatch[1].trim();
  }

  // 2. Try match from message: "Selected Time: 12:30 pm"
  const timeMatch = message.match(/Selected Time:\s*([^\n\r]+)/i);
  if (timeMatch && timeMatch[1]) {
    appointmentTime = timeMatch[1].trim();
  }

  // 3. Fallback: match from service string e.g. "Consultation: Monday, November 23, 2026 at 12:30 pm"
  if (appointmentDate === 'Scheduled Date' && service.includes(' at ')) {
    const parts = service.replace(/^Consultation:\s*/i, '').split(' at ');
    if (parts.length >= 2) {
      appointmentDate = parts[0].trim();
      appointmentTime = parts[1].trim();
    }
  }

  return { customerName, appointmentDate, appointmentTime };
}

// Helper to send appointment confirmation email matching exact user template
async function sendAppointmentConfirmationEmail(enquiry) {
  if (!enquiry || !enquiry.email) {
    return { skipped: true, reason: 'No email address on consultation record' };
  }

  const { customerName, appointmentDate, appointmentTime } = extractAppointmentDetails(enquiry);

  const plainText = `Dear ${customerName},

Thank you for choosing us!

We are pleased to confirm that your appointment has been successfully booked.

Appointment Details:

- Name: ${customerName}
- Appointment Date: ${appointmentDate}
- Appointment Time: ${appointmentTime}

We kindly request you to arrive 5–10 minutes before your scheduled appointment.

If you need to reschedule or cancel your appointment, please contact us in advance.

We look forward to welcoming you!

Best Regards,  
Rare Aesthetics  
Thank you for choosing us.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.6;">
      <p style="margin-top: 0; font-size: 15px;">Dear <strong>${customerName}</strong>,</p>

      <p style="font-size: 15px;">Thank you for choosing us!</p>

      <p style="font-size: 15px; color: #047857; font-weight: 600;">We are pleased to confirm that your appointment has been successfully booked.</p>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #374151;">Appointment Details:</p>
        <ul style="margin: 0; padding-left: 18px; font-size: 14px; color: #1f2937;">
          <li style="margin-bottom: 6px;"><strong>Name:</strong> ${customerName}</li>
          <li style="margin-bottom: 6px;"><strong>Appointment Date:</strong> ${appointmentDate}</li>
          <li style="margin-bottom: 0;"><strong>Appointment Time:</strong> ${appointmentTime}</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #4b5563;">We kindly request you to arrive 5–10 minutes before your scheduled appointment.</p>

      <p style="font-size: 14px; color: #4b5563;">If you need to reschedule or cancel your appointment, please contact us in advance.</p>

      <p style="font-size: 15px; font-weight: 600; color: #111827; margin: 20px 0;">We look forward to welcoming you!</p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px; color: #4b5563; font-size: 14px;">
        <p style="margin: 0 0 4px 0;">Best Regards,</p>
        <p style="margin: 0 0 4px 0; color: #7c3aed; font-weight: bold; font-size: 15px;">Rare Aesthetics</p>
        <p style="margin: 0; font-style: italic; font-size: 13px; color: #6b7280;">Thank you for choosing us.</p>
      </div>
    </div>
  `;

  return await sendMail({
    to: enquiry.email,
    subject: `Appointment Confirmation – Rare Aesthetics`,
    text: plainText,
    html: html,
  });
}

// POST /api/enquiries/:id/send-confirmation - Manually send/resend appointment confirmation email
router.post('/:id/send-confirmation', requireAdmin, async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
      : { id: req.params.id };

    const enquiry = await Enquiry.findOne(query);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const mailResult = await sendAppointmentConfirmationEmail(enquiry);
    return res.json({ success: true, mailResult });
  } catch (err) {
    console.error('[Enquiry] Manual email send error:', err);
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// GET /api/enquiries - Admin view all enquiries
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ enquiries: [], message: 'MongoDB offline' });
    }
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return res.json({ enquiries });
  } catch (err) {
    console.error('[Enquiry] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve enquiries', enquiries: [] });
  }
});

// PATCH /api/enquiries/:id - Admin update enquiry status
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body || {};
    const validStatuses = ['new', 'in_review', 'reviewed', 'contacted', 'in-progress', 'in_discussion', 'completed', 'closed', 'accepted', 'declined'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (typeof notes === 'string') updateFields.notes = notes;

    const query = mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
      : { id: req.params.id };

    const updated = await Enquiry.findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    // Send appointment confirmation email when accepted
    if (status === 'accepted' && updated.email) {
      sendAppointmentConfirmationEmail(updated).catch((err) =>
        console.warn('[SMTP] Acceptance confirmation email warning:', err.message)
      );
    }

    return res.json({ success: true, enquiry: updated });
  } catch (err) {
    console.error('[Enquiry] Status update error:', err);
    return res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

// DELETE /api/enquiries/:id - Admin delete enquiry
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
      : { id: req.params.id };

    const enquiry = await Enquiry.findOne(query);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    // Delete attached file from Cloudinary if one exists
    if (enquiry.attachmentPublicId) {
      await deleteFromCloudinary(enquiry.attachmentPublicId, 'auto');
    }

    await Enquiry.deleteOne(query);
    return res.json({ success: true, message: 'Enquiry removed successfully' });
  } catch (err) {
    console.error('[Enquiry] Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
