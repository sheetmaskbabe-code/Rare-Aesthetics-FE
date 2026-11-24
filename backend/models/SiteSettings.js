import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'site_settings', unique: true },
    brandName: { type: String, default: 'My Rare Aesthetics' },
    tagline: { type: String, default: 'Where Science Meets Beauty Vision' },
    founderName: { type: String, default: 'Lindi-Grace' },
    contactEmail: { type: String, default: 'info@mraesthetics.co.za' },
    contactPhone: { type: String, default: '+27 (0) 12 345 6789' },
    address: { type: String, default: 'Pretoria, Gauteng, South Africa' },
    businessHours: { type: String, default: 'Mon - Fri: 08:30 - 17:00 (SAST)' },
    announcementText: { type: String, default: 'Now accepting custom cosmetic formulation requests for 2026/2027.' },
    announcementActive: { type: Boolean, default: true },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    linkedinUrl: { type: String, default: 'https://linkedin.com' },
    whatsappNumber: { type: String, default: '+27820000000' },
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
