import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { AdminFileUpload } from './AdminFileUpload';
import { Check, Save, User, Building, Compass, Sparkles } from 'lucide-react';
import { apiUrl } from '@/lib/api';

export type AboutPageData = {
  companyEyebrow: string;
  companyTitle: string;
  companyParagraph1: string;
  companyParagraph2: string;
  companyParagraph3: string;
  companyImage: string;

  founderEyebrow: string;
  founderName: string;
  founderTitle: string;
  founderBio1: string;
  founderBio2: string;
  founderBio3: string;
  founderImage: string;
  featuredIn: string;

  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;

  philosophyEyebrow: string;
  philosophyTitle: string;
  philosophyDescription: string;
};

const defaultAboutData: AboutPageData = {
  companyEyebrow: 'The company',
  companyTitle: 'Cosmetic product development & consulting',
  companyParagraph1:
    'My Rare Aesthetics is a Pretoria-based consultancy focused on cosmetic product development, formulation, manufacturing support and brand-minded consulting.',
  companyParagraph2:
    'We partner with founders and brands who want a refined pathway from concept to product — combining research, formulation thinking, evaluation support and practical production coordination.',
  companyParagraph3:
    'Our work is rooted in luxury presentation and scientific care: clear process, quality-focused development, and respect for the artistry of beauty brands.',
  companyImage:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',

  founderEyebrow: 'Founder',
  founderName: 'Lindi-Grace',
  founderTitle: 'Cosmetic Chemist | Beauty Innovator | Founder of The RA Group',
  founderBio1:
    'Probably wearing a sheet mask, practising yoga, or experimenting with the next big skincare innovation. Passionate about the science behind beauty, I believe that great skincare is where creativity, research, and innovation come together.',
  founderBio2:
    'We partner with founders and brands across the globe, from North America, Europe, Australia, The Middle East and Africa who want to move from idea to an innovative cosmetic product with clarity and care',
  founderBio3:
    'From developing effective skincare and haircare formulations to exploring new beauty trends, every idea begins with curiosity and a commitment to excellence. My mission is to create products that inspire confidence, celebrate individuality, and make beauty more accessible.',
  founderImage: '/images/director.jpg',
  featuredIn: 'Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR',

  missionTitle: 'Mission',
  missionText:
    'To help beauty brands transform innovative ideas into thoughtfully developed cosmetic products through formulation, research, testing support and manufacturing coordination.',
  visionTitle: 'Vision',
  visionText:
    'To be a trusted partner for beauty entrepreneurs and established brands seeking premium, science-informed product development with elegance and clarity.',

  philosophyEyebrow: 'Philosophy',
  philosophyTitle: 'Our approach to cosmetic innovation',
  philosophyDescription:
    'We believe beautiful products are born where scientific rigour meets brand imagination.',
};

