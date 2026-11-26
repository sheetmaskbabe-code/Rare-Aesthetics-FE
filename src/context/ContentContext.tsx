import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { BlogPost, defaultBlogPosts } from '@/data/blog';
import { PortfolioItem, defaultPortfolio } from '@/data/portfolio';
import { apiUrl } from '@/lib/api';

type ContentState = {
  posts: BlogPost[];
  portfolio: PortfolioItem[];
  isLoading: boolean;
  setPosts: (posts: BlogPost[]) => void;
  setPortfolio: (items: PortfolioItem[]) => void;
  upsertPost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  upsertPortfolioItem: (item: PortfolioItem) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  refreshContent: () => Promise<void>;
};

const ContentContext = createContext<ContentState | null>(null);

const POSTS_KEY = 'mra_blog_posts';
const PORTFOLIO_KEY = 'mra_portfolio';

function getAdminHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('mra_admin_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': 'Rare1357',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function loadPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return defaultBlogPosts;
    const stored = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(stored)) return defaultBlogPosts;
    return stored;
  } catch {
    return defaultBlogPosts;
  }
}

function loadPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    if (!raw) return defaultPortfolio;
    const stored = JSON.parse(raw) as PortfolioItem[];
    if (!Array.isArray(stored) || stored.length === 0) return defaultPortfolio;
    return stored;
  } catch {
    return defaultPortfolio;
  }
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPostsState] = useState<BlogPost[]>(() =>
    typeof window === 'undefined' ? defaultBlogPosts : loadPosts()
  );
  const [portfolio, setPortfolioState] = useState<PortfolioItem[]>(() =>
    typeof window === 'undefined' ? defaultPortfolio : loadPortfolio()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync state to local storage for offline caching
  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  // Fetch initial content from API
  const refreshContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const [postsRes, portfolioRes] = await Promise.allSettled([
        fetch(apiUrl('/api/posts?all=true')),
        fetch(apiUrl('/api/portfolio?all=true')),
      ]);

      if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
        const data = await postsRes.value.json();
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          const apiIds = new Set(data.posts.map((p: { id?: string }) => p.id));
          const missingDefaults = defaultBlogPosts.filter((p) => !apiIds.has(p.id));
          setPostsState([...data.posts, ...missingDefaults]);
        } else if (defaultBlogPosts.length > 0) {
          setPostsState(defaultBlogPosts);
        }
      }

      if (portfolioRes.status === 'fulfilled' && portfolioRes.value.ok) {
        const data = await portfolioRes.value.json();
        if (Array.isArray(data.portfolio) && data.portfolio.length > 0) {
          setPortfolioState(data.portfolio);
        }
      }
    } catch (err) {
      console.warn('[ContentProvider] Using cached local data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const upsertPost = useCallback(async (post: BlogPost) => {
    // Optimistic UI update
    setPostsState((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      return exists ? prev.map((p) => (p.id === post.id ? post : p)) : [post, ...prev];
    });

    try {
      await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(post),
      });
    } catch (err) {
      console.warn('[ContentProvider] Backend sync failed, stored in browser:', err);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setPostsState((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(apiUrl(`/api/posts/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
    } catch (err) {
      console.warn('[ContentProvider] Backend delete failed:', err);
    }
  }, []);

  const upsertPortfolioItem = useCallback(async (item: PortfolioItem) => {
    setPortfolioState((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
    });

    try {
      await fetch(apiUrl('/api/portfolio'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.warn('[ContentProvider] Backend sync failed, stored in browser:', err);
    }
  }, []);

  const deletePortfolioItem = useCallback(async (id: string) => {
    setPortfolioState((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(apiUrl(`/api/portfolio/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
    } catch (err) {
      console.warn('[ContentProvider] Backend delete failed:', err);
    }
  }, []);

  const value = useMemo<ContentState>(
    () => ({
      posts,
      portfolio,
      isLoading,
      setPosts: setPostsState,
      setPortfolio: setPortfolioState,
      upsertPost,
      deletePost,
      upsertPortfolioItem,
      deletePortfolioItem,
      refreshContent,
    }),
    [posts, portfolio, isLoading, upsertPost, deletePost, upsertPortfolioItem, deletePortfolioItem, refreshContent]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
