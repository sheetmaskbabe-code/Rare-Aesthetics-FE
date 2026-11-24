import { services } from '@/data/services';

/** Canonical production site (matches live Vercel / custom domain) */
export const SITE_URL = 'https://www.rareaestheticsgroup.com';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export const CORE_KEYWORDS = [
  'My Rare Aesthetics',
  'Rare Aesthetics',
  'cosmetic formulation South Africa',
  'cosmetic chemist Pretoria',
  'beauty product development',
  'skincare formulation',
  'haircare formulation',
  'makeup formulation',
  'private label cosmetics South Africa',
  'cosmetic manufacturing support',
  'cosmetic regulatory compliance South Africa',
  'beauty brand consulting Pretoria',
  'Lindi-Grace cosmetic chemist',
  'sheet mask formulation',
  'cosmetic product development Pretoria',
] as const;

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  noindex?: boolean;
  type?: 'website' | 'article' | 'business.business';
};

export const pageSeo: Record<string, PageSeo> = {
  home: {
    path: '/',
    title: 'My Rare Aesthetics | Where Science Meets the Art of Beauty',
    description:
      'Premium cosmetic product development, formulation, manufacturing support and beauty brand consulting in Pretoria, South Africa. From concept to commercial launch with My Rare Aesthetics.',
    keywords: [
      ...CORE_KEYWORDS,
      'cosmetic lab Pretoria',
      'beauty innovation South Africa',
      'end to end cosmetic development',
    ],
    priority: 1,
    changefreq: 'weekly',
  },
  about: {
    path: '/about',
    title: 'About Us | My Rare Aesthetics',
    description:
      'Meet My Rare Aesthetics and founder Lindi-Grace — a Pretoria-based consultancy for cosmetic formulation, research-driven product development and brand-minded beauty consulting.',
    keywords: [
      'about My Rare Aesthetics',
      'Lindi-Grace founder',
      'cosmetic chemist South Africa',
      'beauty consultancy Pretoria',
      'cosmetic science South Africa',
      ...CORE_KEYWORDS,
    ],
    priority: 0.85,
    changefreq: 'monthly',
  },
  services: {
    path: '/services',
    title: 'Cosmetic Development Services | My Rare Aesthetics',
    description:
      'Explore cosmetic formulation, regulatory support, manufacturing coordination, ingredient research, clinical testing, packaging sourcing and brand strategy with My Rare Aesthetics.',
    keywords: [
      'cosmetic formulation services',
      'regulatory support cosmetics',
      'manufacturing support beauty',
      'ingredient research cosmetics',
      'clinical testing cosmetics South Africa',
      'brand strategy beauty',
      ...CORE_KEYWORDS,
    ],
    priority: 0.95,
    changefreq: 'monthly',
  },
  process: {
    path: '/process',
    title: 'Our Process | Cosmetic Development Journey | My Rare Aesthetics',
    description:
      'Follow the My Rare Aesthetics seven-phase journey from vision and formulation through testing, scale-up and commercial product launch.',
    keywords: [
      'cosmetic development process',
      'product development stages beauty',
      'formulation to launch',
      'cosmetic project roadmap',
      ...CORE_KEYWORDS,
    ],
    priority: 0.85,
    changefreq: 'monthly',
  },
  products: {
    path: '/products',
    title: 'Product Range | Skincare, Haircare & Makeup | My Rare Aesthetics',
    description:
      'Explore custom cosmetic formulation ranges across skincare, haircare and makeup — developed with scientific research and thoughtful ingredient selection in Pretoria.',
    keywords: [
      'skincare formulation South Africa',
      'haircare formulation',
      'makeup formulation',
      'custom cosmetic products',
      'private label skincare',
      ...CORE_KEYWORDS,
    ],
    priority: 0.9,
    changefreq: 'weekly',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio | Cosmetic Projects | My Rare Aesthetics',
    description:
      'Browse client-approved cosmetic development, packaging and beauty brand projects from My Rare Aesthetics.',
    keywords: [
      'cosmetic portfolio',
      'beauty brand case studies',
      'packaging projects cosmetics',
      'formulation showcase',
      ...CORE_KEYWORDS,
    ],
    priority: 0.8,
    changefreq: 'weekly',
  },
  whyChooseUs: {
    path: '/why-choose-us',
    title: 'Why Choose Us | My Rare Aesthetics',
    description:
      'Discover why brands choose My Rare Aesthetics for integrated, research-driven cosmetic product development and refined project support.',
    keywords: [
      'why choose My Rare Aesthetics',
      'best cosmetic consultant Pretoria',
      'research driven beauty development',
      ...CORE_KEYWORDS,
    ],
    priority: 0.75,
    changefreq: 'monthly',
  },
  blog: {
    path: '/blog',
    title: 'Blog & Insights | Cosmetic Formulation Notes | My Rare Aesthetics',
    description:
      'Insights on cosmetic formulation, ingredients, product development, regulatory horizons and beauty brand building from My Rare Aesthetics.',
    keywords: [
      'cosmetic formulation blog',
      'beauty ingredient insights',
      'product development articles',
      'cosmetic science South Africa',
      ...CORE_KEYWORDS,
    ],
    priority: 0.8,
    changefreq: 'weekly',
    type: 'website',
  },
  faq: {
    path: '/faq',
    title: 'FAQ | Cosmetic Development Questions | My Rare Aesthetics',
    description:
      'Answers about product development, consultations, timelines, testing, regulatory support and project costs at My Rare Aesthetics.',
    keywords: [
      'cosmetic development FAQ',
      'formulation consultation questions',
      'beauty product timeline',
      'cosmetic project cost South Africa',
      ...CORE_KEYWORDS,
    ],
    priority: 0.7,
    changefreq: 'monthly',
  },
  contact: {
    path: '/contact',
    title: 'Contact Us | Start Your Beauty Project | My Rare Aesthetics',
    description:
      'Send a project enquiry or visit My Rare Aesthetics in Muckleneuk, Pretoria. Start your cosmetic formulation or brand development conversation today.',
    keywords: [
      'contact cosmetic chemist Pretoria',
      'beauty product enquiry South Africa',
      'My Rare Aesthetics contact',
      'cosmetic lab Pretoria address',
      ...CORE_KEYWORDS,
    ],
    priority: 0.9,
    changefreq: 'monthly',
  },
  book: {
    path: '/book',
    title: 'Book a Consultation | My Rare Aesthetics',
    description:
      'Book a personalized 30-minute cosmetic product development consultation with My Rare Aesthetics in Pretoria.',
    keywords: [
      'book cosmetic consultation',
      'beauty formulation appointment',
      'cosmetic chemist consultation Pretoria',
      ...CORE_KEYWORDS,
    ],
    priority: 0.9,
    changefreq: 'monthly',
  },
  payment: {
    path: '/payment',
    title: 'Make a Payment | My Rare Aesthetics',
    description:
      'Secure payment page for My Rare Aesthetics project invoices and consultation fees.',
    keywords: ['My Rare Aesthetics payment', 'consultation invoice payment'],
    priority: 0.3,
    changefreq: 'yearly',
    noindex: true,
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | My Rare Aesthetics',
    description: 'Privacy Policy for My Rare Aesthetics — how we collect, use and protect your information.',
    keywords: ['My Rare Aesthetics privacy policy', 'data protection'],
    priority: 0.3,
    changefreq: 'yearly',
  },
  terms: {
    path: '/terms',
    title: 'Terms and Conditions | My Rare Aesthetics',
    description: 'Terms and Conditions for using My Rare Aesthetics services and website.',
    keywords: ['My Rare Aesthetics terms', 'service terms cosmetics'],
    priority: 0.3,
    changefreq: 'yearly',
  },
};

