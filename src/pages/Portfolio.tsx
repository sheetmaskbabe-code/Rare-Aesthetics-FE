import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { FinalCta } from '@/components/FinalCta';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useContent } from '@/context/ContentContext';
import { portfolioCategories } from '@/data/portfolio';
import { pageSeo } from '@/data/seo';
import { cn } from '@/lib/utils';

const portfolioSlides = [
  {
    title: 'Radiant Skincare',
    description:
      'Clinical cosmetic formulations developed with sensory distinction and certified active potency.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Luxury Packaging',
    description:
      'Custom bottle, jar, and pump component sourcing tailored for high-end luxury shelf appeal.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Bespoke Formulation',
    description:
      'Tailor-made emulsions, serums, and creams balancing botanical luxury with biological efficacy.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Development',
    description:
      'Elevating founder vision into distinctive brand identity, visual presence, and market positioning.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Product Launch',
    description:
      'Guiding commercial launches from lab bench testing to batch manufacturing readiness.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Clean Chemistry',
    description:
      'Next-generation green chemistry and bio-compatible cosmetic development in Pretoria.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

export function Portfolio() {
  const slides = usePageHeader('portfolio', portfolioSlides);
  const { portfolio } = useContent();
  const [category, setCategory] = useState<string>('All');
  const published = portfolio.filter((p) => p.published);

  const filtered = useMemo(() => {
    if (category === 'All') return published;
    return published.filter((p) => p.category === category);
  }, [published, category]);

  return (
    <>
      <Seo
        title={pageSeo.portfolio.title}
        description={pageSeo.portfolio.description}
        keywords={pageSeo.portfolio.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
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

      <div id="portfolio-grid">
        <Section>
          <div className="flex flex-wrap gap-2">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  'rounded-sm px-4 py-2 text-sm transition',
                  category === cat
                    ? 'bg-plum text-lavender'
                    : 'bg-orchid/30 text-dark-plum hover:bg-orchid/50'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Reveal>
              <div className="mt-12 border border-dashed border-plum/25 bg-white/40 px-8 py-20 text-center">
                <p className="font-heading text-2xl text-plum">Portfolio awaiting approved projects</p>
                <p className="mx-auto mt-3 max-w-lg text-dark-plum/60">
                  No invented case studies. When projects and images are approved, an authorised
                  administrator can publish them from the Admin dashboard.
                </p>
                <Link
                  to="/admin"
                  className="mt-6 inline-block text-sm font-medium text-deep-blue hover:underline"
                >
                  Go to Admin
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => {
                const targetLink = item.link || `/portfolio/${item.slug}`;

                return (
                  <Reveal key={item.id} delay={(i % 3) * 0.06}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/10 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                      {/* Top Image */}
                      <Link to={targetLink} className="relative block aspect-[16/11] overflow-hidden bg-orchid/15">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-plum shadow-md backdrop-blur-md">
                            {item.category}
                          </span>
                        </div>
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col items-center justify-between p-6 sm:p-8 text-center">
                        <div>
                          <h2 className="font-heading text-2xl font-bold text-plum transition group-hover:text-deep-blue">
                            {item.title}
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-dark-plum/75 max-w-sm">
                            {item.description}
                          </p>
                        </div>

                        {/* Centered Button matching the screenshot */}
                        <div className="mt-6 flex w-full justify-center">
                          <Link
                            to={targetLink}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0f3b60] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-plum hover:shadow-md"
                          >
                            {item.buttonText || 'LEARN MORE'} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Section>
      </div>

      <FinalCta />
    </>
  );
}