export function AdminAboutTab() {
  const [data, setData] = useState<AboutPageData>(defaultAboutData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/about'));
      if (res.ok) {
        const json = await res.json();
        if (json.about) {
          setData({
            ...defaultAboutData,
            ...json.about,
          });
        }
      }
    } catch (err) {
      console.warn('Could not load about content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = sessionStorage.getItem('mra_admin_token');
      const res = await fetch(apiUrl('/api/about'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setToast('About page content saved to MongoDB successfully!');
        setTimeout(() => setToast(''), 4000);
      } else {
        throw new Error('Failed to save about content');
      }
    } catch (err) {
      console.error('About save error:', err);
      alert('Could not save about page. Ensure backend is running.');
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
            <h2 className="font-heading text-xl text-plum">About Page Content Editor</h2>
            <p className="mt-0.5 text-xs text-dark-plum/60">
              Customize company story, founder biography, director photo, mission & vision statements saved in MongoDB.
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
              <span>{saving ? 'Saving...' : 'Save All About Page Changes'}</span>
            </Button>
          </div>
        </div>

        {/* 1. THE COMPANY STORY */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <Building className="h-5 w-5 text-plum" />
              <span>1. The Company Story</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Section Eyebrow</label>
              <input
                type="text"
                value={data.companyEyebrow}
                onChange={(e) => setData({ ...data, companyEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Main Headline</label>
              <input
                type="text"
                value={data.companyTitle}
                onChange={(e) => setData({ ...data, companyTitle: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Story Paragraph 1</label>
            <textarea
              rows={2}
              value={data.companyParagraph1}
              onChange={(e) => setData({ ...data, companyParagraph1: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Story Paragraph 2</label>
            <textarea
              rows={2}
              value={data.companyParagraph2}
              onChange={(e) => setData({ ...data, companyParagraph2: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Story Paragraph 3</label>
            <textarea
              rows={2}
              value={data.companyParagraph3}
              onChange={(e) => setData({ ...data, companyParagraph3: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <AdminFileUpload
            folder="general"
            currentUrl={data.companyImage}
            label="Company Atmosphere Image"
            onUploadSuccess={(url) => setData({ ...data, companyImage: url })}
            onRemove={() => setData({ ...data, companyImage: '' })}
          />
        </div>

        {/* 2. FOUNDER & DIRECTOR PROFILE */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <User className="h-5 w-5 text-plum" />
              <span>2. Founder & Director Profile</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Eyebrow</label>
              <input
                type="text"
                value={data.founderEyebrow}
                onChange={(e) => setData({ ...data, founderEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Founder Name</label>
              <input
                type="text"
                value={data.founderName}
                onChange={(e) => setData({ ...data, founderName: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Professional Title / Subtitle</label>
            <input
              type="text"
              value={data.founderTitle}
              onChange={(e) => setData({ ...data, founderTitle: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Biography Paragraph 1</label>
            <textarea
              rows={2}
              value={data.founderBio1}
              onChange={(e) => setData({ ...data, founderBio1: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Biography Paragraph 2</label>
            <textarea
              rows={2}
              value={data.founderBio2}
              onChange={(e) => setData({ ...data, founderBio2: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Biography Paragraph 3</label>
            <textarea
              rows={2}
              value={data.founderBio3}
              onChange={(e) => setData({ ...data, founderBio3: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Featured In Publications</label>
            <input
              type="text"
              value={data.featuredIn}
              onChange={(e) => setData({ ...data, featuredIn: e.target.value })}
              placeholder="e.g. Glamour | ELLE | Grazia | Cosmopolitan"
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-dark-plum/70">Quick Presets:</span>
            <button
              type="button"
              onClick={() => setData({ ...data, founderImage: '/images/director.jpg' })}
              className="rounded bg-plum px-3 py-1 text-xs text-lavender font-medium hover:bg-plum/90"
            >
              👩‍🔬 Use Director Photo (/images/director.jpg)
            </button>
          </div>

          <AdminFileUpload
            folder="general"
            currentUrl={data.founderImage}
            label="Founder / Director Photo"
            onUploadSuccess={(url) => setData({ ...data, founderImage: url })}
            onRemove={() => setData({ ...data, founderImage: '' })}
          />
        </div>

        {/* 3. MISSION & VISION */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <Compass className="h-5 w-5 text-plum" />
              <span>3. Mission & Vision</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-dark-plum/70">Mission Headline</label>
              <input
                type="text"
                value={data.missionTitle}
                onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
                className="w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none font-semibold"
              />
              <label className="block text-xs font-semibold text-dark-plum/70 pt-1">Mission Statement</label>
              <textarea
                rows={3}
                value={data.missionText}
                onChange={(e) => setData({ ...data, missionText: e.target.value })}
                className="w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-dark-plum/70">Vision Headline</label>
              <input
                type="text"
                value={data.visionTitle}
                onChange={(e) => setData({ ...data, visionTitle: e.target.value })}
                className="w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none font-semibold"
              />
              <label className="block text-xs font-semibold text-dark-plum/70 pt-1">Vision Statement</label>
              <textarea
                rows={3}
                value={data.visionText}
                onChange={(e) => setData({ ...data, visionText: e.target.value })}
                className="w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. PHILOSOPHY */}
        <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs space-y-4">
          <div className="border-b border-plum/10 pb-3">
            <h3 className="flex items-center gap-2 font-heading text-lg text-plum">
              <Sparkles className="h-5 w-5 text-plum" />
              <span>4. Philosophy</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Philosophy Eyebrow</label>
              <input
                type="text"
                value={data.philosophyEyebrow}
                onChange={(e) => setData({ ...data, philosophyEyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Philosophy Title</label>
              <input
                type="text"
                value={data.philosophyTitle}
                onChange={(e) => setData({ ...data, philosophyTitle: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-plum/70">Philosophy Description</label>
            <textarea
              rows={2}
              value={data.philosophyDescription}
              onChange={(e) => setData({ ...data, philosophyDescription: e.target.value })}
              className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All About Page Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminAboutTab;
