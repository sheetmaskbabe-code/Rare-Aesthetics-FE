import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Settings, Save, Sparkles, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { apiUrl } from '@/lib/api';

export type SiteSettingsData = {
  brandName: string;
  tagline: string;
  founderName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
  announcementText: string;
  announcementActive: boolean;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
};

const defaultSettings: SiteSettingsData = {
  brandName: 'My Rare Aesthetics',
  tagline: 'Where Science Meets Beauty Vision',
  founderName: 'Lindi-Grace',
  contactEmail: 'info@mraesthetics.co.za',
  contactPhone: '+27 (0) 12 345 6789',
  address: 'Pretoria, Gauteng, South Africa',
  businessHours: 'Mon - Fri: 08:30 - 17:00 (SAST)',
  announcementText: 'Now accepting custom cosmetic formulation requests for 2026/2027.',
  announcementActive: true,
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  whatsappNumber: '+27820000000',
};

export function AdminSettingsTab() {
  const [settings, setSettings] = useState<SiteSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch(apiUrl('/api/settings'));
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({ ...defaultSettings, ...data.settings });
          }
        }
      } catch (err) {
        console.warn('Could not load site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = sessionStorage.getItem('mra_admin_token');
      const res = await fetch(apiUrl('/api/settings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setToast('Site settings saved to MongoDB successfully!');
        setTimeout(() => setToast(''), 4000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      alert('Could not save settings. Ensure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs">
        <div className="flex items-center justify-between border-b border-plum/10 pb-4">
          <div>
            <h3 className="font-heading text-xl text-plum">Brand & Site Settings</h3>
            <p className="mt-0.5 text-xs text-dark-plum/60">
              Customize contact details, founder information, and announcement banner saved directly in MongoDB.
            </p>
          </div>
          {toast && (
            <div className="flex items-center gap-1.5 rounded bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
              <Check className="h-3.5 w-3.5" />
              <span>{toast}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* Section: Brand Identity */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum">
              <Sparkles className="h-4 w-4" />
              <span>Brand Identity</span>
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Brand Name</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Founder Name</label>
                <input
                  type="text"
                  value={settings.founderName}
                  onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Announcement Banner */}
          <div className="space-y-4 border-t border-plum/10 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum">
              <Globe className="h-4 w-4" />
              <span>Top Announcement Banner</span>
            </h4>
            <div>
              <label className="block text-xs font-semibold text-dark-plum/70">Banner Message</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="banner-active"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="h-4 w-4 rounded accent-plum"
              />
              <label htmlFor="banner-active" className="text-xs font-medium text-dark-plum">
                Show top announcement bar across the website
              </label>
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="space-y-4 border-t border-plum/10 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum">
              <Mail className="h-4 w-4" />
              <span>Contact & Location</span>
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Official Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Physical Location</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Business Hours</label>
                <input
                  type="text"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Social & Channels */}
          <div className="space-y-4 border-t border-plum/10 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum">
              <Phone className="h-4 w-4" />
              <span>Social Media & Messaging</span>
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">LinkedIn URL</label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-plum/70">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="mt-1 w-full rounded border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings to MongoDB'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
