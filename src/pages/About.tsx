import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { FinalCta } from '@/components/FinalCta';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { siteConfig } from '@/data/site';
import { pageSeo } from '@/data/seo';
import { usePageHeader } from '@/hooks/usePageHeader';
import { apiUrl } from '@/lib/api';
import founderImage from '@/images/WhatsApp Image 2026-11-21 at 16.09.57.jpeg';

const aboutSlides = [
  {
    title: 'Science & Luxury',
    description:
      'Science-led beauty development crafted with an unapologetic touch of luxury and clinical precision.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Founded with Purpose',
    description:
      'Founded by Lindi-Grace in Pretoria to empower beauty innovators from initial concept to commercial shelves.',
    media:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Sensory Formulations',
    description:
      'Harmonizing high-potency bio-compatible actives with indulgent textures and distinctive sensory elegance.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Evidence & Testing',
    description:
      'Rigorous stability assessments, raw ingredient scrutiny, and quality-driven cosmetic science.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Batch to Scale',
    description:
      'Translating bench-scale prototype successes into seamless commercial contract manufacturing readiness.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Art of Rare Beauty',
    description:
      'We believe beautiful products emerge where scientific rigor meets the brand imagination of founders.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

const ABOUT_CACHE_KEY = 'mra_about_cache';

const getCachedAboutData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ABOUT_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function About() {
  const slides = usePageHeader('about', aboutSlides);
  const [aboutData, setAboutData] = useState<{
    companyEyebrow?: string;
    companyTitle?: string;
    companyParagraph1?: string;
    companyParagraph2?: string;
    companyParagraph3?: string;
    companyImage?: string;
    founderEyebrow?: string;
    founderName?: string;
    founderTitle?: string;
    founderBio1?: string;
    founderBio2?: string;
    founderBio3?: string;
    founderImage?: string;
    featuredIn?: string;
    missionTitle?: string;
    missionText?: string;
    visionTitle?: string;
    visionText?: string;
    philosophyEyebrow?: string;
    philosophyTitle?: string;
    philosophyDescription?: string;
    philosophyPoints?: string[];
  } | null>(getCachedAboutData);

  useEffect(() => {
    fetch(apiUrl(`/api/about?_t=${Date.now()}`), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.about) {
          setAboutData(data.about);
          try {
            localStorage.setItem(ABOUT_CACHE_KEY, JSON.stringify(data.about));
          } catch {}
        }
      })
      .catch((err) => console.warn('[About] Using cached content:', err));
  }, []);

  return (
    <>
      <Seo
        title={pageSeo.about.title}
        description={pageSeo.about.description}
        keywords={pageSeo.about.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      {/* Hero — interactive Lumina WebGL shader showcase (compact / decreased size) */}
      <section className="relative h-[60svh] min-h-[460px] max-h-[600px] overflow-hidden bg-[#0a0a0a]">
        <LuminaInteractiveList
          slides={slides}
          compact
          autoSlide={false}
          showNavigation={false}
          showCounter={false}
        />
      </section>

      <div id="company-story">
        <Section>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-orchid/30 shadow-md">
                <img
                  src={aboutData?.companyImage || '/images/why-us-lab.png'}
                  alt="Laboratory-inspired cosmetic development atmosphere"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading
                eyebrow={aboutData?.companyEyebrow || 'The company'}
                title={aboutData?.companyTitle || 'Cosmetic product development & consulting'}
                titleClassName="text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15]"
              />
              <div className="prose-rare mt-8 space-y-6 text-lg md:text-xl text-dark-plum/85 leading-relaxed">
                <p>
                  {aboutData?.companyParagraph1 ||
                    'My Rare Aesthetics is a Pretoria-based consultancy focused on cosmetic product development, formulation, manufacturing support and brand-minded consulting.'}
                </p>
                <p>
                  {aboutData?.companyParagraph2 ||
                    'We partner with founders and brands who want a refined pathway from concept to product — combining research, formulation thinking, evaluation support and practical production coordination.'}
                </p>
                <p>
                  {aboutData?.companyParagraph3 ||
                    'Our work is rooted in luxury presentation and scientific care: clear process, quality-focused development, and respect for the artistry of beauty brands.'}
                </p>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      <Section className="bg-orchid/25 pt-24 md:pt-28">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={aboutData?.founderEyebrow || 'Founder'}
              title={aboutData?.founderName || siteConfig.founder}
              titleClassName="text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15]"
            />
            <div className="mt-6 space-y-4 text-dark-plum/85 leading-relaxed text-base md:text-lg">
              <p className="font-semibold text-plum text-lg md:text-xl">
                {aboutData?.founderTitle ||
                  'Cosmetic Chemist | Beauty Innovator | Founder of The RA Group'}
              </p>
              <p>
                {aboutData?.founderBio1 ||
                  'Probably wearing a sheet mask, practising yoga, or experimenting with the next big skincare innovation. Passionate about the science behind beauty, I believe that great skincare is where creativity, research, and innovation come together.'}
              </p>
              <p>
                {aboutData?.founderBio2 ||
                  'Building The RA Group, with a vision to redefine the beauty and cosmetics industry through innovative formulations, premium-quality products, and science-backed skincare solutions.'}
              </p>
              <p>
                {aboutData?.founderBio3 ||
                  'From developing effective skincare and haircare formulations to exploring new beauty trends, every idea begins with curiosity and a commitment to excellence. My mission is to create products that inspire confidence, celebrate individuality, and make beauty more accessible.'}
              </p>
              <p className="font-medium text-plum">
                <strong>Building the future of beauty, one formulation at a time.</strong>
              </p>
              <div className="pt-3 border-t border-plum/15 text-sm md:text-base text-dark-plum/70">
                <strong className="text-plum">Featured in:</strong>{' '}
                {aboutData?.featuredIn || 'Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR'}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-sm border border-plum/20 bg-lavender/60 shadow-md">
              <img
                src={aboutData?.founderImage || '/images/director.jpg'}
                alt="Lindi-Grace — Cosmetic Chemist, Beauty Innovator & Founder"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="h-full border border-plum/10 bg-white/40 p-8 md:p-10 rounded-sm">
              <h3 className="font-heading text-2xl text-plum">
                {aboutData?.missionTitle || 'Mission'}
              </h3>
              <p className="mt-4 leading-relaxed text-dark-plum/70">
                {aboutData?.missionText ||
                  'To help beauty brands transform innovative ideas into thoughtfully developed cosmetic products through formulation, research, testing support and manufacturing coordination.'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full border border-plum/10 bg-white/40 p-8 md:p-10 rounded-sm">
              <h3 className="font-heading text-2xl text-plum">
                {aboutData?.visionTitle || 'Vision'}
              </h3>
              <p className="mt-4 leading-relaxed text-dark-plum/70">
                {aboutData?.visionText ||
                  'To be a trusted partner for beauty entrepreneurs and established brands seeking premium, science-informed product development with elegance and clarity.'}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-atmosphere">
        <Reveal>
          <SectionHeading
            eyebrow={aboutData?.philosophyEyebrow || 'Philosophy'}
            title={aboutData?.philosophyTitle || 'Our approach to cosmetic innovation'}
            description={
              aboutData?.philosophyDescription ||
              'We believe beautiful products are born where scientific rigour meets brand imagination.'
            }
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {(
              (aboutData?.philosophyPoints && aboutData.philosophyPoints.length > 0)
                ? aboutData.philosophyPoints
                : [
                    'Research before formulation decisions',
                    'Sensory experience as a design priority',
                    'Quality-focused development processes',
                    'Clear communication and project coordination',
                    'Brand identity aligned with product reality',
                    'Practical pathways toward manufacturing readiness',
                  ]
            ).map((item) => (
              <li key={item} className="border-l-2 border-orchid pl-5 text-dark-plum/80">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button to="/book">Book a Consultation</Button>
          </div>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