/** Absolute URL helper for canonicals / OG / sitemap */
export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  if (!path || path === '/') return SITE_URL;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function servicePageSeo(service: { id: string; title: string; short: string }): PageSeo {
  return {
    path: `/services/${service.id}`,
    title: `${service.title} | My Rare Aesthetics`,
    description: service.short,
    keywords: [
      service.title,
      `${service.title} South Africa`,
      `${service.title} Pretoria`,
      'cosmetic services',
      ...CORE_KEYWORDS,
    ],
    priority: 0.8,
    changefreq: 'monthly',
  };
}

/** Flat list of public indexable routes for sitemap generation reference */
export function getSitemapEntries(): Array<{
  loc: string;
  changefreq: string;
  priority: number;
}> {
  const entries = Object.values(pageSeo)
    .filter((p) => !p.noindex)
    .map((p) => ({
      loc: absoluteUrl(p.path),
      changefreq: p.changefreq || 'monthly',
      priority: p.priority ?? 0.5,
    }));

  for (const service of services) {
    entries.push({
      loc: absoluteUrl(`/services/${service.id}`),
      changefreq: 'monthly',
      priority: 0.8,
    });
  }

  // FAQ alias
  entries.push({
    loc: absoluteUrl('/faqs'),
    changefreq: 'monthly',
    priority: 0.6,
  });

  return entries;
}
