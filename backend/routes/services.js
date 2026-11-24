import { Router } from 'express';
import mongoose from 'mongoose';
import { ServicesPageContent } from '../models/ServicesPageContent.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

export const DEFAULT_SERVICES_LIST = [
  {
    id: 'product-development-formulation',
    title: 'Product Development and Formulation',
    short:
      'We create innovative cosmetic products tailored to your brand’s vision, combining industry insights with advanced formulation techniques.',
    description:
      'We create innovative cosmetic products tailored to your brand’s vision. Our expert team combines industry insights with advanced formulation techniques to develop high-quality, effective products that reflect your unique aesthetic.',
    benefits: [
      'Innovative formulation tailored to your brand vision',
      'Advanced formulation techniques & premium active ingredients',
      'End-to-end guidance from initial concept to commercial creation',
    ],
    icon: 'flask',
    image: '/images/1795270027986-WhatsApp_Image_2026-11-19_at_16.29.40__1_.jpeg',
  },
  {
    id: 'regulatory-support',
    title: 'Regulatory Support',
    short:
      'Comprehensive regulatory support to ensure your cosmetic products comply with industry standards and safety guidelines.',
    description:
      'We provide comprehensive regulatory support to ensure your cosmetic products comply with industry standards. Our knowledgeable team navigates the complexities of regulations, helping you meet all necessary guidelines for safety and labeling.',
    benefits: [
      'Compliance with local and international regulatory standards',
      'Safety dossiers, PIF preparation, and labeling verification',
      'Seamless compliance navigation for worry-free market entry',
    ],
    icon: 'shield',
    image:
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'manufacturing-support',
    title: 'Manufacturing Support',
    short:
      'Expert manufacturing support from pilot batches to large-scale production, ensuring precision, efficiency, and high quality.',
    description:
      'We provide expert manufacturing support to bring your cosmetic products to life. Our state-of-the-art facilities and skilled team ensure high-quality production, precision, and efficiency.',
    benefits: [
      'Small batch pilot runs through large-scale production',
      'Precision manufacturing and stringent quality control',
      'Full manufacturing lifecycle management',
    ],
    icon: 'factory',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'market-research-product-development',
    title: 'Market Research & Product Development',
    short:
      'Comprehensive market analysis identifying trends, consumer demands, and competitive whitespace from ideation to launch.',
    description:
      'Comprehensive market analysis to identify trends, consumer needs, and competitive landscapes. We guide you through the entire product development lifecycle from ideation to market launch.',
    benefits: [
      'Consumer insight and market trend identification',
      'Whitespace opportunity mapping against competitor products',
      'Guided lifecycle from initial ideation to commercial launch',
    ],
    icon: 'search',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ingredient-technology-research',
    title: 'Ingredient & Technology Research',
    short:
      'Stay ahead with cutting-edge active ingredient research, novel delivery systems, and innovative formulation technologies.',
    description:
      'Stay ahead with cutting-edge ingredient research and innovative technologies. We evaluate and source the latest active ingredients, delivery systems, and formulation technologies.',
    benefits: [
      'Next-generation active ingredient discovery and vetting',
      'Advanced bio-compatible delivery systems and textures',
      'Formulations engineered for distinct competitive performance',
    ],
    icon: 'leaf',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ingredient-formula-safety',
    title: 'Ingredient & Formula Safety Evaluation',
    short:
      'Rigorous safety assessment of ingredients and formulations by toxicology experts to verify international compliance.',
    description:
      'Rigorous safety assessment of ingredients and formulations to ensure compliance with international standards. Our toxicology experts evaluate product safety profiles and risk assessments.',
    benefits: [
      'Toxicological safety profiles and risk assessments',
      'International safety compliance verification',
      'Substantiated safety dossiers for regulatory submissions',
    ],
    icon: 'check',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'formulation-testing-clinical',
    title: 'Formulation Testing & Clinical Trials',
    short:
      'Scientifically valid testing protocols including stability testing, compatibility studies, and clinical efficacy trials.',
    description:
      'Comprehensive testing protocols including stability testing, compatibility studies, and clinical trials. We design and execute scientifically valid studies to prove efficacy and safety.',
    benefits: [
      'Accelerated and real-time stability and compatibility testing',
      'Scientifically valid clinical trials proving product efficacy',
      'Consumer acceptance and perception study design',
    ],
    icon: 'microscope',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'product-performance-evaluation',
    title: 'Product Performance Evaluation',
    short:
      'Objective in-vitro and in-vivo testing measuring hydration, anti-aging benefits, SPF efficacy, and claim validation.',
    description:
      'Objective assessment of product performance through in-vitro and in-vivo testing. We measure key performance indicators like hydration, anti-aging benefits, and SPF efficacy.',
    benefits: [
      'In-vitro and in-vivo performance validation',
      'Measurement of hydration, anti-aging, and SPF efficacy',
      'Claim substantiation data for confident brand marketing',
    ],
    icon: 'gauge',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'brand-strategy-identity',
    title: 'Brand Strategy & Identity Positioning',
    short:
      'Compelling brand narratives, tone of voice, and distinct visual positioning to build authentic connections with consumers.',
    description:
      'Develop compelling brand narratives and strategic positioning that resonates with your target audience. We help define your brand’s unique value proposition and visual identity.',
    benefits: [
      'Unique value proposition and brand voice definition',
      'Compelling narrative that connects with beauty consumers',
      'Cohesive visual identity and luxury positioning',
    ],
    icon: 'spark',
    image: '/images/FRyukxlXsAYv02m.jpg',
  },
];

const defaultServicesData = {
  id: 'services_page',
  eyebrow: 'OUR CAPABILITIES',
  title: 'End-to-End Cosmetic Development',
  description:
    'Explore our specialized formulation, evaluation, regulatory, and production coordination services.',
  services: DEFAULT_SERVICES_LIST,
};

// GET /api/services-content - Get services page content
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ content: defaultServicesData, offline: true });
    }

    let doc = await ServicesPageContent.findOne({ id: 'services_page' }).lean();
    if (!doc) {
      try {
        doc = await ServicesPageContent.create(defaultServicesData);
      } catch {
        doc = defaultServicesData;
      }
    }

    return res.json({ content: doc });
  } catch (err) {
    console.error('[ServicesContent GET] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch services content', content: defaultServicesData });
  }
});

// POST /api/services-content - Update services page content (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is currently offline' });
    }

    const updated = await ServicesPageContent.findOneAndUpdate(
      { id: 'services_page' },
      { $set: payload },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json({ success: true, content: updated });
  } catch (err) {
    console.error('[ServicesContent POST] Error:', err);
    return res.status(500).json({ error: 'Failed to update services content' });
  }
});

export default router;
