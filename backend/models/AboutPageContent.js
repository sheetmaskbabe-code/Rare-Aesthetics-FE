import mongoose from 'mongoose';

const AboutPageContentSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'about_page', unique: true },

    // 1. Company Story
    companyEyebrow: { type: String, default: 'The company' },
    companyTitle: { type: String, default: 'Cosmetic product development & consulting' },
    companyParagraph1: {
      type: String,
      default:
        'My Rare Aesthetics is a Pretoria-based consultancy focused on cosmetic product development, formulation, manufacturing support and brand-minded consulting.',
    },
    companyParagraph2: {
      type: String,
      default:
        'We partner with founders and brands who want a refined pathway from concept to product — combining research, formulation thinking, evaluation support and practical production coordination.',
    },
    companyParagraph3: {
      type: String,
      default:
        'Our work is rooted in luxury presentation and scientific care: clear process, quality-focused development, and respect for the artistry of beauty brands.',
    },
    companyImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    },

    // 2. Founder / Director Profile
    founderEyebrow: { type: String, default: 'Founder' },
    founderName: { type: String, default: 'Lindi-Grace' },
    founderTitle: {
      type: String,
      default: 'Cosmetic Chemist | Beauty Innovator | Founder of The RA Group',
    },
    founderBio1: {
      type: String,
      default:
        'Probably wearing a sheet mask, practising yoga, or experimenting with the next big skincare innovation. Passionate about the science behind beauty, I believe that great skincare is where creativity, research, and innovation come together.',
    },
    founderBio2: {
      type: String,
      default:
        'Building The RA Group, with a vision to redefine the beauty and cosmetics industry through innovative formulations, premium-quality products, and science-backed skincare solutions.',
    },
    founderBio3: {
      type: String,
      default:
        'From developing effective skincare and haircare formulations to exploring new beauty trends, every idea begins with curiosity and a commitment to excellence. My mission is to create products that inspire confidence, celebrate individuality, and make beauty more accessible.',
    },
    founderImage: { type: String, default: '/images/director.jpg' },
    featuredIn: {
      type: String,
      default: 'Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR',
    },

    // 3. Mission & Vision
    missionTitle: { type: String, default: 'Mission' },
    missionText: {
      type: String,
      default:
        'To help beauty brands transform innovative ideas into thoughtfully developed cosmetic products through formulation, research, testing support and manufacturing coordination.',
    },
    visionTitle: { type: String, default: 'Vision' },
    visionText: {
      type: String,
      default:
        'To be a trusted partner for beauty entrepreneurs and established brands seeking premium, science-informed product development with elegance and clarity.',
    },

    // 4. Philosophy
    philosophyEyebrow: { type: String, default: 'Philosophy' },
    philosophyTitle: { type: String, default: 'Our approach to cosmetic innovation' },
    philosophyDescription: {
      type: String,
      default:
        'We believe beautiful products are born where scientific rigour meets brand imagination.',
    },
    philosophyPoints: {
      type: [String],
      default: [
        'Research before formulation decisions',
        'Sensory experience as a design priority',
        'Quality-focused development processes',
        'Clear communication and project coordination',
        'Brand identity aligned with product reality',
        'Practical pathways toward manufacturing readiness',
      ],
    },
  },
  { timestamps: true }
);

export const AboutPageContent =
  mongoose.models.AboutPageContent || mongoose.model('AboutPageContent', AboutPageContentSchema);

export default AboutPageContent;
