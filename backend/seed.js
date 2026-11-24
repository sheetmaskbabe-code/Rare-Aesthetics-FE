import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from './config/db.js';
import { BlogPost } from './models/BlogPost.js';
import { PortfolioItem } from './models/PortfolioItem.js';
import { Enquiry } from './models/Enquiry.js';

const allBlogPosts = [
  {
    id: 'welcome-to-rare-aesthetics',
    slug: 'welcome-to-rare-aesthetics-where-science-meets-beauty-vision',
    title: 'Welcome to Rare Aesthetics — Where Science Meets Beauty Vision',
    excerpt:
      'Discover how Rare Aesthetics bridges cosmetic science and brand vision, guiding beauty entrepreneurs from concept through custom formulation, testing, and market-ready innovation.',
    category: 'Science & Innovation',
    date: '2026-03-18',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    content: `## Turning Beauty Ideas into Science-Backed Skincare Innovations

At Rare Aesthetics, we believe every successful skincare brand begins with an idea — a spark of inspiration, a vision to create something unique, and a passion for making a difference in the beauty industry. Behind every exceptional skincare product is a combination of scientific research, innovative formulation, quality ingredients, and a clear understanding of consumer needs.

Our mission is to help beauty entrepreneurs, emerging brands, and established businesses transform their ideas into high-quality, market-ready cosmetic products. We bring together scientific expertise, creative thinking, and industry knowledge to simplify the complex process of cosmetic product development.

Whether you are planning to launch your first skincare collection or expand an existing beauty portfolio, Rare Aesthetics provides the expertise and guidance needed to move your vision forward.

## Understanding the Science Behind Great Skincare

Creating a successful skincare product involves much more than selecting attractive packaging or choosing popular ingredients. It requires a deep understanding of skin biology, ingredient functionality, formulation compatibility, product stability, and consumer expectations.

The beauty industry continues to evolve as consumers become more informed about what they apply to their skin. They increasingly look for products that offer meaningful benefits, transparent ingredient information, responsible manufacturing, and scientifically supported performance.

At Rare Aesthetics, we recognize these changing expectations. Our approach combines research-driven development with practical industry insights, helping brands create products that are thoughtfully formulated and aligned with modern skincare needs.

From identifying effective active ingredients to developing the final formulation, every stage is approached with attention to detail and a commitment to quality.`,
    published: true,
  },
  {
    id: 'blog-1',
    slug: 'cosmetic-formulation-foundations',
    title: 'Cosmetic Formulation Foundations for Emerging Beauty Brands',
    excerpt:
      'A practical overview of how formulation thinking shapes product identity, texture and manufacturability from the earliest concept stage.',
    category: 'Formulation',
    date: '2026-01-12',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    content: `Building a cosmetic product begins with clarity: what experience should the formula deliver, who is it for, and how will it be manufactured?

Formulation foundations include understanding base systems, active selection, sensory goals and stability considerations. Early alignment between brand vision and technical reality helps reduce costly revisions later.

Our cosmetic chemists support you at every milestone from initial bench batches to scale-up manufacturing.`,
    published: true,
  },
  {
    id: 'blog-2',
    slug: 'skincare-ingredients-to-watch',
    title: 'Skincare Ingredients Worth Watching This Season',
    excerpt:
      'Explore how ingredient research informs modern skincare development — from texture technologies to performance-driven actives.',
    category: 'Ingredients',
    date: '2026-02-03',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    content: `Ingredient research helps brands make informed decisions about performance potential, sensory feel and product positioning.

Rather than chasing trends alone, thoughtful development balances innovation with formula stability, regulatory practicality and brand authenticity.

Key ingredients currently shaping formulations include botanical ceramides, biomimetic peptides, and bio-fermented actives.`,
    published: true,
  },
  {
    id: 'blog-3',
    slug: 'from-idea-to-launch',
    title: 'From Idea to Launch: Mapping a Beauty Product Journey',
    excerpt:
      'A clear look at the stages that take a cosmetic concept through research, formulation, evaluation and production coordination.',
    category: 'Product Development',
    date: '2026-02-28',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    content: `A successful beauty product journey is rarely linear — but it is manageable when stages are defined.

Discovery, research, formulation, evaluation and launch coordination each require different decisions. Mapping these early creates better timelines, clearer budgets and stronger collaboration.`,
    published: true,
  },
  {
    id: 'blog-4',
    slug: 'packaging-that-supports-the-formula',
    title: 'Packaging Decisions That Support Formula and Brand',
    excerpt:
      'Why packaging is more than aesthetics — and how sourcing choices affect protection, usability and brand perception.',
    category: 'Packaging',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
    content: `Packaging protects the formula, shapes first impressions and influences how customers use the product.

Thoughtful sourcing considers compatibility, sustainability goals, manufacturing practicality and brand identity — not aesthetics alone.`,
    published: true,
  },
];

