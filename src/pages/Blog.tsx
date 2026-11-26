import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useContent } from '@/context/ContentContext';
import { pageSeo } from '@/data/seo';
import { defaultBlogPosts, type BlogPost } from '@/data/blog';

const blogSlides = [
  {
    title: 'Where Science Meets Beauty Vision',
    description:
      'Editorial notes from Rare Aesthetics — formulation craft, brand building, and the science behind market-ready skincare.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'R&D Insights',
    description:
      'From ingredient research to clinical validation — perspectives that help founders move with clarity.',
    media:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Craft',
    description:
      'Strategy, positioning, and launch readiness for beauty brands built on authentic science.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
];

function readMinutesFor(post: BlogPost) {
  const wordCount = post.content ? post.content.split(/\s+/).length : 160;
  return Math.max(2, Math.ceil(wordCount / 220));
}

export function Blog() {
  const slides = usePageHeader('blog', blogSlides);
  const { posts } = useContent();
  const fromApi = posts.filter((p) => p.published && p.type === 'blog');
  const published =
    fromApi.length > 0
      ? fromApi
      : defaultBlogPosts.filter((p) => p.published && p.type === 'blog');

  const [featured, ...rest] = [...published].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

      <section className="relative h-[52svh] min-h-[380px] max-h-[520px] overflow-hidden bg-[#0a0a0a]">
        <LuminaInteractiveList
          slides={slides}
          compact
          autoSlide={false}
          showNavigation={false}
          showCounter={false}
        />
      </section>

      <Section className="bg-[linear-gradient(180deg,#f7f2f8_0%,#f3eef6_40%,#f8f6fa_100%)]">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-deep-blue">
              Rare Aesthetics Journal
            </p>
            <h1 className="mt-3 font-heading text-3xl font-medium text-plum sm:text-4xl">
              Welcome to Rare Aesthetics
            </h1>
            <p className="mt-3 text-base leading-relaxed text-dark-plum/70">
              Where science meets beauty vision — notes on formulation, R&D, and building brands
              with clarity.
            </p>
            <p className="mt-4 text-sm text-dark-plum/50">
              {published.length} {published.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </Reveal>

        {featured && (
          <Reveal delay={0.05}>
            <Link
              to={`/blog/${featured.slug}`}
              className="group mt-12 grid overflow-hidden rounded-3xl border border-plum/12 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-plum/30 hover:shadow-lg lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-orchid/20 lg:aspect-auto lg:min-h-[360px]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  loading="eager"
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orchid/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-plum">
                    {featured.category}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-deep-blue/80">
                    {new Date(featured.date).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    <span className="mx-2 text-deep-blue/40">•</span>
                    {readMinutesFor(featured)} min read
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-plum transition group-hover:text-deep-blue sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-dark-plum/70 sm:text-base">
                  {featured.excerpt}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-plum transition group-hover:gap-3 group-hover:text-deep-blue">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.05}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/12 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-plum/28 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-orchid/15">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-plum shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-deep-blue">
                      {new Date(post.date).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span className="mx-1.5 opacity-40">•</span>
                      {readMinutesFor(post)} min
                    </p>
                    <h3 className="mt-2.5 font-heading text-xl font-semibold leading-snug text-plum transition group-hover:text-deep-blue">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-dark-plum/70 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 border-t border-plum/10 pt-4 text-sm font-semibold text-plum transition group-hover:gap-2.5 group-hover:text-deep-blue">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {published.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-plum/20 bg-white/70 px-6 py-16 text-center">
            <p className="font-heading text-2xl text-plum">Blog posts coming soon</p>
            <p className="mt-2 text-sm text-dark-plum/65">Check back for new editorial notes.</p>
          </div>
        )}
      </Section>
    </>
  );
}
