import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { usePageHeader } from '@/hooks/usePageHeader';
import { apiUrl } from '@/lib/api';
import { siteConfig } from '@/data/site';
import { services } from '@/data/services';
import { pageSeo } from '@/data/seo';

const contactSlides = [
  {
    title: 'Initiate a Project',
    description:
      'Begin a confidential conversation with our cosmetic product development studio in Pretoria.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Formulation Enquiries',
    description:
      'Discuss bespoke formula development, bench prototypes, sensory targets, and ingredient compatibility.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Manufacturing Support',
    description:
      'Partner on commercial batch production, contract manufacturer liaison, and packaging component sourcing.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Regulatory & Testing',
    description:
      'Enquire about safety assessments, clinical pathways, stability testing, and compliance documentation.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Consultation',
    description:
      'Strategic beauty brand advisory, product line conceptualization, and market readiness planning.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Direct Engagement',
    description:
      'Reach our team directly for bespoke partnerships, ongoing advisory, or private formulation work.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
];

type FormState = {
  fullName: string;
  email: string;
  company: string;
  service: string;
  description: string;
  timeline: string;
  consent: boolean;
  website: string; // honeypot
};

const initial: FormState = {
  fullName: '',
  email: '',
  company: '',
  service: '',
  description: '',
  timeline: '',
  consent: false,
  website: '',
};

export function Contact() {
  const slides = usePageHeader('contact', contactSlides);
  const [params] = useSearchParams();
  const preselect = params.get('service') || '';
  const [form, setForm] = useState<FormState>({ ...initial, service: preselect });
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const serviceOptions = useMemo(() => services.map((s) => s.title), []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid email is required';
    if (!form.service) next.service = 'Please select a service';
    if (!form.description.trim() || form.description.trim().length < 20)
      next.description = 'Please share a project description (at least 20 characters)';
    if (!form.consent) next.consent = 'Privacy consent is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.website) return; // bot
    if (!validate()) return;

    setStatus('loading');

    let attachmentUrl: string | null = null;
    let attachmentPublicId: string | null = null;

    try {
      // If a file was selected, upload it to Cloudinary first
      if (selectedFile) {
        try {
          const uploadData = new FormData();
          uploadData.append('file', selectedFile);
          uploadData.append('folder', 'enquiries');

          const uploadRes = await fetch(apiUrl('/api/upload'), {
            method: 'POST',
            body: uploadData,
          });

          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            attachmentUrl = uploadJson.url || null;
            attachmentPublicId = uploadJson.publicId || null;
          }
        } catch (uploadErr) {
          console.warn('[Contact] Attachment upload skipped:', uploadErr);
        }
      }

      const res = await fetch(apiUrl('/api/enquiry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          fullName: form.fullName,
          email: form.email,
          phone: '',
          company: form.company,
          service: form.service,
          timeline: form.timeline,
          message: form.description,
          description: form.description,
          attachmentName: fileName || null,
          attachmentUrl,
          attachmentPublicId,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm(initial);
      setFileName('');
      setSelectedFile(null);
    } catch {
      // Fallback: store locally if API is offline
      try {
        const key = 'mra_enquiries';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({
          ...form,
          attachmentName: fileName || null,
          attachmentUrl,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
        setStatus('success');
        setForm(initial);
        setFileName('');
        setSelectedFile(null);
      } catch {
        setStatus('error');
      }
    }
  };

  const field = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setStatus('idle');
  };

  return (
    <>
      <Seo
        title={pageSeo.contact.title}
        description={pageSeo.contact.description}
        keywords={pageSeo.contact.keywords}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      {/* Hero — interactive Lumina WebGL shader showcase (compact / decreased size) */}
      <section className="relative h-[60svh] min-h-[460px] max-h-[600px] overflow-hidden bg-[#0a0a0a]">
        <LuminaInteractiveList
          slides={slides}
          compact
          autoSlide={false}
          showNavigation={false}
          showCounter={false}
        />
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-heading text-2xl text-plum">Studio details</h2>
            <ul className="mt-6 space-y-4 text-dark-plum/75">
              <li>
                <span className="block text-xs uppercase tracking-[0.2em] text-deep-blue">Address</span>
                <p className="text-dark-plum">{siteConfig.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-plum transition hover:text-deep-blue"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>View on Google Maps</span>
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.2em] text-deep-blue">Phone</span>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="hover:text-plum">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-[0.2em] text-deep-blue">Email</span>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-plum">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <p className="mt-8 text-sm italic text-deep-blue">
              Contact details supplied in the brief — verify before launch.
            </p>

            {/* Studio Location Map on the Left */}
            <div className="mt-8 overflow-hidden rounded-md border border-plum/15 bg-white/70 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-plum/10 bg-lavender/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-plum text-lavender shadow-xs">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-heading text-sm font-medium text-plum">Studio Location</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-plum transition hover:text-deep-blue"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="relative h-[280px] w-full sm:h-[320px]">
                <iframe
                  title="60 Willow Rd, Muckleneuk, Pretoria Location Map"
                  src="https://maps.google.com/maps?q=60%20Willow%20Rd%2C%20Muckleneuk%2C%20Pretoria%2C%200002%2C%20South%20Africa&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={onSubmit} className="space-y-5 border border-plum/10 bg-white/50 p-6 md:p-8" noValidate>
              <h2 className="font-heading text-2xl text-plum">Project enquiry</h2>

              {/* honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => field('website', e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-dark-plum/80">Full Name *</span>
                  <input
                    className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                    value={form.fullName}
                    onChange={(e) => field('fullName', e.target.value)}
                  />
                  {errors.fullName && <span className="mt-1 block text-xs text-red-700">{errors.fullName}</span>}
                </label>
                <label className="block text-sm">
                  <span className="text-dark-plum/80">Email Address *</span>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                    value={form.email}
                    onChange={(e) => field('email', e.target.value)}
                  />
                  {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email}</span>}
                </label>
              </div>

              <label className="block text-sm">
                <span className="text-dark-plum/80">Company / Brand Name</span>
                <input
                  className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                  value={form.company}
                  onChange={(e) => field('company', e.target.value)}
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-dark-plum/80">Service Interested In *</span>
                  <select
                    className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                    value={form.service}
                    onChange={(e) => field('service', e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.service && <span className="mt-1 block text-xs text-red-700">{errors.service}</span>}
                </label>
                <label className="block text-sm">
                  <span className="text-dark-plum/80">Expected Timeline</span>
                  <input
                    className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                    placeholder="e.g. 3–6 months"
                    value={form.timeline}
                    onChange={(e) => field('timeline', e.target.value)}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="text-dark-plum/80">Project Description *</span>
                <textarea
                  rows={5}
                  className="mt-2 w-full rounded-sm border border-plum/20 bg-lavender/40 px-3 py-3 focus:border-plum focus:outline-none"
                  value={form.description}
                  onChange={(e) => field('description', e.target.value)}
                />
                {errors.description && (
                  <span className="mt-1 block text-xs text-red-700">{errors.description}</span>
                )}
              </label>

              <label className="block text-sm">
                <span className="text-dark-plum/80">Optional File Attachment</span>
                <input
                  type="file"
                  className="mt-2 block w-full text-sm text-dark-plum/70 file:mr-4 file:rounded-sm file:border-0 file:bg-plum file:px-4 file:py-2 file:text-lavender"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    setFileName(file?.name || '');
                  }}
                />
                {fileName && <span className="mt-1 block text-xs text-deep-blue">Selected: {fileName}</span>}
              </label>

              <label className="flex items-start gap-3 text-sm text-dark-plum/75">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.consent}
                  onChange={(e) => field('consent', e.target.checked)}
                />
                <span>
                  I consent to My Rare Aesthetics storing my details to respond to this enquiry, in
                  line with the Privacy Policy. *
                </span>
              </label>
              {errors.consent && <span className="block text-xs text-red-700">{errors.consent}</span>}

              <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
                {status === 'loading' ? 'Sending…' : 'Submit enquiry'}
              </Button>

              {status === 'success' && (
                <p className="text-sm text-deep-blue" role="status">
                  Thank you — your enquiry has been received. We will be in touch shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-700" role="alert">
                  Something went wrong. Please email us directly at {siteConfig.email}.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