const allPortfolioItems = [
  {
    id: 'portfolio-process',
    slug: 'our-process',
    title: 'Our Process',
    category: 'Formulation',
    description:
      "As one of South Africa's leading development and manufacturing agencies, we take pride in our process, just like you'll take pride in your product.",
    image: '/images/process-bottles.jpg',
    published: true,
    link: '/process',
    buttonText: 'LEARN MORE',
  },
  {
    id: 'portfolio-products',
    slug: 'products',
    title: 'Products',
    category: 'Skincare',
    description:
      'Explore our complete product formulation capabilities across premium skincare, advanced haircare, and high-performance makeup.',
    image: '/images/mra-products.jpg',
    published: true,
    link: '/products',
    buttonText: 'LEARN MORE',
  },
  {
    id: 'portfolio-why-us',
    slug: 'why-us',
    title: 'Why Us',
    category: 'Brand Development',
    description:
      'We work with some of the largest clients in South Africa and the world, and promise to provide the highest quality formulation, stability testing, and manufacturing standards.',
    image: '/images/why-us-lab.png',
    published: true,
    link: '/why-choose-us',
    buttonText: 'LEARN MORE',
  },
  {
    id: 'portfolio-sheetmasks',
    slug: 'signature-sheet-masks',
    title: 'Rare Aesthetics Sheet Masks',
    category: 'Packaging',
    description:
      'Bespoke formulation, packaging design, and Korean botanical extracts developed for the My Rare Aesthetics signature skincare collection.',
    image: '/images/mra-sheetmasks.jpg',
    published: true,
    link: '/portfolio/signature-sheet-masks',
    buttonText: 'LEARN MORE',
  },
  {
    id: 'portfolio-sprays',
    slug: 'custom-sprays-formulations',
    title: 'Custom Sprays & Formulations',
    category: 'Formulation',
    description:
      'High-performance hair, body, and facial mist formulations paired with precision mist and pump packaging solutions.',
    image: '/images/custom-bottles.jpg',
    published: true,
    link: '/portfolio/custom-sprays-formulations',
    buttonText: 'LEARN MORE',
  },
];

const initialEnquiries = [
  {
    id: 'enquiry-sample-1',
    name: 'Sipho Ndlovu',
    email: 'sipho@example.co.za',
    phone: '+27 82 123 4567',
    company: 'Ndlovu Botanicals',
    service: 'Custom Skincare Formulation',
    timeline: '3 - 6 months',
    budget: 'R50,000 - R100,000',
    message: 'We are looking to develop an indigenous South African botanical serum line for launching in summer.',
    status: 'new',
  },
  {
    id: 'enquiry-sample-2',
    name: 'Chloe van der Merwe',
    email: 'chloe@rarebeauty.co.za',
    phone: '+27 71 987 6543',
    company: 'Glow Lab',
    service: 'Full Product Development & Manufacturing',
    timeline: 'Immediate',
    budget: 'R100,000+',
    message: 'Seeking stability testing and formulation refinement for our peptide cream range.',
    status: 'in_discussion',
  },
];

async function seed() {
  console.log('==================================================');
  console.log('  Seeding All Data into MongoDB...');
  console.log('==================================================');

  const conn = await connectDB();

  if (!conn) {
    console.error('[Seed Error] Could not connect to MongoDB. Check MONGODB_URI in backend/.env.');
    process.exit(1);
  }

  try {
    // 1. Seed Blog Posts
    console.log('[Seed] Seeding Blog Posts...');
    for (const post of allBlogPosts) {
      await BlogPost.findOneAndUpdate({ id: post.id }, { $set: post }, { upsert: true, returnDocument: 'after' });
    }
    console.log(`[Seed] Successfully seeded ${allBlogPosts.length} blog posts.`);

    // 2. Seed Portfolio Items
    console.log('[Seed] Seeding Portfolio Items...');
    for (const item of allPortfolioItems) {
      await PortfolioItem.findOneAndUpdate({ id: item.id }, { $set: item }, { upsert: true, returnDocument: 'after' });
    }
    console.log(`[Seed] Successfully seeded ${allPortfolioItems.length} portfolio items.`);

    // 3. Seed Sample Enquiries
    console.log('[Seed] Seeding Sample Customer Enquiries...');
    for (const enquiry of initialEnquiries) {
      await Enquiry.findOneAndUpdate({ id: enquiry.id }, { $set: enquiry }, { upsert: true, returnDocument: 'after' });
    }
    console.log(`[Seed] Successfully seeded ${initialEnquiries.length} customer enquiries.`);

    console.log('==================================================');
    console.log(' All Data Seeded into MongoDB Successfully!');
    console.log('==================================================');
  } catch (err) {
    console.error('[Seed Error] Failed during data seeding:', err);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  }
}

seed();
