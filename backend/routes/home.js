import { Router } from 'express';
import mongoose from 'mongoose';
import { HomePageContent } from '../models/HomePageContent.js';
import { AboutPageContent } from '../models/AboutPageContent.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const defaultHomeData = {
  id: 'home_page',
  heroSlides: [
    {
      title: 'Ethereal Formulations',
      description:
        'Transforming innovative cosmetic ideas into thoughtfully developed beauty products through formulation and research.',
      media: '/images/process-bottles.jpg',
    },
    {
      title: 'Rose Mirage',
      description:
        'Where science meets the art of beauty — clinical cosmetic chemistry tailored for discerning founders and brands.',
      media: '/images/mra-products.jpg',
    },
    {
      title: 'Velvet Mystique',
      description:
        'Sensory-rich textures engineered with high-potency bio-compatible actives and premium sensory elegance.',
      media: '/images/custom-bottles.jpg',
    },
    {
      title: 'Signature Sheet Masks',
      description:
        'Targeted skincare innovation and thoughtfully developed sheet mask treatments crafted for discerning beauty founders.',
      media: '/images/mra-sheetmasks.jpg',
    },
  ],
  heroCtaPrimaryText: 'Explore Our Services',
  heroCtaPrimaryLink: '/services',
  heroCtaSecondaryText: 'Book a Consultation',
  heroCtaSecondaryLink: '/book',
  aboutEyebrow: 'ABOUT US',
  aboutTitle: 'Discover the Science Behind Beautiful Products.',
  aboutDescription:
    'My Rare Aesthetics supports beauty entrepreneurs and established brands through cosmetic product development and consulting — with a focus on thoughtful formulation, research and manufacturing support.',
  aboutParagraph1:
    'Based in Pretoria, South Africa, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.',
  aboutParagraph2:
    'Founded by Lindi-Grace, My Rare Aesthetics brings a premium, science-led approach to product development — without losing the artistry that makes beauty brands distinctive.',
  aboutImage: '/images/director.jpg',
  aboutLinkText: 'Learn more about us',
  aboutLinkUrl: '/about',
  featureEyebrow: 'Product Development',
  featureTitle: 'From a spark of an idea to a finished cosmetic product.',
  featureDescription:
    'We guide beauty innovators through research, formulation, evaluation and production coordination — helping transform concepts into products that feel intentional, premium and ready for the next stage of their journey.',
  featureButtonText: 'Explore our process',
  featureButtonLink: '/process',
  featureImage: '/images/mra-sheetmasks.jpg',
  testimonialsEyebrow: 'TESTIMONIALS',
  testimonialsTitle: 'Client voices',
  testimonialsDescription: 'Genuine testimonials will be featured here once approved by the business.',
  testimonialsPlaceholder: '“Testimonials placeholder — publish only client-approved quotes.”',
  testimonials: [
    {
      quote: 'My Rare Aesthetics brought clinical precision and distinctive luxury together seamlessly for our product line.',
      author: 'Founder & Formulator',
      role: 'Pretoria Beauty Brand',
      rating: 5,
    },
  ],
};

// GET /api/home - Retrieve home page content
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ home: defaultHomeData, offline: true });
    }

    let content = await HomePageContent.findOne({ id: 'home_page' }).lean();
    if (!content) {
      content = await HomePageContent.create(defaultHomeData);
    }

    return res.json({ home: content });
  } catch (err) {
    console.error('[Home Route] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve home content', home: defaultHomeData });
  }
});

// POST /api/home - Update home page content (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is currently offline' });
    }

    const updated = await HomePageContent.findOneAndUpdate(
      { id: 'home_page' },
      { $set: payload },
      { upsert: true, returnDocument: 'after' }
    );

    // Sync Home About Card to About Page Company Card
    try {
      const aboutUpdates = {};
      if (payload.aboutImage) {
        aboutUpdates.companyImage = payload.aboutImage;
      }
      if (payload.aboutTitle) {
        aboutUpdates.companyTitle = payload.aboutTitle;
      }
      if (payload.aboutDescription) {
        aboutUpdates.companyParagraph1 = payload.aboutDescription;
      }
      if (payload.aboutParagraph1) {
        aboutUpdates.companyParagraph2 = payload.aboutParagraph1;
      }
      if (Object.keys(aboutUpdates).length > 0) {
        await AboutPageContent.findOneAndUpdate(
          { id: 'about_page' },
          { $set: aboutUpdates },
          { upsert: true }
        );
      }
    } catch (syncErr) {
      console.warn('[Home POST] About sync warning:', syncErr.message);
    }

    return res.json({ success: true, home: updated });
  } catch (err) {
    console.error('[Home Route] Update error:', err);
    return res.status(500).json({ error: 'Failed to update home content' });
  }
});

export default router;
