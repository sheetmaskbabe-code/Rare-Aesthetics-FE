import { useState, FormEvent, useMemo } from 'react';
import { PortfolioItem, portfolioCategories } from '@/data/portfolio';
import { Button } from '@/components/ui/button';
import { AdminFileUpload } from './AdminFileUpload';
import { Edit, Trash2, Plus, Search, Check } from 'lucide-react';

type AdminPortfolioTabProps = {
  portfolio: PortfolioItem[];
  onSave: (item: PortfolioItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function slugify(val: string) {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function AdminPortfolioTab({ portfolio, onSave, onDelete }: AdminPortfolioTabProps) {
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'Skincare',
    description: '',
    image: '',
    imagePublicId: '',
    link: '',
    buttonText: 'LEARN MORE',
    published: true,
  });

  const categories = useMemo(() => portfolioCategories.filter((c) => c !== 'All'), []);

  const resetForm = () => {
    setForm({
      id: '',
      title: '',
      slug: '',
      category: 'Skincare',
      description: '',
      image: '',
      imagePublicId: '',
      link: '',
      buttonText: 'LEARN MORE',
      published: true,
    });
  };

  const startEdit = (item: PortfolioItem) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug || slugify(item.title),
      category: item.category,
      description: item.description,
      image: item.image,
      imagePublicId: item.imagePublicId || '',
      link: item.link || '',
      buttonText: item.buttonText || 'LEARN MORE',
      published: item.published,
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setSaving(true);
      const item: PortfolioItem = {
        id: form.id || `proj-${Date.now()}`,
        slug: form.slug.trim() || slugify(form.title),
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image || '/images/process-bottles.jpg',
        imagePublicId: form.imagePublicId || undefined,
        link: form.link.trim() || undefined,
        buttonText: form.buttonText.trim() || 'LEARN MORE',
        published: form.published,
      };

      await onSave(item);
      setSuccessToast(form.id ? 'Portfolio item updated!' : 'New portfolio item saved to MongoDB!');
      resetForm();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: unknown) {
      console.error('Error saving portfolio item:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredPortfolio = useMemo(() => {
    if (!search.trim()) return portfolio;
    const q = search.toLowerCase();
    return portfolio.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [portfolio, search]);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Portfolio Form: 7 cols */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs"
        >
          <div className="flex items-center justify-between border-b border-plum/10 pb-3">
            <h2 className="font-heading text-xl text-plum">
              {form.id ? 'Edit Portfolio Showcase' : 'Add New Portfolio Project'}
            </h2>
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 text-xs text-deep-blue hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Project</span>
              </button>
            )}
          </div>

          {successToast && (
            <div className="flex items-center gap-2 rounded bg-emerald-100 p-2.5 text-xs text-emerald-800">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rare Aesthetics Sheet Masks"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: prev.id ? prev.slug : slugify(title),
                }));
              }}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Slug & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                Slug
              </label>
              <input
                type="text"
                placeholder="project-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-xs font-mono text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cloudinary File Upload for Project Image */}
          <AdminFileUpload
            folder="portfolio"
            currentUrl={form.image}
            label="Project Showcase Image (Cloudinary File Upload)"
            onUploadSuccess={(url, publicId) => {
              setForm((prev) => ({
                ...prev,
                image: url,
                imagePublicId: publicId || '',
              }));
            }}
            onRemove={() => setForm((prev) => ({ ...prev, image: '', imagePublicId: '' }))}
          />

          {/* Direct Image URL input */}
          <div>
            <label className="block text-[11px] font-medium text-dark-plum/60">
              Or paste image URL directly
            </label>
            <input
              type="text"
              placeholder="/images/... or https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/20 px-3 py-1.5 text-xs font-mono text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
              Project Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the formulation, testing, packaging, or brand innovation involved in this project..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Link & Button Text */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                Custom Page Link (optional)
              </label>
              <input
                type="text"
                placeholder="/process or /products"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-xs text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                Button Text
              </label>
              <input
                type="text"
                placeholder="LEARN MORE"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-xs font-semibold text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          {/* Published checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="portfolio-published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 rounded accent-plum"
            />
            <label htmlFor="portfolio-published" className="text-xs font-semibold text-dark-plum">
              Showcase on website
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update Project' : 'Save Project to MongoDB'}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Existing items: 5 cols */}
      <div className="space-y-4 lg:col-span-5">
        <h3 className="font-heading text-lg text-plum">
          Portfolio Items ({portfolio.length})
        </h3>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-plum/20 bg-white/70 py-2 pr-3 pl-8 text-xs text-dark-plum focus:border-plum focus:outline-none"
          />
          <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-dark-plum/40" />
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-3 rounded-sm border p-3.5 shadow-xs transition-all ${
                form.id === item.id
                  ? 'border-plum bg-orchid/20 ring-1 ring-plum'
                  : 'border-plum/10 bg-white/70 hover:bg-white'
              }`}
            >
              <div className="flex gap-3 min-w-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 shrink-0 rounded object-cover border border-plum/10"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-plum truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-dark-plum/60 font-medium">{item.category}</p>
                  <p className="line-clamp-2 mt-1 text-[11px] text-dark-plum/70">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-deep-blue hover:bg-deep-blue/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                      onDelete(item.id);
                    }
                  }}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {filteredPortfolio.length === 0 && (
            <p className="p-6 text-center text-xs text-dark-plum/50">No portfolio items matched your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
