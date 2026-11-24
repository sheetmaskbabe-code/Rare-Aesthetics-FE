import { useState, ChangeEvent, DragEvent } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, File, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { apiUrl } from '@/lib/api';

type AdminFileUploadProps = {
  folder: 'blogs' | 'portfolio' | 'media' | 'enquiries' | 'general';
  currentUrl?: string;
  label?: string;
  accept?: string;
  onUploadSuccess: (url: string, publicId?: string, meta?: { name: string; bytes?: number; format?: string }) => void;
  onRemove?: () => void;
};

export function AdminFileUpload({
  folder,
  currentUrl,
  label = 'Upload Image or File',
  accept = 'image/*,application/pdf,.doc,.docx',
  onUploadSuccess,
  onRemove,
}: AdminFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file) return;

    // Check size limit: 25MB
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds maximum size of 25MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setSuccessMsg('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const token = sessionStorage.getItem('mra_admin_token');
      const res = await fetch(apiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUploadSuccess(data.url, data.publicId, {
        name: data.name || file.name,
        bytes: data.bytes || file.size,
        format: data.format,
      });

      setSuccessMsg(
        data.source === 'cloudinary'
          ? 'Uploaded to Cloudinary successfully!'
          : 'Image uploaded successfully!'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const isImage = currentUrl && (
    currentUrl.startsWith('data:image') ||
    currentUrl.startsWith('/images/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(currentUrl) ||
    currentUrl.includes('/image/upload/')
  );

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold tracking-wide text-dark-plum/70 uppercase">
        {label}
      </label>

      {/* When file is ALREADY uploaded: Show ONLY the image card with Edit & Remove options */}
      {currentUrl ? (
        <div className="relative overflow-hidden rounded-sm border border-plum/20 bg-white/90 p-3 shadow-xs">
          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/85 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-plum">
                <Loader2 className="h-4 w-4 animate-spin text-plum" />
                <span>Uploading replacement image...</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-plum/20 bg-lavender/30 shadow-xs">
                <img src={currentUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-plum/20 bg-lavender/40 text-plum">
                <File className="h-7 w-7" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-dark-plum">{currentUrl}</p>
              <div className="mt-1 flex items-center gap-3">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-plum hover:underline"
                >
                  <span>Open original file</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Edit / Change Image Button */}
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded bg-plum px-3 py-1.5 text-xs font-medium text-lavender hover:bg-plum/90 transition-all shadow-xs">
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Image</span>
                <input
                  type="file"
                  accept={accept}
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Remove Button */}
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50/70 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Only show upload dropzone when no image is present */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-4 transition-colors ${
            isDragOver
              ? 'border-plum bg-orchid/20'
              : 'border-plum/20 bg-white/60 hover:border-plum/40 hover:bg-white/80'
          }`}
        >
          <input
            type="file"
            accept={accept}
            disabled={isUploading}
            onChange={handleFileChange}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />

          <div className="flex flex-col items-center gap-1.5 text-center">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-plum" />
            ) : (
              <Upload className="h-6 w-6 text-plum/60" />
            )}

            <p className="text-xs font-medium text-dark-plum">
              {isUploading ? 'Uploading to Cloudinary...' : 'Click or drag file here to upload'}
            </p>
            <p className="text-[10px] text-dark-plum/50">
              Supports Images (JPG, PNG, WebP) and Documents (PDF, DOCX) up to 25MB
            </p>
          </div>
        </div>
      )}

      {/* Success / Error alerts */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
