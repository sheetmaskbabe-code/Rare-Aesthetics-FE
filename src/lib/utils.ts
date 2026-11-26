import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve article/blog CTA destination (external URL or internal route). */
export function resolvePostLink(link?: string, fallback = '/book-consultation') {
  const href = (link || '').trim() || fallback;
  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');
  return {
    href: isExternal || href.startsWith('/') ? href : `/${href}`,
    isExternal,
  };
}
