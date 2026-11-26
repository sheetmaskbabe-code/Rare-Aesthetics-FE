import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import {
  OKOA_LOGO_URL,
  okoaArticleCount,
  okoaArticles,
  okoaCategories,
} from '@/data/okoaArticles';

export function OkoaArticles() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return okoaArticles.filter((article) => {
      const matchCategory = activeCategory === 'All' || article.category === activeCategory;
      const matchQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <>
      <Seo
        title="OKOA Skin Articles | My Rare Aesthetics"
        description={`Browse ${okoaArticleCount} OKOA Skin editorial guides on firming, ingredients, comparisons, and anti-aging care.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
          { name: 'OKOA Skin', path: '/articles/okoaskin' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-plum/10 bg-[linear-gradient(160deg,#f7f1f8_0%,#efe6f4_42%,#f4f7fb_100%)]">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orchid/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-deep-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-plum/70 transition hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-plum/15 bg-white shadow-sm">
                  {!logoFailed ? (
                    <img
                      src={OKOA_LOGO_URL}
                      alt="OKOA Skin"
                      className="h-10 w-10 object-contain"
                      onError={() => setLogoFailed(true)}
                    />
                  ) : (
                    <span className="font-heading text-lg font-semibold tracking-wide text-plum">
                      OK
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-deep-blue">
                  Partner Editorial
                </p>
              </div>

              <h1 className="font-heading text-4xl font-medium leading-tight text-plum sm:text-5xl">
                OKOA Skin Articles
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-dark-plum/75 sm:text-lg">
                Curated guides on firming, ingredients, and comparisons — each card opens the full
                OKOA Skin article.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-plum/15 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-blue">
                Collection
              </p>
              <p className="mt-1 font-heading text-4xl font-medium text-plum">
                {okoaArticleCount}
              </p>
              <p className="text-sm text-dark-plum/65">articles available</p>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-lavender/20">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {okoaCategories.map((category) => {
              const count =
                category === 'All'
                  ? okoaArticleCount
                  : okoaArticles.filter((a) => a.category === category).length;
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
                    active
                      ? 'bg-plum text-white shadow-sm shadow-plum/20'
                      : 'border border-plum/15 bg-white/80 text-plum hover:border-plum/35 hover:bg-white'
                  }`}
                >
                  {category}
                  <span className={`ml-1.5 ${active ? 'text-white/70' : 'text-dark-plum/45'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative block w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-plum/45" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-plum/15 bg-white/90 py-2.5 pr-4 pl-10 text-sm text-plum outline-none transition focus:border-plum/40"
            />
          </label>
        </div>

        <p className="mb-6 text-sm text-dark-plum/60">
          Showing <span className="font-semibold text-plum">{filtered.length}</span> of{' '}
          {okoaArticleCount} articles
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article, i) => (
            <Reveal key={article.id} delay={(i % 6) * 0.04}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/12 bg-white/85 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-plum/30 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-plum/10 bg-[#f8f4f9]">
                    {!logoFailed ? (
                      <img
                        src={OKOA_LOGO_URL}
                        alt=""
                        className="h-7 w-7 object-contain"
                        onError={() => setLogoFailed(true)}
                      />
                    ) : (
                      <span className="text-[10px] font-bold tracking-wider text-plum">OKOA</span>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-plum/35 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-deep-blue" />
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-deep-blue">
                  {article.category}
                </p>
                <h2 className="mt-2 font-heading text-xl font-medium leading-snug text-plum transition group-hover:text-deep-blue">
                  {article.title}
                </h2>
                <p className="mt-auto pt-5 text-sm font-semibold text-plum/80 transition group-hover:text-deep-blue">
                  Open article
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-plum/20 bg-white/60 px-6 py-16 text-center">
            <p className="font-heading text-2xl text-plum">No articles match your search</p>
            <p className="mt-2 text-sm text-dark-plum/65">Try another category or keyword.</p>
          </div>
        )}
      </Section>
    </>
  );
}
