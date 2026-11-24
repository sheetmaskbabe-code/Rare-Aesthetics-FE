import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { sendMail } from '../config/mailer.js';

const router = Router();

// In-memory store for active Admin OTP
let activeOtpSession = null;

// Step 1: Validate password & send 6-digit OTP to aestheticsrare502@gmail.com
router.post('/login', async (req, res) => {
  const { password } = req.body || {};
  const expectedPassword = process.env.ADMIN_PASSWORD || 'Rare1357';
  const targetEmail = process.env.ADMIN_EMAIL || 'aestheticsrare502@gmail.com';

  if (!password || password !== expectedPassword) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with 10-minute expiry
  activeOtpSession = {
    code: otp,
    email: targetEmail,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };

  // Dispatch OTP email
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 32px; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #35213b; margin: 0; font-size: 24px; font-weight: 700;">Rare Aesthetics</h2>
        <p style="color: #7e22ce; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Admin Security Verification</p>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Use the one-time code below to complete your login:</p>
        <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #6b21a8; font-family: monospace; padding: 12px 0; background: #ffffff; border-radius: 8px; border: 1px dashed #d8b4fe; display: inline-block; width: 85%;">
          ${otp}
        </div>
        <p style="margin: 14px 0 0 0; font-size: 12px; color: #94a3b8;">This code expires in 10 minutes.</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
        If you did not initiate this login to the Rare Aesthetics Admin Portal, please check your credentials immediately.
      </p>
    </div>
  `;

  const mailResult = await sendMail({
    to: targetEmail,
    subject: `Rare Aesthetics Admin Login Code: ${otp}`,
    text: `Your Rare Aesthetics Admin verification code is: ${otp}. It will expire in 10 minutes.`,
    html: htmlContent,
  });

  if (!mailResult.success && !mailResult.skipped) {
    return res.status(500).json({
      error: `Failed to dispatch OTP email: ${mailResult.error || 'SMTP delivery failure'}`,
    });
  }

  return res.json({
    requireOtp: true,
    email: targetEmail,
    message: `Verification code sent to ${targetEmail}`,
  });
});

// Step 2: Verify OTP and grant JWT Admin Token
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body || {};
  const jwtSecret = process.env.JWT_SECRET || 'rare_aesthetics_super_secret_jwt_key_2026';

  if (!activeOtpSession) {
    return res.status(400).json({ error: 'No active login session. Please enter your password again.' });
  }

  if (Date.now() > activeOtpSession.expiresAt) {
    activeOtpSession = null;
    return res.status(400).json({ error: 'The verification code has expired. Please log in again.' });
  }

  if (activeOtpSession.attempts >= 5) {
    activeOtpSession = null;
    return res.status(400).json({ error: 'Too many incorrect attempts. Please log in again.' });
  }

  if (!otp || String(otp).trim() !== activeOtpSession.code) {
    activeOtpSession.attempts += 1;
    const remaining = 5 - activeOtpSession.attempts;
    return res.status(400).json({
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    });
  }

  // OTP verified successfully
  activeOtpSession = null;

  const token = jwt.sign({ role: 'admin', user: 'admin' }, jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    token,
    message: 'Authenticated successfully',
  });
});

// Resend OTP endpoint
router.post('/resend-otp', async (req, res) => {
  const { password } = req.body || {};
  const expectedPassword = process.env.ADMIN_PASSWORD || 'Rare1357';
  const targetEmail = process.env.ADMIN_EMAIL || 'aestheticsrare502@gmail.com';

  if (!password || password !== expectedPassword) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  activeOtpSession = {
    code: otp,
    email: targetEmail,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 32px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #35213b; margin: 0; font-size: 24px; font-weight: 700;">Rare Aesthetics</h2>
        <p style="color: #7e22ce; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Resent Security Code</p>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Your new one-time login verification code is:</p>
        <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #6b21a8; font-family: monospace; padding: 12px 0; background: #ffffff; border-radius: 8px; border: 1px dashed #d8b4fe; display: inline-block; width: 85%;">
          ${otp}
        </div>
        <p style="margin: 14px 0 0 0; font-size: 12px; color: #94a3b8;">This code expires in 10 minutes.</p>
      </div>
    </div>
  `;

  await sendMail({
    to: targetEmail,
    subject: `Your New Rare Aesthetics Admin Login Code: ${otp}`,
    text: `Your new verification code is: ${otp}. Valid for 10 minutes.`,
    html: htmlContent,
  });

  return res.json({
    success: true,
    message: `A new code has been sent to ${targetEmail}`,
  });
});

export default router;
