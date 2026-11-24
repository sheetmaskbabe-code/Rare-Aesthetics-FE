import { Router } from 'express';
import mongoose from 'mongoose';
import { AboutPageContent } from '../models/AboutPageContent.js';
import { HomePageContent } from '../models/HomePageContent.js';

const router = Router();

const defaultAboutData = {
  companyEyebrow: 'The company',
  companyTitle: 'Cosmetic product development & consulting',
  companyParagraph1:
    'My Rare Aesthetics is a Pretoria-based consultancy focused on cosmetic product development, formulation, manufacturing support and brand-minded consulting.',
  companyParagraph2:
    'We partner with founders and brands who want a refined pathway from concept to product — combining research, formulation thinking, evaluation support and practical production coordination.',
  companyParagraph3:
    'Our work is rooted in luxury presentation and scientific care: clear process, quality-focused development, and respect for the artistry of beauty brands.',
  companyImage:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',

  founderEyebrow: 'Founder',
  founderName: 'Lindi-Grace',
  founderTitle: 'Cosmetic Chemist | Beauty Innovator | Founder of The RA Group',
  founderBio1:
    'Probably wearing a sheet mask, practising yoga, or experimenting with the next big skincare innovation. Passionate about the science behind beauty, I believe that great skincare is where creativity, research, and innovation come together.',
  founderBio2:
    'Building The RA Group, with a vision to redefine the beauty and cosmetics industry through innovative formulations, premium-quality products, and science-backed skincare solutions.',
  founderBio3:
    'From developing effective skincare and haircare formulations to exploring new beauty trends, every idea begins with curiosity and a commitment to excellence. My mission is to create products that inspire confidence, celebrate individuality, and make beauty more accessible.',
  founderImage: '/images/director.jpg',
  featuredIn: 'Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR',

  missionTitle: 'Mission',
  missionText:
    'To help beauty brands transform innovative ideas into thoughtfully developed cosmetic products through formulation, research, testing support and manufacturing coordination.',
  visionTitle: 'Vision',
  visionText:
    'To be a trusted partner for beauty entrepreneurs and established brands seeking premium, science-informed product development with elegance and clarity.',

  philosophyEyebrow: 'Philosophy',
  philosophyTitle: 'Our approach to cosmetic innovation',
  philosophyDescription:
    'We believe beautiful products are born where scientific rigour meets brand imagination.',
  philosophyPoints: [
    'Research before formulation decisions',
    'Sensory experience as a design priority',
    'Quality-focused development processes',
    'Clear communication and project coordination',
    'Brand identity aligned with product reality',
    'Practical pathways toward manufacturing readiness',
  ],
};

// GET /api/about - Retrieve about page content
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ about: defaultAboutData, offline: true });
    }

    let content = await AboutPageContent.findOne({ id: 'about_page' }).lean();

    if (!content) {
      content = await AboutPageContent.findOneAndUpdate(
        { id: 'about_page' },
        { $setOnInsert: defaultAboutData },
        { upsert: true, returnDocument: 'after' }
      ).lean();
    }

    return res.json({ success: true, about: content });
  } catch (err) {
    console.error('[About GET] Error:', err);
    return res.json({ about: defaultAboutData, fallback: true });
  }
});

// POST /api/about - Update about page content (and automatically sync Home Page About section)
router.post('/', async (req, res) => {
  try {
    const updateData = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database disconnected. Cannot save about page.' });
    }

    const updated = await AboutPageContent.findOneAndUpdate(
      { id: 'about_page' },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    // Synchronize Company card (image & info) to Home Page About section
    try {
      const homeUpdates = {};
      if (updateData.companyImage) {
        homeUpdates.aboutImage = updateData.companyImage;
      }
      if (updateData.companyTitle) {
        homeUpdates.aboutTitle = updateData.companyTitle;
      }
      if (updateData.companyParagraph1) {
        homeUpdates.aboutDescription = updateData.companyParagraph1;
      }
      if (updateData.companyParagraph2) {
        homeUpdates.aboutParagraph1 = updateData.companyParagraph2;
      }
      if (updateData.founderName) {
        homeUpdates.aboutParagraph2 = `Founded by ${updateData.founderName}, My Rare Aesthetics brings a premium, science-led approach to product development — without losing the artistry that makes beauty brands distinctive.`;
      }

      if (Object.keys(homeUpdates).length > 0) {
        await HomePageContent.findOneAndUpdate(
          { id: 'home_page' },
          { $set: homeUpdates },
          { upsert: true }
        );
      }
    } catch (syncErr) {
      console.warn('[About POST] Home sync warning:', syncErr.message);
    }

    return res.json({
      success: true,
      message: 'About page content and Home Page About section updated successfully',
      about: updated,
    });
  } catch (err) {
    console.error('[About POST] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update about page' });
  }
});

export default router;
