import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { FinalCta } from '@/components/FinalCta';
import { ServiceIcon } from '@/components/ServiceIcon';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import formulationImage from '@/images/WhatsApp Image 2026-11-19 at 16.29.40 (1).jpeg';
import { services as defaultServices } from '@/data/services';
import { pageSeo } from '@/data/seo';
import { apiUrl } from '@/lib/api';

const serviceSlides = [
  {
    title: 'Cosmetic Formulation',
    description:
      'Turn concept briefs into refined, manufacturable cosmetic formulas with sensory excellence and active potency.',
    media: formulationImage,
  },
  {
    title: 'Manufacturing Support',
    description:
      'Comprehensive coordination support from laboratory pilot batches through full commercial batch production.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Ingredient Research',
    description:
      'Exploring high-efficacy bio-compatible actives, textures, and next-generation cosmetic technologies.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Testing & Clinicals',
    description:
      'Coordinating formulation stability assessments, microbiological tests, and evidence evaluation pathways.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Regulatory Guidance',
    description:
      'Navigating domestic and international cosmetic compliance, product documentation, and labelling checkpoints.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Packaging & Strategy',
    description:
      'Insight-led product positioning, luxury component sourcing, and distinctive brand aesthetics.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

export function Services() {
  const slides = usePageHeader('services', serviceSlides);
  const [content, setContent] = useState<{
    eyebrow?: string;
    title?: string;
    description?: string;
    services?: any[];
  }>({
    eyebrow: 'Our Capabilities',
    title: 'End-to-End Cosmetic Development',
    description:
      'Explore our specialized formulation, evaluation, regulatory, and production coordination services.',
    services: defaultServices,
  });

  useEffect(() => {
    fetch(apiUrl('/api/services-content'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content) {
          setContent({
            eyebrow: data.content.eyebrow || 'Our Capabilities',
            title: data.content.title || 'End-to-End Cosmetic Development',
            description:
              data.content.description ||
              'Explore our specialized formulation, evaluation, regulatory, and production coordination services.',
            services:
              data.content.services && data.content.services.length > 0
                ? data.content.services
                : defaultServices,
          });
        }
      })
      .catch((err) => console.warn('[Services] Fallback to default:', err));
  }, []);

  const serviceList = content.services && content.services.length > 0 ? content.services : defaultServices;

  return (
    <>
      <Seo
        title={pageSeo.services.title}
        description={pageSeo.services.description}
        keywords={pageSeo.services.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
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

      <div id="all-services">
        <Section>
          <div className="mb-10 max-w-2xl">
            <p className="font-heading text-xs font-medium tracking-[0.22em] text-plum uppercase md:text-sm">
              {content.eyebrow || 'Our Capabilities'}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-medium text-plum sm:text-4xl">
              {content.title || 'End-to-End Cosmetic Development'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-dark-plum/70 md:text-base">
              {content.description ||
                'Explore our specialized formulation, evaluation, regulatory, and production coordination services.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {serviceList.map((service, i) => (
              <Reveal key={service.id || i} delay={(i % 3) * 0.05}>
                <Link
                  to={`/services/${service.id}`}
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
                    <h2 className="font-heading text-xl text-plum transition group-hover:text-deep-blue md:text-2xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-plum/70">
                      {service.short}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <FinalCta />
    </>
  );
}
