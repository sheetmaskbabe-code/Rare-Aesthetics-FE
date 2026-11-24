import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Accordion } from '@/components/ui/Accordion';
import { FinalCta } from '@/components/FinalCta';
import { faqs } from '@/data/faq';

export function Faqs() {
  return (
    <>
      <Seo
        title="FAQ | My Rare Aesthetics"
        description="Answers about product development, consultations, timelines, testing, regulatory support and project costs."
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
