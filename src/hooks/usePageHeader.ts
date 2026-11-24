import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export type HeaderSlide = {
  title: string;
  description: string;
  media: string;
};

export function usePageHeader(page: string, defaultSlides: HeaderSlide[]) {
  const [slides, setSlides] = useState<HeaderSlide[]>(defaultSlides);

  useEffect(() => {
    let isMounted = true;
    fetch(apiUrl(`/api/headers/${page}`))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.header?.slides && data.header.slides.length > 0) {
          setSlides(data.header.slides);
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
