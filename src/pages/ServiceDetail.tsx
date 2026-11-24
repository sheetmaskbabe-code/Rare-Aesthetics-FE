import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { ServiceIcon } from '@/components/ServiceIcon';
import { services as defaultServices } from '@/data/services';
import { servicePageSeo } from '@/data/seo';
import { apiUrl } from '@/lib/api';

export function ServiceDetail() {
  const { id } = useParams();
  const [serviceList, setServiceList] = useState<any[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/api/services-content'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content?.services && data.content.services.length > 0) {
          setServiceList(data.content.services);
        }
      })
      .catch((err) => console.warn('[ServiceDetail] Fallback to default:', err))
      .finally(() => setLoading(false));
  }, []);

  const service = serviceList.find((s) => s.id === id);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-plum" />
      </div>
    );
  }

  if (!service) return <Navigate to="/services" replace />;

  const benefitsList = Array.isArray(service.benefits) ? service.benefits : [];
  const seo = servicePageSeo(service);

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image={typeof service.image === 'string' ? service.image : undefined}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.id}` },
        ]}
      />

      <div className="bg-hero-mesh border-b border-plum/10">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 md:pb-20 md:pt-40">
          <Reveal>
            <Link
              to="/services"
              className="mb-8 inline-flex items-center gap-2 text-sm text-deep-blue hover:text-plum"
            >
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orchid/50 text-plum">
                <ServiceIcon name={service.icon} className="h-7 w-7" />
              </span>
              <div>
                <h1 className="font-heading text-4xl font-medium text-plum md:text-5xl">
                  {service.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg text-dark-plum/70">{service.short}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="mb-8 aspect-[16/9] overflow-hidden bg-orchid/20">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-heading text-2xl text-plum md:text-3xl">About this service</h2>
            <p className="mt-5 text-base leading-relaxed text-dark-plum/75 md:text-lg">
              {service.description || service.short}
            </p>
            {benefitsList.length > 0 && (
              <>
                <h3 className="mt-10 font-heading text-xl text-plum">Benefits</h3>
                <ul className="mt-5 space-y-3">
                  {benefitsList.map((b: string, i: number) => (
                    <li key={i} className="flex gap-3 text-dark-plum/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-deep-blue" />
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border border-plum/15 bg-orchid/25 p-8">
              <h3 className="font-heading text-2xl text-plum">Enquire about this service</h3>
              <p className="mt-3 text-sm text-dark-plum/70">
                Tell us about your project and we will follow up to explore fit, timing and next
                steps.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button to={`/contact?service=${encodeURIComponent(service.title)}`}>
                  Enquire About This Service
                </Button>
                <Button to="/book" variant="outline">
                  Book a Consultation
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
