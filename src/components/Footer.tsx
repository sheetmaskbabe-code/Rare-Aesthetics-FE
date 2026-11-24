import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { services } from '@/data/services';
import logoImg from '@/images/Untitled design.png';

function SocialGlyph({ label }: { label: string }) {
  if (label === 'TikTok') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  }
  if (label === 'X') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (label === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (label === 'YouTube') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M14 3h6v6h-2V6.4l-7.3 7.3-1.4-1.4L16.6 5H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-dark-plum text-lavender">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src={logoImg}
                alt={`${siteConfig.brand} logo`}
                className="h-11 w-11 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-heading text-lg">{siteConfig.brand}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-lavender/65">
              Cosmetic product development, formulation, manufacturing support and consulting —
              helping beauty brands transform ideas into thoughtfully developed products.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: siteConfig.social.tiktok, label: 'TikTok' },
                { href: siteConfig.social.x, label: 'X' },
                { href: siteConfig.social.facebook, label: 'Facebook' },
                { href: siteConfig.social.youtube, label: 'YouTube' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href || '#'}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noopener noreferrer' : undefined}
                  aria-label={href ? label : `${label} (link pending)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lavender/20 text-lavender/70 transition hover:border-orchid hover:text-orchid"
                  onClick={(e) => {
                    if (!href) e.preventDefault();
                  }}
                >
                  <SocialGlyph label={label} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-orchid">Navigate</h3>
            <ul className="mt-5 space-y-3 text-sm text-lavender/70">
              {[
                ['Home', '/'],
                ['About', '/about'],
                ['Services', '/services'],
                ['Products', '/products'],
                ['Process', '/process'],
                ['Portfolio', '/portfolio'],
                ['Blog', '/blog'],
                ['FAQ', '/faq'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="transition hover:text-lavender">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-orchid">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-lavender/70">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="transition hover:text-lavender">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="inline-flex items-center gap-1 text-orchid hover:text-lavender">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-orchid">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-lavender/70">
              <li>{siteConfig.address}</li>
              <li>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="hover:text-lavender">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-lavender">
                  {siteConfig.email}
                </a>
              </li>
            </ul>

          </div>
        </div>

      </div>
    </footer>
  );
}

export { Footer7 } from '@/components/ui/footer-7';
