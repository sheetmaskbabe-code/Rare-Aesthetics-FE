import formulationImage from '@/images/WhatsApp Image 2026-11-19 at 16.29.40 (1).jpeg';
import packagingImage from '@/images/WhatsApp Image 2026-11-19 at 16.29.40 (2).jpeg';
import sheetMaskImage from '@/images/FRyukxlXsAYv02m.jpg';

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  benefits: string[];
  icon: string;
  image: string;
};

export const services: Service[] = [
  {
    id: 'product-development-formulation',
    title: 'Product Development and Formulation',
    short:
      'We create innovative cosmetic products tailored to your brand’s vision, combining industry insights with advanced formulation techniques.',
    description:
      'We create innovative cosmetic products tailored to your brand’s vision. Our expert team combines industry insights with advanced formulation techniques to develop high-quality, effective products that reflect your unique aesthetic. From concept to creation, we ensure excellence at every step.',
    benefits: [
      'Innovative formulation tailored to your brand vision',
      'Advanced formulation techniques & premium active ingredients',
      'End-to-end guidance from initial concept to commercial creation',
    ],
    icon: 'flask',
    image: formulationImage,
  },
  {
    id: 'regulatory-support',
    title: 'Regulatory Support',
    short:
      'Comprehensive regulatory support to ensure your cosmetic products comply with industry standards and safety guidelines.',
    description:
      'We provide comprehensive regulatory support to ensure your cosmetic products comply with industry standards. Our knowledgeable team navigates the complexities of regulations, helping you meet all necessary guidelines for safety and labeling. Focus on your creativity while we handle the compliance details.',
    benefits: [
      'Compliance with local and international regulatory standards',
      'Safety dossiers, PIF preparation, and labeling verification',
      'Seamless compliance navigation for worry-free market entry',
    ],
    icon: 'shield',
    image:
      'https://res.cloudinary.com/v4fs2klq/image/upload/v1795334329/rare_aesthetics/services/nt7ifxditrh86ubpp3im.jpg',
  },
  {
    id: 'manufacturing-support',
    title: 'Manufacturing Support',
    short:
      'Expert manufacturing support from pilot batches to large-scale production, ensuring precision, efficiency, and high quality.',
    description:
      'We provide expert manufacturing support to bring your cosmetic products to life. Our state-of-the-art facilities and skilled team ensure high-quality production, precision, and efficiency. From small batches to large-scale runs, we manage the entire manufacturing process, allowing you to focus on your brand’s success.',
    benefits: [
      'Small batch pilot runs through large-scale production',
      'Precision manufacturing and stringent quality control',
      'Full manufacturing lifecycle management',
    ],
    icon: 'factory',
    image:
      'https://res.cloudinary.com/v4fs2klq/image/upload/v1795334342/rare_aesthetics/services/wbwgstigam4giezu0og2.jpg',
  },
  {
    id: 'market-research-product-development',
    title: 'Market Research & Product Development',
    short:
      'Comprehensive market analysis identifying trends, consumer demands, and competitive whitespace from ideation to launch.',
    description:
      'Comprehensive market analysis to identify trends, consumer needs, and competitive landscapes. We guide you through the entire product development lifecycle from ideation to market launch, ensuring your products meet market demands and consumer expectations.',
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
      'Stay ahead with cutting-edge ingredient research and innovative technologies. We evaluate and source the latest active ingredients, delivery systems, and formulation technologies to create products that deliver exceptional results and competitive advantages.',
    benefits: [
      'Next-generation active ingredient discovery and vetting',
      'Advanced bio-compatible delivery systems and textures',
      'Formulations engineered for distinct competitive performance',
    ],
    icon: 'leaf',
    image:
      'https://res.cloudinary.com/v4fs2klq/image/upload/v1795334360/rare_aesthetics/services/aaswqhjziqyqmyv1ugv7.jpg',
  },
  {
    id: 'ingredient-formula-safety',
    title: 'Ingredient & Formula Safety Evaluation',
    short:
      'Rigorous safety assessment of ingredients and formulations by toxicology experts to verify international compliance.',
    description:
      'Rigorous safety assessment of ingredients and formulations to ensure compliance with international standards. Our toxicology experts evaluate product safety profiles, conduct risk assessments, and provide documentation for regulatory submissions.',
    benefits: [
      'Toxicological safety profiles and risk assessments',
      'International safety compliance verification',
      'Substantiated safety dossiers for regulatory submissions',
    ],
    icon: 'check',
    image:
      'https://res.cloudinary.com/v4fs2klq/image/upload/v1795334378/rare_aesthetics/services/chlilgrodstoxorgwbd7.jpg',
  },
  {
    id: 'formulation-testing-clinical',
    title: 'Formulation Testing & Clinical Trials',
    short:
      'Scientifically valid testing protocols including stability testing, compatibility studies, and clinical efficacy trials.',
    description:
      'Comprehensive testing protocols including stability testing, compatibility studies, and clinical trials. We design and execute scientifically valid studies to prove efficacy, safety, and consumer acceptance of your formulations.',
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
      'Objective assessment of product performance through in-vitro and in-vivo testing. We measure key performance indicators like hydration, anti-aging benefits, SPF efficacy, and more to validate product claims and ensure consumer satisfaction.',
    benefits: [
      'In-vitro and in-vivo performance validation',
      'Measurement of hydration, anti-aging, and SPF efficacy',
      'Claim substantiation data for confident brand marketing',
    ],
    icon: 'gauge',
    image:
      'https://res.cloudinary.com/v4fs2klq/image/upload/v1795334450/rare_aesthetics/services/zbdricivy13qepiheiiz.jpg',
  },
  {
    id: 'competitive-trend-intelligence',
    title: 'Competitive Trend Intelligence Analysis',
    short:
      'Strategic analysis of competitor products, category shifts, and consumer insights providing actionable intelligence.',
    description:
      'Strategic analysis of competitor products, market trends, and consumer insights. We provide actionable intelligence to help you differentiate your brand, identify white space opportunities, and stay ahead of market shifts.',
    benefits: [
      'Competitor product deconstruction and benchmarking',
      'Actionable white space opportunity discovery',
      'Strategic positioning to stay ahead of market trends',
    ],
    icon: 'trend',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'brand-strategy-identity',
    title: 'Brand Strategy & Identity Positioning',
    short:
      'Compelling brand narratives, tone of voice, and distinct visual positioning to build authentic connections with consumers.',
    description:
      'Develop compelling brand narratives and strategic positioning that resonates with your target audience. We help define your brand’s unique value proposition, tone of voice, and visual identity to create authentic connections with consumers.',
    benefits: [
      'Unique value proposition and brand voice definition',
      'Compelling narrative that connects with beauty consumers',
      'Cohesive visual identity and luxury positioning',
    ],
    icon: 'spark',
    image: sheetMaskImage,
  },
  {
    id: 'packaging-manufacturing-sourcing',
    title: 'Packaging & Manufacturing Sourcing',
    short:
      'End-to-end component sourcing and reliable manufacturer partner matching aligned with aesthetics and sustainability.',
    description:
      'End-to-end sourcing solutions for packaging components and manufacturing partners. We identify reliable suppliers, negotiate contracts, and manage quality control to ensure timely delivery of materials that align with your brand aesthetics and sustainability goals.',
    benefits: [
      'Curated network of packaging suppliers and manufacturers',
      'Contract negotiation and supplier quality management',
      'Alignment with luxury aesthetics and sustainable standards',
    ],
    icon: 'package',
    image: packagingImage,
  },
  {
    id: 'project-cost-time-management',
    title: 'Project Cost & Time Management',
    short:
      'Detailed project planning, milestone tracking, and transparent resource management to keep development on schedule and budget.',
    description:
      'Comprehensive project management services to keep your development on track and within budget. We develop detailed project plans, track milestones, manage resources, and provide transparent reporting throughout the product development journey.',
    benefits: [
      'Comprehensive development roadmaps and milestone tracking',
      'Budget management and transparent cost visibility',
      'Efficient resource allocation ensuring timely market delivery',
    ],
    icon: 'clock',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'reverse-engineering',
    title: 'Reverse Engineering',
    short:
      'Deconstruction and analysis of benchmark products to decode formula composition, texture synergy, and manufacturing.',
    description:
      'Deconstruction and analysis of existing products to understand formulation composition, ingredient synergy, and manufacturing processes. We help you improve existing formulations, create competitive alternatives, or troubleshoot production issues.',
    benefits: [
      'Analytical deconstruction of target benchmark formulas',
      'Decoding ingredient synergy and distinctive sensory textures',
      'Formulation improvement and production issue troubleshooting',
    ],
    icon: 'layers',
    image:
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'quality-management',
    title: 'Quality Management',
    short:
      'Comprehensive quality assurance systems, GMP compliance adherence, and rigorous quality control protocols across your supply chain.',
    description:
      'Comprehensive quality assurance systems to maintain product consistency and excellence. We develop quality control protocols, conduct audits, implement corrective actions, and ensure adherence to GMP standards throughout your supply chain.',
    benefits: [
      'Standardized quality control protocols and specifications',
      'Supply chain audits and Good Manufacturing Practice (GMP) standards',
      'Consistency, batch reproducibility, and excellence assurance',
    ],
    icon: 'badge',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
];
