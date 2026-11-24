import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '@/data/site';

export interface SeoProps {
  title: string;
  description?: string;
  keywords?: string | string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'business.business';
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

export function Seo({
  title,
  description = 'My Rare Aesthetics — premium cosmetic product development, clinical formulation, manufacturing coordination and consulting in Pretoria, South Africa.',
  keywords,
  canonical,
  image = '/logo.png',
  type = 'website',
  publishedTime,
  author = siteConfig.founder,
  noindex = false,
  schema,
}: SeoProps) {
  const location = useLocation();
  const currentUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : '';
  const canonicalUrl = canonical || currentUrl;

  const fullTitle = title.includes(siteConfig.brand)
    ? title
    : `${title} | ${siteConfig.brand}`;

  const defaultKeywords = [
    'cosmetic formulation',
    'cosmetic chemist South Africa',
    'beauty product development',
    'skincare formulation Pretoria',
    'cosmetic manufacturing support',
    'private label cosmetics South Africa',
    'cosmetic regulatory compliance',
    'beauty consultant Pretoria',
    'My Rare Aesthetics',
    'Lindi-Grace',
  ];

  const keywordsString = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords || defaultKeywords.join(', ');

  const absoluteImageUrl = image.startsWith('http')
    ? image
    : typeof window !== 'undefined'
    ? `${window.location.origin}${image}`
    : image;

  // Rich Schema.org LocalBusiness & ProfessionalService JSON-LD Structured Data
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.brand,
    description,
    url: typeof window !== 'undefined' ? window.location.origin : 'https://myrareaesthetics.com',
    logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png',
    image: absoluteImageUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
      jobTitle: 'Cosmetic Chemist & Founder',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60 Willow Rd, Muckleneuk',
      addressLocality: 'Pretoria',
      postalCode: '0002',
      addressCountry: 'ZA',
    },
    priceRange: '$$$',
    sameAs: [
      siteConfig.social.tiktok,
      siteConfig.social.x,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ].filter(Boolean),
  };

  const jsonLd = schema || defaultSchema;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta property="og:locale" content="en_ZA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* Structured JSON-LD Data Schema */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

export default Seo;
