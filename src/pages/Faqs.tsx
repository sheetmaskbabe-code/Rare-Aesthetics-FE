import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Accordion } from '@/components/ui/Accordion';
import { FinalCta } from '@/components/FinalCta';
import { faqs } from '@/data/faq';
import { pageSeo } from '@/data/seo';

export function Faqs() {
  return (
    <>
      <Seo
        title={pageSeo.faq.title}
        description={pageSeo.faq.description}
        keywords={pageSeo.faq.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Some answers are marked as placeholders pending client confirmation."
      />
      <Section>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <Accordion items={faqs} />
          </div>
        </Reveal>
      </Section>
      <FinalCta />
    </>
  );
}
