import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { FinalCta } from '@/components/FinalCta';
import { Accordion } from '@/components/ui/Accordion';
import { ServiceIcon } from '@/components/ServiceIcon';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { TestimonialsSlider } from '@/components/TestimonialsSlider';
import { services } from '@/data/services';
import { processSteps } from '@/data/process';
import { faqs } from '@/data/faq';
import { siteConfig } from '@/data/site';
import { pageSeo } from '@/data/seo';
import { useContent } from '@/context/ContentContext';
import { apiUrl } from '@/lib/api';

import heroImg1 from '@/images/WhatsApp Image 2026-11-19 at 16.29.40.jpeg';
import heroImg2 from '@/images/WhatsApp Image 2026-11-19 at 16.29.40 (1).jpeg';
import heroImg3 from '@/images/WhatsApp Image 2026-11-19 at 16.29.40 (2).jpeg';
import featureImg from '@/images/FRyukxlXsAYv02m.jpg';
import founderImage from '@/images/WhatsApp Image 2026-11-21 at 16.09.57.jpeg';

const heroSlides = [
  {
    title: 'Ethereal Formulations',
    description:
      'Transforming innovative cosmetic ideas into thoughtfully developed beauty products through formulation and research.',
    media: '/images/process-bottles.jpg',
  },
  {
    title: 'Rose Mirage',
    description:
      'Where science meets the art of beauty — clinical cosmetic chemistry tailored for discerning founders and brands.',
    media: '/images/mra-products.jpg',
  },
  {
    title: 'Velvet Mystique',
    description:
      'Sensory-rich textures engineered with high-potency bio-compatible actives and premium sensory elegance.',
    media: '/images/custom-bottles.jpg',
  },
  {
    title: 'Signature Sheet Masks',
    description:
      'Targeted skincare innovation and thoughtfully developed sheet mask treatments crafted for discerning beauty founders.',
    media: '/images/mra-sheetmasks.jpg',
  },
];

const aboutImage = '/images/director.jpg';
const featureImage = '/images/mra-sheetmasks.jpg';

const whyPoints = [
  'Integrated product development support',
  'Research-driven approach',
  'Cosmetic formulation expertise',
  'Brand development support',
  'Project coordination',
  'Quality-focused processes',
];

const HOME_CACHE_KEY = 'mra_home_cache';

