import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { useContent } from '@/context/ContentContext';

export function PortfolioDetail() {
  const { slug } = useParams();
  const { portfolio } = useContent();
  const item = portfolio.find((p) => p.slug === slug && p.published);

  if (!item) return <Navigate to="/portfolio" replace />;

  return (
    <>
      <Seo
        title={`${item.title} | Portfolio`}
        description={item.description}
        image={item.image}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: item.title,
          description: item.description,
          image: item.image,
          creator: {
            '@type': 'Organization',
            name: 'My Rare Aesthetics',
          },
        }}
      />
      <div className="bg-hero-mesh">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-32 sm:px-8 md:pt-40">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-deep-blue">
            <ArrowLeft className="h-4 w-4" /> Portfolio
          </Link>
          <Reveal>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-deep-blue">{item.category}</p>
            <h1 className="mt-3 font-heading text-4xl text-plum md:text-5xl">{item.title}</h1>
          </Reveal>
        </div>
      </div>
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-plum/15 shadow-md">
              <img src={item.image} alt={item.title} className="w-full object-cover aspect-[4/3]" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-plum/10 bg-white/70 p-8 shadow-sm backdrop-blur-sm">
              <h2 className="font-heading text-2xl font-bold text-plum sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
                {item.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {item.link && (
                  <Button to={item.link} variant="primary">
                    Learn More
                  </Button>
                )}
                <Button to="/contact" variant="ghost">
                  Enquire About a Project
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
