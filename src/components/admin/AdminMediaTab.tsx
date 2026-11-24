import { useState, useEffect, useCallback } from 'react';
import { AdminFileUpload } from './AdminFileUpload';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Folder,
  RefreshCw,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  publicId?: string;
  folder?: string;
  format?: string;
  bytes?: number;
  resourceType?: string;
  createdAt?: string;
};

type AdminMediaTabProps = {
  onMediaCountChange?: (count: number) => void;
};

export function AdminMediaTab({ onMediaCountChange }: AdminMediaTabProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>('all');

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/upload'));
      if (res.ok) {
        const data = await res.json();
        const items = data.media || [];
        setMedia(items);
        if (onMediaCountChange) {
          onMediaCountChange(items.length);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch media assets:', err);
    } finally {
      setLoading(false);
    }
  }, [onMediaCountChange]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}" from Cloudinary and media records?`)) return;

    try {
      const token = sessionStorage.getItem('mra_admin_token');
      const targetId = item.id || item.publicId;
      await fetch(apiUrl(`/api/upload/${encodeURIComponent(targetId || '')}`), {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err) {
      console.error('Failed to delete media asset:', err);
    }
  };

  const filteredMedia = media.filter((item) => {
    if (activeFolder === 'all') return true;
    return item.folder === activeFolder;
  });

  const folders = Array.from(new Set(media.map((m) => m.folder || 'general')));

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div className="rounded-sm border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-xs">
        <h3 className="font-heading text-lg text-plum">Upload Media to Cloudinary</h3>
        <p className="mt-0.5 text-xs text-dark-plum/60">
          Upload images, logos, client attachments, or documents. Uploaded files receive permanent CDN links.
        </p>

        <div className="mt-4 max-w-xl">
          <AdminFileUpload
            folder="media"
            label="Drag & Drop Media Asset"
            onUploadSuccess={(url, publicId, meta) => {
              const newItem: MediaItem = {
                id: `media-${Date.now()}`,
                name: meta?.name || 'Uploaded File',
                url,
                publicId,
                folder: 'media',
                format: meta?.format,
                bytes: meta?.bytes,
                createdAt: new Date().toISOString(),
              };
              setMedia((prev) => [newItem, ...prev]);
            }}
          />
        </div>
      </div>

      {/* Media Gallery / File Manager */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg text-plum">
              Cloudinary Media Gallery ({media.length})
            </h3>
            <button
              type="button"
              onClick={fetchMedia}
              disabled={loading}
              title="Refresh media"
              className="p-1 text-dark-plum/50 hover:text-plum"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Folder tabs */}
          {folders.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFolder('all')}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  activeFolder === 'all'
                    ? 'bg-plum text-lavender'
                    : 'bg-lavender/40 text-dark-plum hover:bg-lavender'
                }`}
              >
                All ({media.length})
              </button>
              {folders.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFolder(f)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                    activeFolder === f
                      ? 'bg-plum text-lavender'
                      : 'bg-lavender/40 text-dark-plum hover:bg-lavender'
                  }`}
                >
                  <Folder className="h-3 w-3" />
                  <span>{f}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredMedia.length === 0 ? (
          <div className="rounded-sm border border-plum/15 bg-white/50 p-12 text-center text-xs text-dark-plum/60">
            {media.length === 0
              ? 'No media uploaded yet. Use the upload box above to add your first images or documents to Cloudinary.'
              : 'No files found in this folder.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMedia.map((item) => {
              const isImg =
                item.url.startsWith('data:image') ||
                /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(item.url) ||
                item.url.includes('/image/upload/');

              const formattedSize = item.bytes
                ? item.bytes > 1024 * 1024
                  ? `${(item.bytes / (1024 * 1024)).toFixed(1)} MB`
                  : `${Math.round(item.bytes / 1024)} KB`
                : null;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-plum/15 bg-white/70 shadow-xs transition-all hover:border-plum hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden bg-lavender/30">
                    {isImg ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-plum/60">
                        <FileText className="h-12 w-12" />
                      </div>
                    )}

                    {/* Format badge */}
                    {item.format && (
                      <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                        {item.format}
                      </span>
                    )}

                    {/* Folder badge */}
                    {item.folder && (
                      <span className="absolute top-1.5 right-1.5 rounded bg-plum/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        {item.folder}
                      </span>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-2.5">
                    <p className="truncate text-xs font-semibold text-dark-plum" title={item.name}>
                      {item.name}
                    </p>
                    {formattedSize && (
                      <p className="text-[10px] text-dark-plum/50">{formattedSize}</p>
                    )}

                    <div className="mt-2 flex items-center justify-between gap-1 border-t border-plum/10 pt-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.url)}
                        title="Copy direct CDN link"
                        className="flex items-center gap-1 text-[11px] font-medium text-deep-blue hover:underline"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          title="Open original"
                          className="rounded p-1 text-dark-plum/60 hover:text-plum"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title="Delete file"
                          className="rounded p-1 text-red-700 hover:text-red-900"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
