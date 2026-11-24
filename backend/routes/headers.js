import { Router } from 'express';
import mongoose from 'mongoose';
import { PageHeader } from '../models/PageHeader.js';
import { HomePageContent } from '../models/HomePageContent.js';
import { PortfolioItem } from '../models/PortfolioItem.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

export const DEFAULT_PAGE_HEADERS = {
  home: {
    page: 'home',
    title: 'Homepage Hero Showcase',
    description: 'WebGL shader tabs hero slider displayed on the main landing page',
    slides: [
      {
        title: 'Ethereal Formulations',
        description:
          'Transforming innovative cosmetic ideas into thoughtfully developed beauty products through formulation and research.',
        media: '/images/1795270027987-WhatsApp_Image_2026-11-19_at_16.29.40__2_.jpeg',
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
  },
  about: {
    page: 'about',
    title: 'About Us Header Banner',
    description: 'Header banner introducing our laboratory philosophy, science, and leadership',
    slides: [
      {
        title: 'Science & Luxury',
        description:
          'Science-led beauty development crafted with an unapologetic touch of luxury and clinical precision.',
        media:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
      },
    ],
  },
  services: {
    page: 'services',
    title: 'Services & Capabilities Header Banner',
    description: 'Header banner detailing end-to-end cosmetic formulation, testing, and production support',
    slides: [
      {
        title: 'Cosmetic Formulation',
        description:
          'Turn concept briefs into refined, manufacturable cosmetic formulas with sensory excellence and active potency.',
        media: '/images/1795270027986-WhatsApp_Image_2026-11-19_at_16.29.40__1_.jpeg',
      },
    ],
  },
  portfolio: {
    page: 'portfolio',
    title: 'Portfolio Header Banner',
    description: 'Header banner displaying past client successes and luxury packaging',
    slides: [
      {
        title: 'Radiant Skincare',
        description:
          'Clinical cosmetic formulations developed with sensory distinction and certified active potency.',
        media:
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
      },
    ],
  },
  blog: {
    page: 'blog',
    title: 'Journal & Editorial Insights Header Banner',
    description: 'Header banner highlighting latest chemistry insights, formulation trends, and beauty notes',
    slides: [
      {
        title: 'Editorial & Insights',
        description:
          'Perspectives on cosmetic science, luxury formulation craft, ingredient research, and beauty brand building.',
        media:
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
      },
    ],
  },
  contact: {
    page: 'contact',
    title: 'Contact Header Banner',
    description: 'Header banner welcoming founders and brands to begin formulation consultations',
    slides: [
      {
        title: 'Initiate a Project',
        description:
          'Begin a confidential conversation with our cosmetic product development studio in Pretoria.',
        media:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
      },
    ],
  },
  process: {
    page: 'process',
    title: 'Development Methodology Header Banner',
    description: 'Header banner illustrating the 6-stage cosmetic chemistry formulation lifecycle',
    slides: [
      {
        title: 'Structured Process',
        description:
          'A clear, research-driven development journey from discovery and formulation to commercial product launch.',
        media: '/images/process-bottles.jpg',
      },
      {
        title: 'Discovery & Briefing',
        description:
          'Establishing your brand vision, performance targets, active ingredient preferences, and product roadmap.',
        media:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80',
      },
      {
        title: 'Concept & Formulation',
        description:
          'Transforming creative ideas into bench-tested prototypes with meticulous attention to luxury sensory feel.',
        media:
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
      },
      {
        title: 'Testing & Stability',
        description:
          'Rigorous microbiological, stability, and compatibility testing ensuring uncompromising safety and efficacy.',
        media:
          'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
      },
      {
        title: 'Scale & Manufacturing',
        description:
          'Seamless batch scaling, contract manufacturer liaison, and packaging assembly coordination.',
        media:
          'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
      },
      {
        title: 'Launch Readiness',
        description:
          'Final quality audits, regulatory compliance checks, and market delivery alignment.',
        media:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
      },
    ],
  },
};

// GET /api/headers - Retrieve all page headers
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ headers: DEFAULT_PAGE_HEADERS, offline: true });
    }

    const docs = await PageHeader.find({}).lean();
    const result = { ...DEFAULT_PAGE_HEADERS };

    // Also check if home has custom slides in HomePageContent
    const homeContent = await HomePageContent.findOne({ id: 'home_page' }).lean();
    if (homeContent?.heroSlides && homeContent.heroSlides.length > 0) {
      result.home = {
        page: 'home',
        title: 'Homepage Hero Showcase',
        description: 'WebGL shader tabs hero slider displayed on the main landing page',
        slides: homeContent.heroSlides,
      };
    }

    // Merge in any saved page headers
    docs.forEach((doc) => {
      if (doc.page && doc.slides && doc.slides.length > 0) {
        result[doc.page] = {
          page: doc.page,
          title: doc.title || result[doc.page]?.title || `${doc.page} header`,
          description: doc.description || result[doc.page]?.description || '',
          slides: doc.slides,
        };
      }
    });

    return res.json({ headers: result });
  } catch (err) {
    console.error('[PageHeaders GET] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch headers', headers: DEFAULT_PAGE_HEADERS });
  }
});

