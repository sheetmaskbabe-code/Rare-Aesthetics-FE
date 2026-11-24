import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  FileText,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';

export type EnquiryItem = {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  timeline?: string;
  budget?: string;
  message?: string;
  description?: string;
  attachmentName?: string | null;
  attachmentUrl?: string | null;
  attachmentPublicId?: string | null;
  status: 'new' | 'in_review' | 'reviewed' | 'contacted' | 'in_discussion' | 'completed' | 'closed';
  createdAt: string;
};

type AdminEnquiriesTabProps = {
  enquiries: EnquiryItem[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: EnquiryItem['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const STATUS_OPTIONS: { value: EnquiryItem['status']; label: string; badgeClass: string }[] = [
  { value: 'new', label: 'New', badgeClass: 'bg-plum/15 text-plum' },
  { value: 'in_review', label: 'In Review', badgeClass: 'bg-amber-100 text-amber-800' },
  { value: 'in_discussion', label: 'In Discussion', badgeClass: 'bg-purple-100 text-purple-800' },
  { value: 'contacted', label: 'Contacted', badgeClass: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { value: 'closed', label: 'Closed', badgeClass: 'bg-zinc-200 text-zinc-700' },
];

export function AdminEnquiriesTab({
  enquiries,
  loading,
  onRefresh,
  onUpdateStatus,
  onDelete,
}: AdminEnquiriesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const clientName = item.name || item.fullName || '';
      const clientMsg = item.message || item.description || '';
      const q = search.toLowerCase();

      const matchesSearch =
        !q ||
        clientName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.service && item.service.toLowerCase().includes(q)) ||
        clientMsg.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top filter and search bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-plum/15 bg-white/70 p-4 shadow-sm backdrop-blur-xs">
        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-plum text-lavender'
                : 'bg-lavender/40 text-dark-plum hover:bg-lavender'
            }`}
          >
            All ({enquiries.length})
          </button>
          {STATUS_OPTIONS.map((st) => {
            const count = enquiries.filter((e) => e.status === st.value).length;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setStatusFilter(st.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  statusFilter === st.value
                    ? 'bg-plum text-lavender'
                    : 'bg-lavender/40 text-dark-plum hover:bg-lavender'
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 rounded-sm border border-plum/20 bg-white/90 py-1.5 pr-2.5 pl-7 text-xs text-dark-plum focus:border-plum focus:outline-none sm:w-64"
            />
            <Search className="absolute top-2 left-2 h-3.5 w-3.5 text-dark-plum/40" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="gap-1 px-3 py-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>
      </div>

      {/* Enquiries Grid */}
      {loading && enquiries.length === 0 ? (
        <div className="rounded-sm border border-plum/15 bg-white/50 p-12 text-center text-sm text-dark-plum/60">
          Loading client enquiries from MongoDB Atlas...
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="rounded-sm border border-plum/15 bg-white/50 p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-plum/30" />
          <p className="mt-3 font-heading text-lg text-plum">No enquiries found</p>
          <p className="mt-1 text-xs text-dark-plum/60">
            {enquiries.length === 0
              ? 'New enquiries submitted through the Contact form will be recorded in MongoDB.'
              : 'No enquiries match the current filter or search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEnquiries.map((enq) => {
            const clientName = enq.name || enq.fullName || 'Anonymous Client';
            const clientMessage = enq.message || enq.description || 'No message provided';
            const statusConfig = STATUS_OPTIONS.find((s) => s.value === enq.status) || STATUS_OPTIONS[0];

            return (
              <div
                key={enq.id}
                className="space-y-4 rounded-sm border border-plum/15 bg-white/70 p-5 shadow-xs transition-all hover:border-plum/30 hover:bg-white"
              >
                {/* Header: Name, Contact info, Status Selector */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-plum/10 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-heading text-lg font-bold text-plum">{clientName}</h4>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusConfig.badgeClass}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dark-plum/70">
                      <a
                        href={`mailto:${enq.email}`}
                        className="inline-flex items-center gap-1 font-medium text-deep-blue hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{enq.email}</span>
                      </a>

                      {enq.phone && (
                        <a
                          href={`tel:${enq.phone}`}
                          className="inline-flex items-center gap-1 font-medium text-dark-plum hover:text-plum"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{enq.phone}</span>
                        </a>
                      )}

                      {enq.company && (
                        <span className="inline-flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-dark-plum/50" />
                          <span>{enq.company}</span>
                        </span>
                      )}

                      {enq.timeline && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-dark-plum/50" />
                          <span>Timeline: {enq.timeline}</span>
                        </span>
                      )}

                      {enq.budget && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-dark-plum/50" />
                          <span>Budget: {enq.budget}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Change status dropdown & Delete */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-dark-plum/60">Status:</label>
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        onUpdateStatus(enq.id, e.target.value as EnquiryItem['status'])
                      }
                      className="rounded-sm border border-plum/20 bg-lavender/40 px-2 py-1 text-xs font-semibold text-dark-plum focus:border-plum focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete enquiry from ${clientName}?`)) {
                          onDelete(enq.id);
                        }
                      }}
                      title="Delete enquiry"
                      className="rounded p-1.5 text-red-700 hover:bg-red-50 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Service Requested badge */}
                {enq.service && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-dark-plum/60">
                      Requested Service:
                    </span>
                    <span className="rounded bg-orchid/20 px-2 py-0.5 text-xs font-semibold text-plum">
                      {enq.service}
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <div className="rounded border border-plum/10 bg-lavender/20 p-3 text-xs leading-relaxed text-dark-plum">
                  <p className="whitespace-pre-wrap">{clientMessage}</p>
                </div>

                {/* Attachment Section */}
                {enq.attachmentUrl && (
                  <div className="flex items-center gap-3 rounded border border-plum/15 bg-white p-2.5">
                    <FileText className="h-5 w-5 text-plum shrink-0" />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-semibold text-plum">Attached File / Specification</p>
                      <p className="truncate text-[11px] text-dark-plum/60">
                        {enq.attachmentName || enq.attachmentUrl}
                      </p>
                    </div>
                    <a
                      href={enq.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-plum px-2.5 py-1 text-[11px] font-semibold text-lavender hover:bg-plum/90"
                    >
                      <span>View File</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Footer timestamp */}
                <div className="flex items-center justify-between text-[11px] text-dark-plum/50">
                  <span>ID: {enq.id}</span>
                  <span>
                    Received: {enq.createdAt ? new Date(enq.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
