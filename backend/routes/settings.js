import { Router } from 'express';
import mongoose from 'mongoose';
import { SiteSettings } from '../models/SiteSettings.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/settings - Fetch current site settings
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        settings: {
          brandName: 'My Rare Aesthetics',
          tagline: 'Where Science Meets Beauty Vision',
          founderName: 'Lindi-Grace',
          contactEmail: 'info@mraesthetics.co.za',
          contactPhone: '+27 (0) 12 345 6789',
          address: 'Pretoria, Gauteng, South Africa',
          businessHours: 'Mon - Fri: 08:30 - 17:00 (SAST)',
          announcementText: 'Now accepting custom cosmetic formulation requests for 2026/2027.',
          announcementActive: true,
          instagramUrl: 'https://instagram.com',
          linkedinUrl: 'https://linkedin.com',
          whatsappNumber: '+27820000000',
        },
      });
    }

    let settings = await SiteSettings.findOne({ id: 'site_settings' }).lean();
    if (!settings) {
      settings = await SiteSettings.create({ id: 'site_settings' });
    }

    return res.json({ settings });
  } catch (err) {
    console.error('[Settings] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve site settings' });
  }
});

// POST /api/settings - Update site settings (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline' });
    }

    const updated = await SiteSettings.findOneAndUpdate(
      { id: 'site_settings' },
      { $set: payload },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[Settings] Update error:', err);
    return res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
