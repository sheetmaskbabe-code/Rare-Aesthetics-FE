export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imagePublicId?: string;
  published: boolean;
  link?: string;
  buttonText?: string;
};

export const defaultPortfolio: PortfolioItem[] = [
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

export const portfolioCategories = [
  'All',
  'Skincare',
  'Packaging',
  'Brand Development',
  'Product Launch',
  'Formulation',
] as const;
