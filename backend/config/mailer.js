import nodemailer from 'nodemailer';

let transporter = null;

export const getMailer = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return transporter;
};

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const mailer = getMailer();
    if (!mailer) {
      console.warn('[SMTP] Mailer not configured. Please add SMTP_USER and SMTP_PASS in .env');
      return { skipped: true, reason: 'SMTP credentials missing in .env' };
    }

    const fromName = process.env.SMTP_FROM_NAME || 'My Rare Aesthetics';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    const info = await mailer.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('[SMTP] Email dispatched:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[SMTP] Failed to send email:', error);
    return { success: false, error: error.message };
  }
};
