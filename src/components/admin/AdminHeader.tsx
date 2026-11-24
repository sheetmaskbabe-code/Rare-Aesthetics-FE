import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Briefcase,
  Mail,
  LogOut,
  Home as HomeIcon,
  User,
  Image as ImageIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

export type AdminTab = 'blogs' | 'portfolio' | 'enquiries' | 'home' | 'about' | 'media' | 'settings';

type AdminHeaderProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
  counts: {
    blogs: number;
    portfolio: number;
    enquiries: number;
    media?: number;
  };
  health?: {
    mongodb: boolean;
    cloudinary: boolean;
  };
};

export function AdminHeader({ activeTab, onTabChange, onSignOut, counts, health }: AdminHeaderProps) {
  const tabs: { id: AdminTab; label: string; icon: typeof BookOpen; count?: number }[] = [
    { id: 'blogs', label: 'Blog Posts', icon: BookOpen, count: counts.blogs },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, count: counts.portfolio },
    { id: 'enquiries', label: 'Enquiries', icon: Mail, count: counts.enquiries },
    { id: 'home', label: 'Home Page', icon: HomeIcon },
    { id: 'about', label: 'About Page', icon: User },
    { id: 'media', label: 'Media Library', icon: ImageIcon, count: counts.media },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-plum/10 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-lg font-bold text-plum tracking-wide">
            Dashboard Overview
          </h1>
          {health && (
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${
                  health.mongodb
                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                }`}
                title="MongoDB Database connection status"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${health.mongodb ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                MongoDB: {health.mongodb ? 'Connected' : 'Offline'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${
                  health.cloudinary
                    ? 'bg-sky-500/10 text-sky-700 border border-sky-500/20'
                    : 'bg-zinc-500/10 text-zinc-600 border border-zinc-500/20'
                }`}
                title="Cloudinary CDN configuration status"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${health.cloudinary ? 'bg-sky-500' : 'bg-zinc-400'}`} />
                Cloudinary: {health.cloudinary ? 'Active' : 'Unconfigured'}
              </span>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <Button variant="outline" onClick={onSignOut} className="gap-1.5 px-3 py-1.5 text-xs">
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#9810FA] text-white shadow-md shadow-[#9810FA]/25'
                  : 'bg-white/70 text-dark-plum hover:bg-[#9810FA]/10 hover:text-[#9810FA]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-white text-[#9810FA]' : 'bg-[#9810FA]/15 text-[#9810FA]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
