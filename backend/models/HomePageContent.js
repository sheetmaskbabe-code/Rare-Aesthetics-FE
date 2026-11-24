import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  media: { type: String, default: '' },
});

const TestimonialSchema = new mongoose.Schema({
  quote: { type: String, default: '' },
  author: { type: String, default: '' },
  role: { type: String, default: '' },
  rating: { type: Number, default: 5 },
});

const HomePageContentSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'home_page', unique: true },
    heroSlides: [HeroSlideSchema],
    heroCtaPrimaryText: { type: String, default: 'Explore Our Services' },
    heroCtaPrimaryLink: { type: String, default: '/services' },
    heroCtaSecondaryText: { type: String, default: 'Book a Consultation' },
    heroCtaSecondaryLink: { type: String, default: '/book' },

    aboutEyebrow: { type: String, default: 'About Us' },
    aboutTitle: { type: String, default: 'Discover the Science Behind Beautiful Products.' },
    aboutDescription: {
      type: String,
      default:
        'My Rare Aesthetics supports beauty entrepreneurs and established brands through cosmetic product development and consulting — with a focus on thoughtful formulation, research and manufacturing support.',
    },
    aboutParagraph1: {
      type: String,
      default:
        'Based in Pretoria, Gauteng, South Africa, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.',
    },
    aboutParagraph2: {
      type: String,
      default:
        'Founded by Lindi-Grace, My Rare Aesthetics brings a premium, science-led approach to product development — without losing the artistry that makes beauty brands distinctive.',
    },
    aboutImage: { type: String, default: '/images/director.jpg' },
    aboutLinkText: { type: String, default: 'Learn more about us' },
    aboutLinkUrl: { type: String, default: '/about' },

    featureEyebrow: { type: String, default: 'Product Development' },
    featureTitle: { type: String, default: 'From a spark of an idea to a finished cosmetic product.' },
    featureDescription: {
      type: String,
      default:
        'We guide beauty innovators through research, formulation, evaluation and production coordination — helping transform concepts into products that feel intentional, premium and ready for the next stage of their journey.',
    },
    featureButtonText: { type: String, default: 'Explore our process' },
    featureButtonLink: { type: String, default: '/process' },
    featureImage: { type: String, default: '' },

    testimonialsEyebrow: { type: String, default: 'TESTIMONIALS' },
    testimonialsTitle: { type: String, default: 'Client voices' },
    testimonialsDescription: {
      type: String,
      default: 'Genuine testimonials will be featured here once approved by the business.',
    },
    testimonialsPlaceholder: {
      type: String,
      default: '“Testimonials placeholder — publish only client-approved quotes.”',
    },
    testimonials: [TestimonialSchema],
  },
  { timestamps: true }
);

export const HomePageContent =
  mongoose.models.HomePageContent || mongoose.model('HomePageContent', HomePageContentSchema);
