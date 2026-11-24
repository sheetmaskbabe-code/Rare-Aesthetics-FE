import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { FinalCta } from '@/components/FinalCta';
import { pageSeo } from '@/data/seo';

const pillars = [
  {
    title: 'Integrated product development support',
    text: 'From concept conversations through formulation and production coordination, support is connected rather than fragmented.',
  },
  {
    title: 'Research-driven approach',
    text: 'Market, ingredient and technology research inform decisions so products are shaped by insight as well as creativity.',
  },
  {
    title: 'Cosmetic formulation expertise',
    text: 'Formulation support focuses on sensory experience, performance goals and pathways toward manufacturable products.',
  },
  {
    title: 'Brand development support',
    text: 'Strategy and identity positioning help ensure the product story and brand presence feel coherent and premium.',
  },
  {
    title: 'Project coordination',
    text: 'Clear milestones, sourcing conversations and timeline visibility keep complex beauty projects organised.',
  },
  {
    title: 'Quality-focused processes',
    text: 'Quality management remains central across development stages — emphasising consistency, care and documentation.',
  },
];

export function WhyChooseUs() {
  return (
    <>
      <Seo
        title={pageSeo.whyChooseUs.title}
        description={pageSeo.whyChooseUs.description}
        keywords={pageSeo.whyChooseUs.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Why Choose Us', path: '/why-choose-us' },
        ]}
      />
      <PageHero
        eyebrow="Why Choose Us"
        title="A refined partner for beauty product innovation"
        description="We do not invent certifications or statistics. Our promise is a thoughtful, quality-focused approach to cosmetic development."
      />

      <Section>
        <Reveal>
          <SectionHeading
            title="How we work with brands"
            description="Sophisticated support for entrepreneurs and established beauty houses who value clarity, research and elegant execution."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.06}>
              <article className="h-full border border-plum/10 bg-white/50 p-8">
                <span className="font-heading text-sm text-orchid">0{i + 1}</span>
                <h2 className="mt-3 font-heading text-2xl text-plum">{p.title}</h2>
                <p className="mt-4 text-dark-plum/70 leading-relaxed">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
