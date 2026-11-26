import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { useContent } from '@/context/ContentContext';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { AdminHeader, AdminTab } from '@/components/admin/AdminHeader';
import { AdminBlogTab } from '@/components/admin/AdminBlogTab';
import { AdminPortfolioTab } from '@/components/admin/AdminPortfolioTab';
import { AdminEnquiriesTab, EnquiryItem } from '@/components/admin/AdminEnquiriesTab';
import { AdminHomeTab } from '@/components/admin/AdminHomeTab';
import { AdminAboutTab } from '@/components/admin/AdminAboutTab';
import { AdminMediaTab } from '@/components/admin/AdminMediaTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { Globe, ShieldCheck } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const ADMIN_SESSION_KEY = 'mra_admin_session';
const ADMIN_TOKEN_KEY = 'mra_admin_token';

export function Admin() {
  const { posts, portfolio, upsertPost, deletePost, upsertPortfolioItem, deletePortfolioItem } =
    useContent();

  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1');
  const [activeTab, setActiveTab] = useState<AdminTab>('blogs');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [mediaCount, setMediaCount] = useState<number>(0);

  // System health state (MongoDB & Cloudinary)
  const [health, setHealth] = useState<{ mongodb: boolean; cloudinary: boolean }>({
    mongodb: false,
    cloudinary: false,
  });

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/health'));
      if (res.ok) {
        const data = await res.json();
        setHealth({
          mongodb: Boolean(data?.services?.mongodb?.connected),
          cloudinary: Boolean(data?.services?.cloudinary?.configured),
        });
      }
    } catch {
      setHealth({ mongodb: false, cloudinary: false });
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoadingEnquiries(true);
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      let list: EnquiryItem[] = [];

      try {
        const res = await fetch(apiUrl('/api/enquiries'), {
          headers: {
            'x-admin-key': 'Rare1357',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          list = data.enquiries || [];
        }
      } catch (networkErr) {
        console.warn('API fetch enquiries warning:', networkErr);
      }

      // Merge local fallback enquiries if any exist
      try {
        const local = JSON.parse(localStorage.getItem('mra_enquiries') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          const formattedLocal: EnquiryItem[] = local.map((item: any, idx: number) => ({
            id: item.id || `local-enq-${idx}`,
            name: item.name || item.fullName || 'Anonymous Client',
            fullName: item.fullName || item.name || 'Anonymous Client',
            email: item.email || '',
            phone: item.phone || '',
            company: item.company || '',
            service: item.service || '',
            timeline: item.timeline || '',
            budget: item.budget || '',
            message: item.message || item.description || '',
            description: item.description || item.message || '',
            attachmentName: item.attachmentName || null,
            attachmentUrl: item.attachmentUrl || null,
            status: item.status || 'new',
            createdAt: item.createdAt || new Date().toISOString(),
          }));

          const seen = new Set(list.map((e) => e.id));
          formattedLocal.forEach((e) => {
            if (!seen.has(e.id)) {
              list.unshift(e);
            }
          });
        }
      } catch {
        // ignore local parse error
      }

      setEnquiries(list);
    } catch (err) {
      console.warn('Failed to fetch enquiries:', err);
    } finally {
      setLoadingEnquiries(false);
    }
  }, []);

  const fetchMediaCount = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/upload'));
      if (res.ok) {
        const data = await res.json();
        setMediaCount(data.media?.length || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (authed) {
      checkHealth();
      fetchEnquiries();
      fetchMediaCount();
    }
  }, [authed, checkHealth, fetchEnquiries, fetchMediaCount]);

  const handleLoginSuccess = (token?: string) => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
    setAuthed(true);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuthed(false);
  };

  const updateEnquiryStatus = async (id: string, newStatus: EnquiryItem['status']) => {
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      await fetch(apiUrl(`/api/enquiries/${encodeURIComponent(id)}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      try {
        const local = JSON.parse(localStorage.getItem('mra_enquiries') || '[]');
        const updatedLocal = local.map((item: any) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem('mra_enquiries', JSON.stringify(updatedLocal));
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('Failed to update enquiry status:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      await fetch(apiUrl(`/api/enquiries/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'Rare1357',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      try {
        const local = JSON.parse(localStorage.getItem('mra_enquiries') || '[]');
        const updatedLocal = local.filter((item: any) => item.id !== id);
        localStorage.setItem('mra_enquiries', JSON.stringify(updatedLocal));
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('Failed to delete enquiry:', err);
    }
  };

  if (!authed) {
    return <AdminAuth onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-portal min-h-screen bg-[#F6F2F5] text-dark-plum flex flex-col">
      <Seo title="Admin Portal | My Rare Aesthetics" noindex />

      {/* Standalone Admin Top Banner */}
      <div className="bg-[#35213B] text-lavender border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8524F9]/20 text-[#8524F9]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm tracking-wide text-white">
              MY RARE AESTHETICS
            </span>
            <span className="ml-2 rounded bg-[#8524F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              CMS Portal
            </span>
          </div>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-lavender hover:bg-white/15 transition-all"
        >
          <Globe className="h-3.5 w-3.5 text-[#8524F9]" />
          <span>View Live Website ↗</span>
        </Link>
      </div>

      {/* Main Admin Dashboard Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation & Status Header */}
        <AdminHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSignOut={handleSignOut}
          health={health}
          counts={{
            blogs: posts.length,
            portfolio: portfolio.length,
            enquiries: enquiries.length,
            media: mediaCount,
          }}
        />

        {/* Tab 1: Blog Articles */}
        {activeTab === 'blogs' && (
          <AdminBlogTab
            posts={posts}
            onSave={upsertPost}
            onDelete={deletePost}
          />
        )}

        {/* Tab 2: Portfolio Projects */}
        {activeTab === 'portfolio' && (
          <AdminPortfolioTab
            portfolio={portfolio}
            onSave={upsertPortfolioItem}
            onDelete={deletePortfolioItem}
          />
        )}

        {/* Tab 3: Customer Enquiries */}
        {activeTab === 'enquiries' && (
          <AdminEnquiriesTab
            enquiries={enquiries}
            loading={loadingEnquiries}
            onRefresh={fetchEnquiries}
            onUpdateStatus={updateEnquiryStatus}
            onDelete={deleteEnquiry}
          />
        )}

        {/* Tab 4: Home Page Content Editor */}
        {activeTab === 'home' && <AdminHomeTab />}

        {/* Tab 5: About Page Content Editor */}
        {activeTab === 'about' && <AdminAboutTab />}

        {/* Tab 6: Media Asset Manager */}
        {activeTab === 'media' && (
          <AdminMediaTab onMediaCountChange={setMediaCount} />
        )}

        {/* Tab 7: Site & Brand Settings */}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>
    </div>
  );
}

export default Admin;
