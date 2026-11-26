import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export type HeaderSlide = {
  title: string;
  description: string;
  media: string;
};

export function usePageHeader(page: string, defaultSlides: HeaderSlide[]) {
  const [slides, setSlides] = useState<HeaderSlide[]>(() => {
    if (typeof window === 'undefined') return defaultSlides;
    try {
      const raw = localStorage.getItem(`mra_header_${page}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultSlides;
  });

  useEffect(() => {
    let isMounted = true;
    fetch(apiUrl(`/api/headers/${page}?_t=${Date.now()}`), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.header?.slides && data.header.slides.length > 0) {
          setSlides(data.header.slides);
          try {
            localStorage.setItem(`mra_header_${page}`, JSON.stringify(data.header.slides));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn(`[usePageHeader] Falling back to default slides for ${page}:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [page]);

  return slides;
}
