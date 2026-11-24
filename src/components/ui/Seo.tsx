import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '@/data/site';
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  CORE_KEYWORDS,
  absoluteUrl,
} from '@/data/seo';

export interface SeoProps {
  title: string;
  description?: string;
  keywords?: string | string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'business.business';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: Array<{ name: string; path: string }>;
}

function toAbsoluteImage(image: string): string {
  if (image.startsWith('http')) return image;
  return absoluteUrl(image.startsWith('/') ? image : `/${image}`);
}

export function Seo({
  title,
  description = 'My Rare Aesthetics — premium cosmetic product development, clinical formulation, manufacturing coordination and consulting in Pretoria, South Africa.',
  keywords,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = siteConfig.founder,
  noindex = false,
  schema,
  breadcrumbs,
}: SeoProps) {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const canonicalUrl = canonical || absoluteUrl(pathname);
  const absoluteImageUrl = toAbsoluteImage(image);

  const fullTitle = title.includes(siteConfig.brand)
    ? title
    : `${title} | ${siteConfig.brand}`;

  const keywordsString = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords || CORE_KEYWORDS.join(', ');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.brand,
    alternateName: ['Rare Aesthetics', 'My Rare Aesthetics Pretoria'],
    description,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
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
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -25.7655,
      longitude: 28.2108,
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    sameAs: [
      siteConfig.social.tiktok,
      siteConfig.social.x,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ].filter(Boolean),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: fullTitle,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: siteConfig.brand,
      url: SITE_URL,
      inLanguage: 'en-ZA',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-ZA',
  };

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
          })),
        }
      : null;

  const schemas: Record<string, unknown>[] = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [organizationSchema, webPageSchema];

  if (breadcrumbSchema) schemas.push(breadcrumbSchema);

  const robotsContent = noindex
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-ZA" />
      <title>{fullTitle}</title>

      {/* Primary */}
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <meta name="creator" content={siteConfig.brand} />
      <meta name="publisher" content={siteConfig.brand} />
      <meta name="application-name" content={siteConfig.brand} />
      <meta name="theme-color" content="#5F3A68" />
      <meta name="color-scheme" content="light" />
      <meta name="format-detection" content="telephone=yes,address=yes,email=yes" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-ZA" />

      {/* Geo / Local SEO */}
      <meta name="geo.region" content="ZA-GP" />
      <meta name="geo.placename" content="Pretoria" />
      <meta name="geo.position" content="-25.7655;28.2108" />
      <meta name="ICBM" content="-25.7655, 28.2108" />

      {/* Canonical + alternate */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-ZA" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta property="og:locale" content="en_ZA" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && <meta property="article:author" content={author} />}
      {type === 'article' && <meta property="article:section" content="Cosmetic Formulation" />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@RareAesthetics_" />
      <meta name="twitter:creator" content="@RareAesthetics_" />

      {/* App / mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteConfig.brand} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="msapplication-TileColor" content="#5F3A68" />
      <meta name="msapplication-config" content="none" />

      {/* Structured data */}
      {schemas.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}

export default Seo;
