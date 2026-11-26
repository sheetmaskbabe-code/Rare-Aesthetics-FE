import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useContent } from '@/context/ContentContext';
import { pageSeo } from '@/data/seo';

const blogSlides = [
  {
    title: 'Editorial & Insights',
    description:
      'Perspectives on cosmetic science, luxury formulation craft, ingredient research, and beauty brand building.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Formulation Notes',
    description:
      'Deep dives into biocompatible actives, sensory rheology, and next-generation cosmetic textures.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Ingredient Scrutiny',
    description:
      'Evidence-backed analysis of clean chemistry, stability profiles, and clinical efficacy standards.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Innovation',
    description:
      'Strategic frameworks for positioning niche and prestige cosmetic brands in competitive retail landscapes.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Regulatory Horizons',
    description:
      'Navigating evolving cosmetic guidelines, documentation best practices, and compliance protocols.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Behind the Bench',
    description:
      'Reflections from cosmetic development laboratories, formulation iterations, and batch scale-ups.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
];

export function Blog() {
  const slides = usePageHeader('blog', blogSlides);
  const { posts } = useContent();
  const published = posts.filter((p) => p.published);

  return (
    <>
      <Seo
        title={pageSeo.blog.title}
        description={pageSeo.blog.description}
        keywords={pageSeo.blog.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
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

      <Section className="bg-lavender/20">
        <div className="grid gap-8 md:grid-cols-2">
          {published.map((post, i) => {
            const wordCount = post.content ? post.content.split(/\s+/).length : 200;
            const readMinutes = Math.max(2, Math.ceil(wordCount / 220));

            return (
              <Reveal key={post.id} delay={(i % 2) * 0.06}>
                {/* Individual separate box for each blog post */}
                <article className="h-full">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/15 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-plum/35 hover:bg-white hover:shadow-xl"
                  >
                    {/* Card Media Header */}
                    <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-orchid/20">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum shadow-md backdrop-blur-md">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Box */}
                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-deep-blue font-medium">
                          <span>
                            {new Date(post.date).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{readMinutes} min read</span>
                        </div>

                        <h2 className="mt-3 font-heading text-2xl font-semibold leading-snug text-plum transition duration-300 group-hover:text-deep-blue">
                          {post.title}
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-dark-plum/75 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-6 flex items-center justify-between border-t border-plum/10 pt-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum transition-all duration-300 group-hover:gap-2.5 group-hover:text-deep-blue">
                          Read blog <ArrowRight className="h-4 w-4" />
                        </span>
                        <span className="text-xs uppercase tracking-wider text-dark-plum/50 font-medium">
                          Rare Aesthetics
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
