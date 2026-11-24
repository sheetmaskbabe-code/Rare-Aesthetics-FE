import { useState, FormEvent, useMemo } from 'react';
import { BlogPost } from '@/data/blog';
import { Button } from '@/components/ui/button';
import { AdminFileUpload } from './AdminFileUpload';
import { Edit, Trash2, Plus, Search, ExternalLink, Check, Eye } from 'lucide-react';

type AdminBlogTabProps = {
  posts: BlogPost[];
  onSave: (post: BlogPost) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function slugify(val: string) {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const CATEGORY_PRESETS = [
  'Formulation',
  'Science & Innovation',
  'Ingredients',
  'Product Development',
  'Packaging',
  'Industry Insights',
  'Regulatory',
];

export function AdminBlogTab({ posts, onSave, onDelete }: AdminBlogTabProps) {
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'Formulation',
    date: new Date().toISOString().slice(0, 10),
    image: '',
    imagePublicId: '',
    excerpt: '',
    content: '',
    published: true,
  });

  const resetForm = () => {
    setForm({
      id: '',
      title: '',
      slug: '',
      category: 'Formulation',
      date: new Date().toISOString().slice(0, 10),
      image: '',
      imagePublicId: '',
      excerpt: '',
      content: '',
      published: true,
    });
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug || slugify(post.title),
      category: post.category,
      date: post.date,
      image: post.image,
      imagePublicId: post.imagePublicId || '',
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setSaving(true);
      const post: BlogPost = {
        id: form.id || `blog-${Date.now()}`,
        slug: form.slug.trim() || slugify(form.title),
        title: form.title.trim(),
        category: form.category.trim() || 'General',
        date: form.date,
        image: form.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        imagePublicId: form.imagePublicId || undefined,
        excerpt: form.excerpt.trim(),
        content: form.content.trim() || form.excerpt.trim(),
        published: form.published,
      };

      await onSave(post);
      setSuccessToast(form.id ? 'Article updated in MongoDB!' : 'New article created in MongoDB!');
      resetForm();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: unknown) {
      console.error('Error saving post:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [posts, search]);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Article Form: Left/Top 7 columns */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs"
        >
          <div className="flex items-center justify-between border-b border-plum/10 pb-3">
            <h2 className="font-heading text-xl text-plum">
              {form.id ? 'Edit Blog Article' : 'Create New Blog Article'}
            </h2>
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 text-xs text-deep-blue hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Article</span>
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
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cosmetic Formulation Foundations"
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

          {/* Slug & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="url-friendly-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-xs font-mono text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
                Publish Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
              Category
            </label>
            <div className="mt-1 flex flex-wrap gap-1.5 pb-1">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    form.category === cat
                      ? 'bg-plum text-lavender'
                      : 'bg-lavender/40 text-dark-plum hover:bg-lavender'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Cloudinary File Upload for Featured Image */}
          <AdminFileUpload
            folder="blogs"
            currentUrl={form.image}
            label="Featured Article Image (Cloudinary File Upload)"
            onUploadSuccess={(url, publicId) => {
              setForm((prev) => ({
                ...prev,
                image: url,
                imagePublicId: publicId || '',
              }));
            }}
            onRemove={() => setForm((prev) => ({ ...prev, image: '', imagePublicId: '' }))}
          />

          {/* Direct image URL input (alternative to upload) */}
          <div>
            <label className="block text-[11px] font-medium text-dark-plum/60">
              Or paste image URL directly
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/20 px-3 py-1.5 text-xs font-mono text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
              Short Excerpt / Summary
            </label>
            <textarea
              rows={2}
              placeholder="Brief 1-2 sentence preview for cards and search results..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Content (Markdown) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-dark-plum/70">
              Full Content (Supports Markdown headers ##, lists, quotes)
            </label>
            <textarea
              rows={8}
              required
              placeholder="Write the full article content here. Use ## for headers, * for bullet points..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 w-full rounded-sm border border-plum/20 bg-lavender/30 px-3 py-2 text-sm font-sans text-dark-plum focus:border-plum focus:outline-none"
            />
          </div>

          {/* Published checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="blog-published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 rounded accent-plum"
            />
            <label htmlFor="blog-published" className="text-xs font-semibold text-dark-plum">
              Publish publicly on website
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update Article' : 'Save Article to MongoDB'}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Articles List: Right 5 columns */}
      <div className="space-y-4 lg:col-span-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg text-plum">
            Published Articles ({posts.length})
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-plum/20 bg-white/70 py-2 pr-3 pl-8 text-xs text-dark-plum focus:border-plum focus:outline-none"
          />
          <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-dark-plum/40" />
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`flex items-start justify-between gap-3 rounded-sm border p-3.5 shadow-xs transition-all ${
                form.id === post.id
                  ? 'border-plum bg-orchid/20 ring-1 ring-plum'
                  : 'border-plum/10 bg-white/70 hover:bg-white'
              }`}
            >
              <div className="flex gap-3 min-w-0">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-16 w-16 shrink-0 rounded object-cover border border-plum/10"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-plum truncate">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-dark-plum/60">
                    <span className="font-medium text-plum/80">{post.category}</span> · {post.date}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                      post.published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-deep-blue hover:bg-deep-blue/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                      onDelete(post.id);
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

          {filteredPosts.length === 0 && (
            <p className="p-6 text-center text-xs text-dark-plum/50">No articles matched your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
