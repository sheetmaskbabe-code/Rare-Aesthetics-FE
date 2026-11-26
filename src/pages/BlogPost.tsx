import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { CORE_KEYWORDS, SITE_URL } from '@/data/seo';
import { useContent } from '@/context/ContentContext';

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-plum">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderContent(rawContent: string) {
  const blocks = rawContent.trim().split(/\n\s*\n/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/gm, '');
      return (
        <blockquote
          key={idx}
          className="my-8 rounded-r-xl border-l-4 border-plum bg-orchid/15 p-6 font-heading text-lg sm:text-xl italic text-plum shadow-xs"
        >
          {renderInlineFormatting(quoteText)}
        </blockquote>
      );
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="mt-8 mb-4 font-heading text-3xl font-medium text-plum sm:text-4xl">
          {trimmed.replace(/^#\s+/, '')}
        </h1>
      );
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={idx}
          className="mt-10 mb-4 border-b border-plum/10 pb-3 font-heading text-2xl font-medium text-plum sm:text-3xl"
        >
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="mt-6 mb-2 font-heading text-xl font-medium text-deep-blue sm:text-2xl">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    }

    // Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed
        .split('\n')
        .map((l) => l.trim())
        .filter((line) => line.startsWith('- ') || line.startsWith('* '));
      return (
        <ul key={idx} className="my-6 space-y-3 pl-2">
          {items.map((item, itemIdx) => {
            const cleanItem = item.replace(/^[-*]\s+/, '');
            return (
              <li key={itemIdx} className="flex items-start gap-3 text-base leading-relaxed text-dark-plum/85 md:text-lg">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-deep-blue" />
                <span>{renderInlineFormatting(cleanItem)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Standalone bold service/feature paragraph: **Title**\nContent
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines[0].startsWith('**') && lines[0].endsWith('**')) {
      return (
        <div key={idx} className="my-5 rounded-xl border border-plum/10 bg-lavender/30 p-5 shadow-xs">
          <h4 className="font-heading text-lg font-semibold text-plum">
            {lines[0].slice(2, -2)}
          </h4>
          <p className="mt-2 text-base leading-relaxed text-dark-plum/80">
            {renderInlineFormatting(lines.slice(1).join(' '))}
          </p>
        </div>
      );
    }

    // Standard paragraph
    return (
      <p key={idx} className="text-base leading-relaxed text-dark-plum/85 md:text-lg">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });
}

export function BlogPost() {
  const { slug } = useParams();
  const { posts } = useContent();
  const post = posts.find((p) => p.slug === slug && p.published);

  if (!post) return <Navigate to="/articles" replace />;

  const wordCount = post.content ? post.content.split(/\s+/).length : 200;
  const readMinutes = Math.max(2, Math.ceil(wordCount / 220));

  return (
    <>
      <Seo
        title={`${post.title} | My Rare Aesthetics`}
        description={post.excerpt}
        image={post.image}
        type="article"
        publishedTime={post.date}
        keywords={[post.title, 'cosmetic formulation blog', 'beauty insights', ...CORE_KEYWORDS]}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
          { name: post.title, path: `/articles/${post.slug}` },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          author: {
            '@type': 'Person',
            name: 'Lindi-Grace',
          },
          publisher: {
            '@type': 'Organization',
            name: 'My Rare Aesthetics',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/logo.png`,
            },
          },
        }}
      />
      <article className="min-h-screen bg-atmosphere pb-16">
        {/* Header Hero */}
        <div className="bg-hero-mesh border-b border-plum/10">
          <div className="mx-auto max-w-4xl px-5 pb-12 pt-32 sm:px-8 md:pt-40">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm font-medium text-deep-blue transition hover:text-plum"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>

            <Reveal>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-deep-blue font-medium">
                <span className="rounded-full bg-white/90 px-3 py-1 text-plum shadow-xs">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-dark-plum/70">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-dark-plum/40">•</span>
                <span className="flex items-center gap-1.5 text-dark-plum/70">
                  <Clock className="h-3.5 w-3.5" />
                  {readMinutes} min read
                </span>
              </div>

              <h1 className="mt-5 font-heading text-3xl font-medium leading-tight text-plum sm:text-4xl md:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-4 text-lg text-dark-plum/75 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </Reveal>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mx-auto max-w-4xl px-5 pt-8 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-plum/15 shadow-md">
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[21/10] w-full object-cover"
            />
          </div>
        </div>

        {/* Article Body inside a dedicated Reading Box */}
        <Section className="pt-8">
          <Reveal>
            <div className="mx-auto max-w-4xl rounded-2xl border border-plum/15 bg-white/85 p-6 shadow-sm backdrop-blur-sm sm:p-10 md:p-14">
              <div className="space-y-5">
                {renderContent(post.content)}
              </div>

              {/* Consultation / Next Steps Box inside the article */}
              <div className="mt-14 rounded-xl border border-plum/15 bg-lavender/40 p-8 text-center sm:p-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum text-lavender mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-2xl font-medium text-plum">
                  Ready to Turn Your Beauty Vision into Reality?
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-dark-plum/75">
                  Partner with Rare Aesthetics for science-backed cosmetic formulation, ingredient research, and market-ready beauty innovation.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Button to="/book-consultation" variant="primary">
                    Book a Consultation
                  </Button>
                  <Button to="/articles" variant="ghost">
                    Explore More Articles <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </article>
    </>
  );
}