// GET /api/headers/:page - Retrieve a specific page header
router.get('/:page', async (req, res) => {
  const { page } = req.params;
  const defaultHeader = DEFAULT_PAGE_HEADERS[page] || {
    page,
    title: `${page} Header`,
    description: '',
    slides: [],
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ header: defaultHeader, offline: true });
    }

    if (page === 'home') {
      const homeContent = await HomePageContent.findOne({ id: 'home_page' }).lean();
      if (homeContent?.heroSlides && homeContent.heroSlides.length > 0) {
        return res.json({
          header: {
            page: 'home',
            title: 'Homepage Hero Showcase',
            description: 'WebGL shader tabs hero slider',
            slides: homeContent.heroSlides,
          },
        });
      }
    }

    let doc = await PageHeader.findOne({ page }).lean();
    if (!doc) {
      // Seed default into DB
      try {
        doc = await PageHeader.create(defaultHeader);
      } catch {
        doc = defaultHeader;
      }
    }

    return res.json({ header: doc });
  } catch (err) {
    console.error(`[PageHeaders GET /${page}] Error:`, err);
    return res.status(500).json({ error: 'Failed to fetch header', header: defaultHeader });
  }
});

// POST /api/headers/:page - Update a specific page header (Admin protected)
router.post('/:page', requireAdmin, async (req, res) => {
  const { page } = req.params;
  const { slides, title, description } = req.body;

  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'Slides must be an array' });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database offline' });
    }

    const updated = await PageHeader.findOneAndUpdate(
      { page },
      {
        $set: {
          page,
          slides,
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // If page is home, sync with HomePageContent.heroSlides as well
    if (page === 'home') {
      try {
        await HomePageContent.findOneAndUpdate(
          { id: 'home_page' },
          { $set: { heroSlides: slides } },
          { upsert: true }
        );
      } catch (homeSyncErr) {
        console.warn('[PageHeaders] Home sync error:', homeSyncErr.message);
      }
    }

    // If page is process, sync with PortfolioItem "Our Process" card image
    if (page === 'process' && slides[0]?.media) {
      try {
        await PortfolioItem.findOneAndUpdate(
          { $or: [{ id: 'portfolio-process' }, { link: '/process' }] },
          { $set: { image: slides[0].media } }
        );
      } catch (procSyncErr) {
        console.warn('[PageHeaders] Process sync error:', procSyncErr.message);
      }
    }

    return res.json({ success: true, header: updated });
  } catch (err) {
    console.error(`[PageHeaders POST /${page}] Error:`, err);
    return res.status(500).json({ error: 'Failed to update page header' });
  }
});

export default router;
