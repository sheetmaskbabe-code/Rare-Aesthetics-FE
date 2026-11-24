import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { AdminFileUpload } from './AdminFileUpload';
import {
  Check,
  Save,
  Sparkles,
  Layers,
  FileText,
  MessageSquareQuote,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';

export type HeroSlide = {
  title: string;
  description: string;
  media: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
  rating?: number;
};

export type HomePageData = {
  heroSlides: HeroSlide[];
  heroCtaPrimaryText: string;
  heroCtaPrimaryLink: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryLink: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutImage: string;

  featureEyebrow: string;
  featureTitle: string;
  featureDescription: string;
  featureButtonText: string;
  featureButtonLink: string;
  featureImage: string;

  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonialsPlaceholder: string;
  testimonials: TestimonialItem[];
};

const defaultHomeData: HomePageData = {
  heroSlides: [
    {
      title: 'Ethereal Formulations',
      description:
        'Transforming innovative cosmetic ideas into thoughtfully developed beauty products through formulation and research.',
      media: '',
    },
    {
      title: 'Rose Mirage',
      description:
        'Where science meets the art of beauty — clinical cosmetic chemistry tailored for discerning founders and brands.',
      media: '',
    },
    {
      title: 'Velvet Mystique',
      description:
        'Sensory-rich textures engineered with high-potency bio-compatible actives and premium sensory elegance.',
      media: '',
    },
    {
      title: 'Signature Sheet Masks',
      description:
        'Targeted skincare innovation and thoughtfully developed sheet mask treatments crafted for discerning beauty founders.',
      media: '',
    },
  ],
  heroCtaPrimaryText: 'Explore Our Services',
  heroCtaPrimaryLink: '/services',
  heroCtaSecondaryText: 'Book a Consultation',
  heroCtaSecondaryLink: '/book',
  aboutEyebrow: 'ABOUT US',
  aboutTitle: 'Discover the Science Behind Beautiful Products.',
  aboutDescription:
    'My Rare Aesthetics supports beauty entrepreneurs and established brands through cosmetic product development and consulting — with a focus on thoughtful formulation, research and manufacturing support.',
  aboutParagraph1:
    'Based in Pretoria, South Africa, we partner with founders and brands who want to move from idea to a carefully developed cosmetic product with clarity and care.',
  aboutParagraph2:
    'Founded by Lindi-Grace, My Rare Aesthetics brings a premium, science-led approach to product development — without losing the artistry that makes beauty brands distinctive.',
  aboutImage: '/images/director.jpg',
  featureEyebrow: 'Product Development',
  featureTitle: 'From a spark of an idea to a finished cosmetic product.',
  featureDescription:
    'We guide beauty innovators through research, formulation, evaluation and production coordination — helping transform concepts into products that feel intentional, premium and ready for the next stage of their journey.',
  featureButtonText: 'Explore our process',
  featureButtonLink: '/process',
  featureImage: '/images/mra-sheetmasks.jpg',
  testimonialsEyebrow: 'TESTIMONIALS',
  testimonialsTitle: 'Client voices',
  testimonialsDescription: 'Genuine testimonials will be featured here once approved by the business.',
  testimonialsPlaceholder: '“Testimonials placeholder — publish only client-approved quotes.”',
  testimonials: [
    {
      quote: 'My Rare Aesthetics brought clinical precision and distinctive luxury together seamlessly for our product line.',
      author: 'Founder & Formulator',
      role: 'Pretoria Beauty Brand',
      rating: 5,
    },
  ],
};

export function AdminHomeTab() {
  const [data, setData] = useState<HomePageData>(defaultHomeData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/home'));
      if (res.ok) {
        const json = await res.json();
        if (json.home) {
          setData({
            ...defaultHomeData,
            ...json.home,
            heroSlides: json.home.heroSlides?.length ? json.home.heroSlides : defaultHomeData.heroSlides,
            testimonials: json.home.testimonials !== undefined ? json.home.testimonials : defaultHomeData.testimonials,
          });
        }
      }
    } catch (err) {
      console.warn('Could not load home content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const handleSlideChange = (index: number, field: keyof HeroSlide, val: string) => {
    setData((prev) => {
      const slides = [...prev.heroSlides];
      slides[index] = { ...slides[index], [field]: val };
      return { ...prev, heroSlides: slides };
    });
  };

  const handleAddTestimonial = () => {
    setData((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          quote: '',
          author: '',
          role: '',
          rating: 5,
        },
      ],
    }));
  };

  const handleUpdateTestimonial = (index: number, field: keyof TestimonialItem, value: any) => {
    setData((prev) => {
      const updated = [...prev.testimonials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testimonials: updated };
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = sessionStorage.getItem('mra_admin_token');
      const res = await fetch(apiUrl('/api/home'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setToast('Home page content saved to MongoDB successfully!');
        setTimeout(() => setToast(''), 4000);
      } else {
        throw new Error('Failed to save home content');
      }
    } catch (err) {
      console.error('Home save error:', err);
      alert('Could not save home page. Ensure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs">
          <div>
            <h2 className="font-heading text-xl text-plum">Home Page Content Editor</h2>
            <p className="mt-0.5 text-xs text-dark-plum/60">
              Customize the interactive hero showcase, headline texts, about section, and feature banners live in MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {toast && (
              <div className="flex items-center gap-1.5 rounded bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                <Check className="h-3.5 w-3.5" />
                <span>{toast}</span>
              </div>
            )}
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes to Home Page'}</span>
            </Button>
          </div>
        </div>

        {/* 1. HERO SLIDES SHOWCASE */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-6">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <Layers className="h-5 w-5 text-plum" />
              <span>Interactive Hero Slides (Shader Showcase)</span>
            </h3>
            <p className="text-xs text-dark-plum/60 mt-0.5">
              Edit the title, description, and background image for each of the 4 slides displayed in the WebGL hero.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.heroSlides.map((slide, i) => (
              <div key={i} className="rounded border border-plum/15 bg-lavender/20 p-4 space-y-3">
                <span className="inline-block rounded bg-plum px-2 py-0.5 text-[10px] font-bold text-lavender uppercase tracking-wider">
                  Slide {i + 1}
                </span>

                <div>
                  <label className="block text-xs font-semibold text-dark-plum/70">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleSlideChange(i, 'title', e.target.value)}
                    className="mt-1 w-full rounded border border-plum/20 bg-white px-3 py-1.5 text-xs text-dark-plum focus:border-plum focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-plum/70">Slide Description</label>
                  <textarea
                    rows={2}
                    value={slide.description}
                    onChange={(e) => handleSlideChange(i, 'description', e.target.value)}
                    className="mt-1 w-full rounded border border-plum/20 bg-white px-3 py-1.5 text-xs text-dark-plum focus:border-plum focus:outline-none"
                  />
                </div>

                <AdminFileUpload
                  folder="media"
                  currentUrl={slide.media}
                  label={`Slide ${i + 1} Background Image`}
                  onUploadSuccess={(url) => handleSlideChange(i, 'media', url)}
                  onRemove={() => handleSlideChange(i, 'media', '')}
                />
              </div>
            ))}
          </div>

          {/* Hero CTA Buttons */}
          <div className="border-t border-plum/10 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum mb-3">Hero Call To Action Buttons</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Primary Button Label</label>
                <input
                  type="text"
                  value={data.heroCtaPrimaryText}
                  onChange={(e) => setData({ ...data, heroCtaPrimaryText: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Primary Button Link</label>
                <input
                  type="text"
                  value={data.heroCtaPrimaryLink}
                  onChange={(e) => setData({ ...data, heroCtaPrimaryLink: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Secondary Button Label</label>
                <input
                  type="text"
                  value={data.heroCtaSecondaryText}
                  onChange={(e) => setData({ ...data, heroCtaSecondaryText: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Secondary Button Link</label>
                <input
                  type="text"
                  value={data.heroCtaSecondaryLink}
                  onChange={(e) => setData({ ...data, heroCtaSecondaryLink: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. ABOUT US SECTION ON HOME */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <FileText className="h-5 w-5 text-plum" />
              <span>About Us Section (Homepage)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Section Eyebrow</label>
              <input
                type="text"
                value={data.aboutEyebrow}
                onChange={(e) => setData({ ...data, aboutEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Main Headline</label>
              <input
                type="text"
                value={data.aboutTitle}
                onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Sub-headline / Intro</label>
            <textarea
              rows={2}
              value={data.aboutDescription}
              onChange={(e) => setData({ ...data, aboutDescription: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Paragraph 1</label>
              <textarea
                rows={3}
                value={data.aboutParagraph1}
                onChange={(e) => setData({ ...data, aboutParagraph1: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Paragraph 2</label>
              <textarea
                rows={3}
                value={data.aboutParagraph2}
                onChange={(e) => setData({ ...data, aboutParagraph2: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-dark-plum/70">Quick Presets:</span>
            <button
              type="button"
              onClick={() => setData({ ...data, aboutImage: '/images/director.jpg' })}
              className="rounded bg-plum px-3 py-1 text-xs text-lavender font-medium hover:bg-plum/90"
            >
              👩‍🔬 Use Director / Doctor Photo (/images/director.jpg)
            </button>
            <button
              type="button"
              onClick={() => setData({ ...data, aboutImage: '/images/custom-bottles.jpg' })}
              className="rounded border border-plum/30 bg-white px-3 py-1 text-xs text-plum font-medium hover:bg-plum/10"
            >
              🧴 Use Bottles Photo (/images/custom-bottles.jpg)
            </button>
          </div>

          <AdminFileUpload
            folder="media"
            currentUrl={data.aboutImage}
            label="About Section Featured Image"
            onUploadSuccess={(url) => setData({ ...data, aboutImage: url })}
            onRemove={() => setData({ ...data, aboutImage: '' })}
          />
        </div>

        {/* 3. PRODUCT DEVELOPMENT FEATURE HIGHLIGHT */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <Sparkles className="h-5 w-5 text-plum" />
              <span>Product Development Feature Spotlight</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Feature Eyebrow</label>
              <input
                type="text"
                value={data.featureEyebrow}
                onChange={(e) => setData({ ...data, featureEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Feature Headline</label>
              <input
                type="text"
                value={data.featureTitle}
                onChange={(e) => setData({ ...data, featureTitle: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Feature Description</label>
            <textarea
              rows={3}
              value={data.featureDescription}
              onChange={(e) => setData({ ...data, featureDescription: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Button Label</label>
              <input
                type="text"
                value={data.featureButtonText}
                onChange={(e) => setData({ ...data, featureButtonText: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Button Target URL</label>
              <input
                type="text"
                value={data.featureButtonLink}
                onChange={(e) => setData({ ...data, featureButtonLink: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <AdminFileUpload
            folder="media"
            currentUrl={data.featureImage}
            label="Feature Spotlight Image"
            onUploadSuccess={(url) => setData({ ...data, featureImage: url })}
            onRemove={() => setData({ ...data, featureImage: '' })}
          />
        </div>

        {/* 4. CLIENT VOICES & TESTIMONIALS */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-plum/10 pb-3">
            <div>
              <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
                <MessageSquareQuote className="h-5 w-5 text-plum" />
                <span>4. Client Voices & Testimonials</span>
              </h3>
              <p className="mt-0.5 text-xs text-dark-plum/60">
                Customize the client testimonials section, approved quotes, client names, and review ratings live on the homepage.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleAddTestimonial}
              variant="outline"
              className="gap-1.5 px-3 py-1.5 text-xs font-semibold border-plum/30 text-plum hover:bg-plum/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Client Testimonial</span>
            </Button>
          </div>

          {/* Section Titles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Section Eyebrow</label>
              <input
                type="text"
                value={data.testimonialsEyebrow}
                onChange={(e) => setData({ ...data, testimonialsEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Section Title</label>
              <input
                type="text"
                value={data.testimonialsTitle}
                onChange={(e) => setData({ ...data, testimonialsTitle: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Section Subtitle / Description</label>
            <input
              type="text"
              value={data.testimonialsDescription}
              onChange={(e) => setData({ ...data, testimonialsDescription: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">
              Placeholder Quote (displayed when no client reviews are added)
            </label>
            <input
              type="text"
              value={data.testimonialsPlaceholder}
              onChange={(e) => setData({ ...data, testimonialsPlaceholder: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Testimonials List */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-plum">
              Client Approved Quotes ({data.testimonials?.length || 0})
            </h4>

            {data.testimonials && data.testimonials.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {data.testimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative rounded border border-plum/20 bg-lavender/25 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded bg-plum px-2 py-0.5 text-[10px] font-bold text-lavender uppercase tracking-wider">
                        Quote #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-plum/70">Client Quote / Review *</label>
                      <textarea
                        rows={3}
                        required
                        value={item.quote}
                        onChange={(e) => handleUpdateTestimonial(idx, 'quote', e.target.value)}
                        placeholder="e.g. My Rare Aesthetics brought clinical precision and luxury aesthetics together seamlessly..."
                        className="mt-1 w-full rounded border border-plum/20 bg-white px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none italic"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-dark-plum/70">Client / Founder Name *</label>
                        <input
                          type="text"
                          required
                          value={item.author}
                          onChange={(e) => handleUpdateTestimonial(idx, 'author', e.target.value)}
                          placeholder="e.g. Amara Vance"
                          className="mt-1 w-full rounded border border-plum/20 bg-white px-2.5 py-1.5 text-xs text-dark-plum focus:border-plum focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-plum/70">Brand / Role / City</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => handleUpdateTestimonial(idx, 'role', e.target.value)}
                          placeholder="e.g. Founder, Lumina Botanicals"
                          className="mt-1 w-full rounded border border-plum/20 bg-white px-2.5 py-1.5 text-xs text-dark-plum focus:border-plum focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-plum/70">Star Rating</label>
                      <select
                        value={item.rating || 5}
                        onChange={(e) => handleUpdateTestimonial(idx, 'rating', Number(e.target.value))}
                        className="mt-1 w-32 rounded border border-plum/20 bg-white px-2.5 py-1.5 text-xs text-dark-plum focus:border-plum focus:outline-none"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-plum/30 bg-lavender/20 p-6 text-center text-xs text-dark-plum/60">
                <p>No client quotes added yet. The homepage will display the approved placeholder until testimonials are added.</p>
                <Button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="mt-3 gap-1.5 px-3 py-1.5 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add First Client Testimonial</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All Home Page Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
