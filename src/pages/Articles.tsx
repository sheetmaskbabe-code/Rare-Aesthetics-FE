import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useContent } from '@/context/ContentContext';
import { pageSeo } from '@/data/seo';
import { resolvePostLink } from '@/lib/utils';
import {
  OKOA_HUB_PATH,
  OKOA_LOGO_URL,
  okoaArticleCount,
} from '@/data/okoaArticles';
import {
  OKOA_REDDIT_HUB_PATH,
  OKOA_REDDIT_LOGO_URL,
  okoaRedditPostCount,
} from '@/data/okoaReddit';
import type { BlogPost } from '@/data/blog';

const articleSlides = [
  {
    title: 'Editorial & Lab Notes',
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
    title: 'Behind the Bench',
    description:
      'Reflections from cosmetic development laboratories, formulation iterations, and batch scale-ups.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
];

/** Press features that must stay at the top of Articles. */
function topPinRank(post: BlogPost) {
  const title = (post.title || '').toLowerCase();
  const link = (post.link || '').toLowerCase();
  if (title.includes('popsugar') || title.includes('feel-good award') || link.includes('popsugar.com')) {
    return 0;
  }
  if (
    title.includes('peptide behind') ||
    link.includes('usatoday.com') ||
    link.includes('non-needle-firming')
  ) {
    return 1;
  }
  return -1;
}

function isOkoaCollectionPost(post: BlogPost) {
  // Never hijack pinned press articles into the OKOA hub
  if (topPinRank(post) >= 0) return false;
  const link = (post.link || '').toLowerCase();
  if (link.includes('okoaskin.com')) return true;
  const title = (post.title || '').toLowerCase();
  return title.includes('okoa skin articles') || title === 'okoaskin';
}

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const isOkoa = isOkoaCollectionPost(post);
  const wordCount = post.content ? post.content.split(/\s+/).length : 200;
  const readMinutes = Math.max(2, Math.ceil(wordCount / 220));
  const resolved = isOkoa
    ? { href: OKOA_HUB_PATH, isExternal: false }
    : resolvePostLink(post.link);
  const { href, isExternal } = resolved;
  const ctaLabel = isOkoa
    ? `View ${okoaArticleCount} articles`
    : post.buttonText || 'Read article';
  const cardClassName =
    'group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/15 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-plum/35 hover:bg-white hover:shadow-xl';

  const cardBody = (
    <>
      <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-orchid/20">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/process-bottles.jpg';
          }}
        />
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum shadow-md backdrop-blur-md">
            {post.category}
          </span>
          {isOkoa && (
            <span className="rounded-full bg-plum px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-md">
              {okoaArticleCount} links
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-deep-blue">
            <span>
              {new Date(post.date).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>{isOkoa ? `${okoaArticleCount} articles` : `${readMinutes} min read`}</span>
          </div>

          <h2 className="mt-3 font-heading text-2xl font-semibold leading-snug text-plum transition duration-300 group-hover:text-deep-blue">
            {post.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-dark-plum/75 line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-plum/10 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum transition-all duration-300 group-hover:gap-2.5 group-hover:text-deep-blue">
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-dark-plum/50">
            {isOkoa ? 'OKOA Skin' : 'Rare Aesthetics'}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <article className="h-full">
        {isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cardClassName}>
            {cardBody}
          </a>
        ) : (
          <Link to={href} className={cardClassName}>
            {cardBody}
          </Link>
        )}
      </article>
    </Reveal>
  );
}

export function Articles() {
  const slides = usePageHeader('articles', articleSlides);
  const { posts } = useContent();
  const published = posts.filter((p) => p.published && (p.type === 'article' || !p.type));

  const topPinned = published
    .filter((p) => topPinRank(p) >= 0)
    .sort((a, b) => topPinRank(a) - topPinRank(b));
  const rest = published.filter((p) => topPinRank(p) < 0);

  return (
    <>
      <Seo
        title="Articles & Editorial Notes | My Rare Aesthetics"
        description="Explore research notes, cosmetic chemistry analysis, and formulation insights from My Rare Aesthetics."
        keywords={pageSeo.blog.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
        ]}
      />
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
          {/* 1–2: PopSugar + USA Today peptide — always on top */}
          {topPinned.map((post, i) => (
            <ArticleCard key={post.id} post={post} index={i} />
          ))}

          {/* OKOA collection after the two press features */}
          <Reveal>
            <article className="h-full md:col-span-2">
              <Link
                to={OKOA_HUB_PATH}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-plum/15 bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-plum/35 hover:bg-white hover:shadow-xl md:flex-row"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(145deg,#2b1a33_0%,#5a3a68_55%,#8d6b9a_100%)] md:aspect-auto md:w-[42%]">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%)',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-start justify-between p-6 sm:p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/95 shadow-md">
                      <img
                        src={OKOA_LOGO_URL}
                        alt="OKOA Skin"
                        className="h-9 w-9 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                        Partner collection
                      </p>
                      <p className="mt-1 font-heading text-4xl font-medium text-white">
                        {okoaArticleCount}
                      </p>
                      <p className="text-sm text-white/70">articles inside</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <span className="rounded-full bg-orchid/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum">
                      OKOA Skin
                    </span>
                    <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-plum transition duration-300 group-hover:text-deep-blue sm:text-3xl">
                      OKOA Skin Articles
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-dark-plum/75 sm:text-base">
                      Open the full OKOA editorial library — firming guides, ingredient explainers,
                      and brand comparisons. Pick a card to read on okoaskin.com.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-plum/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum transition-all duration-300 group-hover:gap-2.5 group-hover:text-deep-blue">
                      View {okoaArticleCount} articles <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-dark-plum/50">
                      Rare Aesthetics × OKOA
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </Reveal>

          {/* OKOASkin Reddit collection */}
          <Reveal>
            <article className="h-full md:col-span-2">
              <Link
                to={OKOA_REDDIT_HUB_PATH}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#ff4500]/20 bg-white/85 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4500]/40 hover:bg-white hover:shadow-xl md:flex-row"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(145deg,#3d1f14_0%,#8a3a22_50%,#ff4500_100%)] md:aspect-auto md:w-[42%]">
                  <div
                    className="absolute inset-0 opacity-35"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.4), transparent 45%)',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-start justify-between p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/95 shadow-md">
                        <img
                          src={OKOA_REDDIT_LOGO_URL}
                          alt="Reddit"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/95 shadow-md">
                        <img
                          src={OKOA_LOGO_URL}
                          alt="OKOA Skin"
                          className="h-9 w-9 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                        Community posts
                      </p>
                      <p className="mt-1 font-heading text-4xl font-medium text-white">
                        {okoaRedditPostCount}
                      </p>
                      <p className="text-sm text-white/75">featured on Reddit</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <span className="rounded-full bg-[#ff4500]/12 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff4500]">
                      r/OKOASkin
                    </span>
                    <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-plum transition duration-300 group-hover:text-deep-blue sm:text-3xl">
                      OKOASkin on Reddit
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-dark-plum/75 sm:text-base">
                      Dark spots, neck lines, menopause skin, and 40+ routine mistakes — featured
                      posts from the OKOASkin community. Open the hub, then read all on Reddit.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-plum/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum transition-all duration-300 group-hover:gap-2.5 group-hover:text-deep-blue">
                      View {okoaRedditPostCount} posts <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-dark-plum/50">
                      reddit.com/r/OKOASkin
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </Reveal>

          {rest.map((post, i) => (
            <ArticleCard key={post.id} post={post} index={i + 2} />
          ))}
        </div>
      </Section>
    </>
  );
}
