import { Router } from 'express';
import mongoose from 'mongoose';
import { ProcessPageContent } from '../models/ProcessPageContent.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

export const DEFAULT_PROCESS_STEPS = [
  {
    step: '01',
    tag: 'Phase 01',
    title: 'Turning Your Vision Into Beauty Innovation',
    description:
      'At My Rare Aesthetics, every great beauty product begins with a vision. We believe that behind every successful cosmetic brand is a unique idea, a passion for innovation and a desire to make a difference in the beauty industry. Our journey begins by understanding your vision, your brand identity and the goals you want to achieve. We take the time to listen, collaborate and develop a clear direction that reflects your brand’s individuality.',
    proceedText: 'Proceed to phase 02',
    isAction: false,
  },
  {
    step: '02',
    tag: 'Phase 02',
    title: 'Where Creativity Meets Cosmetic Science',
    description:
      'We bring creativity and scientific expertise together to transform ideas into thoughtfully developed cosmetic products. Our approach combines ingredient research, innovative formulation techniques and an understanding of evolving beauty trends. From skincare essentials to specialised cosmetic formulations, we focus on developing products that align with your brand’s vision, quality expectations and target audience.',
    proceedText: 'Proceed to phase 03',
    isAction: false,
  },
  {
    step: '03',
    tag: 'Phase 03',
    title: 'Excellence in Every Formulation',
    description:
      'Quality is at the heart of everything we do. We pay close attention to ingredient selection, formulation development and product evaluation to support the creation of high-quality cosmetic products. By exploring innovative ingredients and sustainable formulation approaches where suitable, we aim to help brands develop products that meet modern consumer expectations and reflect responsible beauty innovation.',
    proceedText: 'Proceed to phase 04',
    isAction: false,
  },
  {
    step: '04',
    tag: 'Phase 04',
    title: 'From Concept to Manufacturing',
    description:
      'Developing a cosmetic product involves more than creating a formula. It requires careful planning, research, evaluation and coordination. At My Rare Aesthetics, we support your journey through the different stages of product development, from initial concept and formulation to testing, packaging considerations and manufacturing support. Every stage is approached with attention to detail, helping bring structure, clarity and direction to your product development journey.',
    proceedText: 'Proceed to phase 05',
    isAction: false,
  },
  {
    step: '05',
    tag: 'Phase 05',
    title: 'Supporting Quality, Safety and Compliance',
    description:
      'We understand the importance of developing cosmetic products with quality and regulatory considerations in mind. Our approach incorporates relevant ingredient and formulation safety considerations, product evaluation and regulatory support within the agreed project scope. We aim to help businesses better understand the requirements involved in developing and preparing cosmetic products for their intended markets.',
    proceedText: 'Proceed to phase 06',
    isAction: false,
  },
  {
    step: '06',
    tag: 'Phase 06',
    title: 'Building Brands That Stand Out',
    description:
      'Your brand deserves more than an ordinary product. It deserves a distinctive identity, a thoughtful formulation and a clear vision. We work alongside beauty entrepreneurs, emerging businesses and established brands to support their product development ambitions. Through collaboration, research and strategic guidance, we help transform creative ideas into meaningful opportunities within the competitive beauty industry.',
    proceedText: 'Proceed to phase 07',
    isAction: false,
  },
  {
    step: '07',
    tag: 'Phase 07',
    title: "Let's Create Something Extraordinary",
    description:
      'Whether you are starting your first skincare brand, expanding an existing cosmetic collection or exploring a new product concept, My Rare Aesthetics is here to support your journey. We believe that innovation begins with collaboration, and every successful product starts with a conversation. Together, let’s turn your vision into a beauty experience that reflects your brand and inspires confidence.',
    proceedText: 'Proceed to phase 08',
    isAction: false,
  },
  {
    step: '08',
    tag: 'Next Step · Engagement',
    title: 'Begin Your Project Journey',
    description:
      'Connect with our team to discuss your formulation goals, packaging considerations, and production roadmap. We partner with emerging and established beauty innovators across South Africa and beyond.',
    proceedText: '',
    isAction: true,
    actionText: 'Book a Consultation',
    actionUrl: '/contact',
    secondaryActionText: 'Start a Conversation',
    secondaryActionUrl: '/contact',
  },
];

export const defaultProcessData = {
  id: 'process_page',
  eyebrow: 'Our Approach',
  title: 'The Pathway to Beauty Innovation',
  description:
    'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
  steps: DEFAULT_PROCESS_STEPS,
};

// GET /api/process-content - Retrieve process / Our Approach content
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ content: defaultProcessData, offline: true });
    }

    let doc = await ProcessPageContent.findOne({ id: 'process_page' }).lean();
    if (!doc) {
      try {
        doc = await ProcessPageContent.create(defaultProcessData);
      } catch {
        doc = defaultProcessData;
      }
    }

    return res.json({ content: doc });
  } catch (err) {
    console.error('[ProcessContent GET] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch process content', content: defaultProcessData });
  }
});

// POST /api/process-content - Update process / Our Approach content (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        offline: true,
        content: { ...defaultProcessData, ...payload },
      });
    }

    const updateData = {
      eyebrow: payload.eyebrow ?? defaultProcessData.eyebrow,
      title: payload.title ?? defaultProcessData.title,
      description: payload.description ?? defaultProcessData.description,
      steps: Array.isArray(payload.steps) ? payload.steps : defaultProcessData.steps,
    };

    const updated = await ProcessPageContent.findOneAndUpdate(
      { id: 'process_page' },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    ).lean();

    return res.json({ success: true, content: updated });
  } catch (err) {
    console.error('[ProcessContent POST] Error:', err);
    return res.status(500).json({ error: 'Failed to save process content' });
  }
});

export default router;