const getCachedHomeData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(HOME_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.testimonials && parsed.testimonials.length < 3) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export function Home() {
  const { posts, portfolio } = useContent();
  const publishedPosts = posts.filter((p) => p.published).slice(0, 5);
  const publishedPortfolio = portfolio.filter((p) => p.published).slice(0, 6);

  const [homeData, setHomeData] = useState<{
    heroSlides?: typeof heroSlides;
    heroCtaPrimaryText?: string;
    heroCtaPrimaryLink?: string;
    heroCtaSecondaryText?: string;
    heroCtaSecondaryLink?: string;
    aboutEyebrow?: string;
    aboutTitle?: string;
    aboutDescription?: string;
    aboutParagraph1?: string;
    aboutParagraph2?: string;
    aboutImage?: string;
    featureEyebrow?: string;
    featureTitle?: string;
    featureDescription?: string;
    featureButtonText?: string;
    featureButtonLink?: string;
    featureImage?: string;
    testimonialsEyebrow?: string;
    testimonialsTitle?: string;
    testimonialsDescription?: string;
    testimonialsPlaceholder?: string;
    testimonials?: {
      quote: string;
      author: string;
      role?: string;
      rating?: number;
    }[];
  } | null>(getCachedHomeData);

  const [servicesList, setServicesList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('mra_services_cache');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.services && Array.isArray(parsed.services) && parsed.services.length > 0) {
            return parsed.services;
          }
        }
      } catch {}
    }
    return services;
  });

  useEffect(() => {
    const loadHomeData = () => {
      fetch(apiUrl(`/api/home?_t=${Date.now()}`), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.home) {
            setHomeData(data.home);
            try {
              localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(data.home));
            } catch {}
          }
        })
        .catch((err) => console.warn('[Home] Using cached home layout:', err));
    };

    loadHomeData();

    fetch(apiUrl(`/api/services-content?_t=${Date.now()}`), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content?.services && data.content.services.length > 0) {
          setServicesList(data.content.services);
          try {
            localStorage.setItem('mra_services_cache', JSON.stringify(data.content));
          } catch {}
        }
      })
      .catch((err) => console.warn('[Home] Using default services layout:', err));

    // Automatically re-sync whenever user focuses or switches back to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadHomeData();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadHomeData);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadHomeData);
    };
  }, []);

  // Compute dynamic slides: overlay custom titles/descriptions/images on top of defaults
  const activeSlides = useMemo(() => {
    return (homeData?.heroSlides?.length ? homeData.heroSlides : heroSlides).map(
      (slide, idx) => ({
        title: slide.title || heroSlides[idx]?.title || 'Ethereal Formulations',
        description: slide.description || heroSlides[idx]?.description || '',
        media: slide.media || heroSlides[idx]?.media || '/images/process-bottles.jpg',
      })
    );
  }, [homeData?.heroSlides]);

  const aboutImg = homeData?.aboutImage || aboutImage;
  const featImg = homeData?.featureImage || featureImage;

  return (
    <>
      <Seo
        title={pageSeo.home.title}
        description={pageSeo.home.description}
        keywords={pageSeo.home.keywords}
        breadcrumbs={[{ name: 'Home', path: '/' }]}
      />

      {/* Hero — interactive Lumina WebGL shader showcase */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#0a0a0a]">
        <LuminaInteractiveList slides={activeSlides} showNavigation={false}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              to={homeData?.heroCtaPrimaryLink || '/services'}
              className="bg-[#8524F9] text-white hover:bg-[#731bd9] border-none font-medium px-6 py-3 shadow-lg transition-transform hover:scale-[1.02]"
            >
              {homeData?.heroCtaPrimaryText || 'Explore Our Services'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              to={homeData?.heroCtaSecondaryLink || '/book'}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-md px-6 py-3 transition-transform hover:scale-[1.02]"
            >
              {homeData?.heroCtaSecondaryText || 'Book a Consultation'}
              <Sparkles className="ml-2 h-4 w-4 text-[#8524F9]" />
            </Button>
          </div>
        </LuminaInteractiveList>
      </section>

      {/* About intro */}
      <Section className="bg-atmosphere pb-10 md:pb-12">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-orchid/30">
              <img
                src={aboutImg}
                alt="Elegant cosmetic product arrangement"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              title={homeData?.aboutTitle || 'Discover the Science Behind Beautiful Products.'}
              titleClassName="text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15]"
              description={
                homeData?.aboutDescription ||
                'My Rare Aesthetics supports beauty entrepreneurs and established brands through cosmetic product development and consulting — with a focus on thoughtful formulation, research and manufacturing support.'
              }
              descriptionClassName="text-xl md:text-2xl leading-relaxed text-dark-plum/90"
            />
            <div className="mt-8 space-y-5 text-lg md:text-xl leading-relaxed text-dark-plum/85">
              <p>
                {homeData?.aboutParagraph1 ||
                  `Based in ${siteConfig.location}, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.`}
              </p>
              <p>
                {homeData?.aboutParagraph2 ||
                  `Founded by ${siteConfig.founder}, My Rare Aesthetics brings a premium, science-led approach to product development — without losing the artistry that makes beauty brands distinctive.`}
              </p>
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-lg md:text-xl font-medium text-plum transition hover:gap-3"
            >
              Learn more about us <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="pt-2 md:pt-6">
        <Reveal>
          <div className="max-w-3xl">
            <Link to="/services" className="block group">
              <h2 className="font-heading text-3xl font-medium leading-tight text-plum md:text-5xl transition group-hover:text-deep-blue">
                Premium cosmetic development capabilities
              </h2>
            </Link>
            <p className="mt-5 text-base leading-relaxed text-dark-plum/70 md:text-lg">
              A focused suite of formulation, research, evaluation and brand support services for beauty innovators.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 md:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.slice(0, 5).map((service, i) => (
            <Reveal key={service.id || i} delay={i * 0.05}>
              <Link
                to={service.id ? `/services/${service.id}` : '/services'}
                className="group flex h-full flex-col overflow-hidden border border-plum/10 bg-white/60 transition duration-500 hover:border-plum/25 hover:bg-white hover:shadow-lg"
              >
                <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-orchid/20">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-plum/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-plum shadow-md backdrop-blur-sm">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl text-plum transition group-hover:text-deep-blue">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-plum/70">{service.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-deep-blue">
                    Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* 6th Card: View all services with blurred background & centered content */}
          <Reveal delay={0.25}>
            <Link
              to="/services"
              className="group relative flex h-full min-h-[380px] flex-col items-center justify-center overflow-hidden border border-plum/20 bg-white/70 p-8 text-center backdrop-blur-md transition duration-500 hover:border-plum/40 hover:bg-white/90 hover:shadow-xl"
            >
              {/* Blurred background image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={servicesList[5]?.image || services[5]?.image}
                  alt="View all services background"
                  className="h-full w-full object-cover filter blur-[8px] scale-110 opacity-40 transition-transform duration-700 ease-out group-hover:scale-125"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
              </div>

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <ArrowRight className="mb-4 h-8 w-8 text-plum transition-transform duration-300 group-hover:translate-x-1.5" />
                <h3 className="font-heading text-2xl font-medium text-plum transition group-hover:text-deep-blue">
                  All Capabilities & Services
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-dark-plum/75">
                  Explore our complete suite of cosmetic formulation, clinical testing, and consulting services.
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 rounded-sm border border-plum/40 bg-white/90 px-6 py-3 text-sm font-medium text-plum shadow-sm backdrop-blur-md transition group-hover:bg-plum group-hover:text-white">
                    View all services
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Product development feature */}
      <Section className="!py-0" dark>
        <div className="grid lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-0 py-16 lg:order-1 lg:py-24 lg:pr-16">
            <Reveal>
              <p className="mb-4 font-alt text-xs uppercase tracking-[0.28em] text-orchid">
                {homeData?.featureEyebrow || 'Product Development'}
              </p>
              <h2 className="font-heading text-3xl font-medium leading-tight text-lavender md:text-5xl">
                {homeData?.featureTitle || 'From a spark of an idea to a finished cosmetic product.'}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-lavender/70 md:text-lg">
                {homeData?.featureDescription ||
                  'We guide beauty innovators through research, formulation, evaluation and production coordination — helping transform concepts into products that feel intentional, premium and ready for the next stage of their journey.'}
              </p>
              <div className="mt-8">
                <Button to={homeData?.featureButtonLink || '/process'} variant="secondary">
                  {homeData?.featureButtonText || 'Explore our process'}
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="order-1 min-h-[320px] lg:order-2 lg:min-h-[560px]">
            <img
              src={featImg}
              alt="My Rare Aesthetics Doing The Most Mugwort Sheet Mask and skincare collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="bg-atmosphere">
        <Reveal>
          <SectionHeading
            title="A clear seven-stage journey"
            description="Modern cosmetic development with structure, creativity and quality at every step."
          />
        </Reveal>
        <div className="mt-14 space-y-6">
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.05}>
              <div className="grid gap-4 border-t border-plum/15 pt-6 md:grid-cols-[120px_1fr] md:gap-10">
                <span className="font-heading text-4xl font-light text-orchid md:text-5xl">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-heading text-2xl text-plum">{step.title}</h3>
                  <p className="mt-3 max-w-3xl text-dark-plum/70">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-12">
            <Button to="/process" variant="outline">
              Full process overview
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Portfolio */}
      <Section>
        <Reveal>
          <div className="max-w-3xl">
            <SectionHeading
              title="Selected work"
              description="Client-approved projects appear here. Until then, this gallery remains ready for authentic case studies."
            />
          </div>
        </Reveal>

        {publishedPortfolio.length === 0 ? (
          <Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="flex aspect-[4/5] flex-col items-center justify-center border border-dashed border-plum/25 bg-orchid/15 p-8 text-center"
                >
                  <p className="font-heading text-lg text-plum">Project placeholder</p>
                  <p className="mt-2 text-sm text-dark-plum/55">
                    Add approved portfolio work in Admin
                  </p>
                </div>
              ))}
              {/* View Portfolio Action Card */}
              <Link
                to="/portfolio"
                className="group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-sm border border-plum/20 bg-white/70 p-6 text-center backdrop-blur-md transition duration-500 hover:border-plum/40 hover:bg-white/90 hover:shadow-xl"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80"
                    alt="View all portfolio background"
                    className="h-full w-full object-cover filter blur-[8px] scale-110 opacity-30 transition-transform duration-700 ease-out group-hover:scale-125"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <ArrowRight className="mb-4 h-8 w-8 text-plum transition-transform duration-300 group-hover:translate-x-1.5" />
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-plum transition group-hover:text-deep-blue">
                    All Case Studies & Work
                  </h3>
                  <p className="mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-dark-plum/75">
                    Explore our client formulations, brand development projects, and cosmetic product launches.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 rounded-sm border border-plum/40 bg-white/90 px-5 py-2.5 text-sm font-medium text-plum shadow-sm backdrop-blur-md transition group-hover:bg-plum group-hover:text-white">
                      View portfolio
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedPortfolio.slice(0, 5).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <Link to={`/portfolio/${item.slug}`} className="img-zoom group block h-full">
                  <div className="aspect-[4/5] bg-orchid/20 overflow-hidden rounded-sm">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-deep-blue">{item.category}</p>
                    <h3 className="mt-1 font-heading text-xl text-plum group-hover:underline">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* View Portfolio Action Card (matches Services 6th card) */}
            <Reveal delay={publishedPortfolio.slice(0, 5).length * 0.05}>
              <Link
                to="/portfolio"
                className="group relative flex aspect-[4/5] h-full flex-col items-center justify-center overflow-hidden rounded-sm border border-plum/20 bg-white/70 p-6 text-center backdrop-blur-md transition duration-500 hover:border-plum/40 hover:bg-white/90 hover:shadow-xl"
              >
                {/* Blurred background image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80"
                    alt="View all portfolio background"
                    className="h-full w-full object-cover filter blur-[8px] scale-110 opacity-30 transition-transform duration-700 ease-out group-hover:scale-125"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
                </div>

                {/* Centered content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <ArrowRight className="mb-4 h-8 w-8 text-plum transition-transform duration-300 group-hover:translate-x-1.5" />
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-plum transition group-hover:text-deep-blue">
                    All Case Studies & Work
                  </h3>
                  <p className="mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-dark-plum/75">
                    Explore our client formulations, brand development projects, and cosmetic product launches.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 rounded-sm border border-plum/40 bg-white/90 px-5 py-2.5 text-sm font-medium text-plum shadow-sm backdrop-blur-md transition group-hover:bg-plum group-hover:text-white">
                      View portfolio
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        )}
      </Section>

      {/* Why choose us */}
      <Section className="bg-orchid/30">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              title="A sophisticated approach to cosmetic innovation"
              description="We combine scientific care with brand-minded development so your product journey feels both rigorous and refined."
            />
            <div className="mt-8">
              <Button to="/why-choose-us" variant="primary">
                Why My Rare Aesthetics
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {whyPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 border-b border-plum/15 pb-4 font-heading text-xl text-plum"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-deep-blue" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Testimonials section */}
      <Section>
        <Reveal>
          <SectionHeading
            title={homeData?.testimonialsTitle || 'Client voices'}
            description={
              homeData?.testimonialsDescription ||
              'Genuine testimonials will be featured here once approved by the business.'
            }
            align="center"
          />
        </Reveal>
        <Reveal delay={0.1}>
          {homeData?.testimonials && homeData.testimonials.length > 0 ? (
            <TestimonialsSlider testimonials={homeData.testimonials} />
          ) : null}
        </Reveal>
      </Section>

      {/* Blog */}
      <Section className="bg-atmosphere">
        <Reveal>
          <div className="max-w-3xl">
            <SectionHeading
              title="Editorial notes from the lab and the brand desk"
            />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {publishedPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06}>
              <article className="h-full">
                <Link
                  to={`/articles/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/15 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-plum/35 hover:bg-white hover:shadow-xl"
                >
                  <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-orchid/20">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/process-bottles.jpg';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-plum shadow-md backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-deep-blue font-medium">
                        {new Date(post.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <h3 className="mt-2.5 font-heading text-xl font-semibold leading-snug text-plum transition group-hover:text-deep-blue line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-dark-plum/70 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-plum/10 pt-3">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum transition-all duration-300 group-hover:gap-2.5 group-hover:text-deep-blue">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}

          {/* View all articles action card */}
          <Reveal delay={publishedPosts.length * 0.06}>
            <Link
              to="/articles"
              className="group relative flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-plum/20 bg-white/70 p-8 text-center backdrop-blur-md transition duration-500 hover:border-plum/40 hover:bg-white/90 hover:shadow-xl"
            >
              {/* Blurred background image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80"
                  alt="View all articles background"
                  className="h-full w-full object-cover filter blur-[8px] scale-110 opacity-30 transition-transform duration-700 ease-out group-hover:scale-125"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
              </div>

              {/* Centered content */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <ArrowRight className="mb-4 h-8 w-8 text-plum transition-transform duration-300 group-hover:translate-x-1.5" />
                <h3 className="font-heading text-2xl font-medium text-plum transition group-hover:text-deep-blue">
                  All Articles
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-dark-plum/75">
                  Explore our complete archive of cosmetic chemistry notes, formulation research, and industry insights.
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 rounded-sm border border-plum/40 bg-white/90 px-5 py-2.5 text-sm font-medium text-plum shadow-sm backdrop-blur-md transition group-hover:bg-[#8524F9] group-hover:border-[#8524F9] group-hover:text-white">
                    View all articles
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              title="Questions, answered with clarity"
              description="Common questions about consultations, timelines, testing and project support."
            />
            <div className="mt-8">
              <Button to="/faq" variant="outline">
                View all FAQs
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion items={faqs.slice(0, 5)} />
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
