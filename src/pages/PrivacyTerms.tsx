import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Seo } from '@/components/ui/Seo';
import { siteConfig } from '@/data/site';
import { pageSeo } from '@/data/seo';

export function PrivacyTerms({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';

  return (
    <>
      <Seo
        title={(isPrivacy ? pageSeo.privacy : pageSeo.terms).title}
        description={(isPrivacy ? pageSeo.privacy : pageSeo.terms).description}
        keywords={(isPrivacy ? pageSeo.privacy : pageSeo.terms).keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          {
            name: isPrivacy ? 'Privacy Policy' : 'Terms',
            path: isPrivacy ? '/privacy' : '/terms',
          },
        ]}
      />
      <PageHero
        eyebrow="Legal"
        title={isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
        description="Placeholder legal copy — have counsel review and replace before launch."
      />
      <Section>
        <div className="prose-rare mx-auto max-w-3xl space-y-5 text-base">
          {isPrivacy ? (
            <>
              <p>
                {siteConfig.brand} respects your privacy. Information submitted through enquiry,
                booking or newsletter forms is used to respond to your requests and improve our
                services.
              </p>
              <p>
                We do not sell personal information. Access to enquiry data is limited to authorised
                administrators. Contact details may be retained for legitimate business follow-up.
              </p>
              <p>
                For privacy questions, email{' '}
                <a className="text-deep-blue underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p>
                By using this website you agree to these terms. Content is provided for general
                information about {siteConfig.brand} services and does not constitute a binding
                offer until confirmed in writing.
              </p>
              <p>
                Project scope, timelines and fees are agreed separately for each engagement.
                Unauthorised use of site content, branding or materials is prohibited.
              </p>
              <p>
                Questions about these terms can be sent to{' '}
                <a className="text-deep-blue underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                .
              </p>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
