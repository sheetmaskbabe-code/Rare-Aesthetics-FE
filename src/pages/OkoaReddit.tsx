import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import {
  OKOA_BRAND_LOGO_URL,
  OKOA_REDDIT_HUB_PATH,
  OKOA_REDDIT_LOGO_URL,
  OKOA_REDDIT_SUBREDDIT_URL,
  okoaRedditPostCount,
  okoaRedditPosts,
} from '@/data/okoaReddit';

export function OkoaReddit() {
  return (
    <>
      <Seo
        title="OKOASkin on Reddit | My Rare Aesthetics"
        description={`Read ${okoaRedditPostCount} featured posts from r/OKOASkin — formulation notes, menopause skin, and dark spot science.`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
          { name: 'OKOASkin Reddit', path: OKOA_REDDIT_HUB_PATH },
        ]}
      />

      <section className="relative overflow-hidden border-b border-plum/10 bg-[linear-gradient(155deg,#fff7f2_0%,#f3ebe8_45%,#f6f3f8_100%)]">
        <div className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#ff4500]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-plum/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-plum/70 transition hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-plum/15 bg-white shadow-sm">
                  <img
                    src={OKOA_BRAND_LOGO_URL}
                    alt="OKOA Skin"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#ff4500]/20 bg-white shadow-sm">
                  <img src={OKOA_REDDIT_LOGO_URL} alt="Reddit" className="h-8 w-8 object-contain" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-deep-blue">
                  r/OKOASkin
                </p>
              </div>

              <h1 className="font-heading text-4xl font-medium leading-tight text-plum sm:text-5xl">
                OKOASkin on Reddit
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-dark-plum/75 sm:text-lg">
                Featured community posts from the formulators behind OKOA — open any card to read on
                Reddit, or browse the full subreddit.
              </p>
            </div>

            <a
              href={OKOA_REDDIT_SUBREDDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-4 rounded-2xl border border-[#ff4500]/25 bg-white/90 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#ff4500]/50 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff4500]/10">
                <img src={OKOA_REDDIT_LOGO_URL} alt="" className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff4500]">
                  Full community
                </p>
                <p className="font-heading text-lg font-medium text-plum group-hover:text-deep-blue">
                  reddit.com/r/OKOASkin
                </p>
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-plum/75">
                  Click to read all <ExternalLink className="h-3.5 w-3.5" />
                </p>
              </div>
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-plum/15 bg-white/80 px-4 py-2 text-sm text-dark-plum/70">
            <span className="font-heading text-xl font-medium text-plum">{okoaRedditPostCount}</span>
            featured posts
          </div>
        </div>
      </section>

      <Section className="bg-lavender/20">
        <div className="grid gap-5 md:grid-cols-2">
          {okoaRedditPosts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 4) * 0.05}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum/12 bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-plum/30 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-plum/10 bg-[#f8f4f9]">
                      <img
                        src={OKOA_BRAND_LOGO_URL}
                        alt=""
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff4500]">
                        {post.community}
                      </p>
                      <p className="text-xs text-dark-plum/55">Posted by {post.author}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-plum/35 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-deep-blue" />
                </div>

                <h2 className="mt-5 font-heading text-xl font-medium leading-snug text-plum transition group-hover:text-deep-blue sm:text-2xl">
                  {post.title}
                </h2>

                <p className="mt-auto pt-6 text-sm font-semibold text-plum/80 transition group-hover:text-deep-blue">
                  Read on Reddit
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <a
            href={OKOA_REDDIT_SUBREDDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl border border-[#ff4500]/20 bg-[linear-gradient(120deg,#fff8f5_0%,#ffffff_55%,#f7f2f8_100%)] p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#ff4500]/40 hover:shadow-md sm:flex-row sm:text-left"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff4500]/20 bg-white shadow-sm">
                <img src={OKOA_REDDIT_LOGO_URL} alt="Reddit" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff4500]">
                  r/OKOASkin
                </p>
                <h3 className="mt-1 font-heading text-2xl font-medium text-plum">
                  Read all posts on Reddit
                </h3>
                <p className="mt-1 text-sm text-dark-plum/65">
                  Open the full OKOASkin community for more formulation notes and discussions.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ff4500] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#e03d00]">
              Visit subreddit <ExternalLink className="h-4 w-4" />
            </span>
          </a>
        </Reveal>
      </Section>
    </>
  );
}
