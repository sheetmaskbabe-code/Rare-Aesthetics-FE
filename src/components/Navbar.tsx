import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks, siteConfig } from '@/data/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoImg from '@/images/Untitled design.png';

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (currentScrollY <= 50) {
        // At or near top -> always show
        setVisible(true);
      } else if (currentScrollY > lastScrollY + 6) {
        // Scrolling down -> hide navbar
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 6) {
        // Scrolling up -> reveal navbar
        setVisible(true);
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        !visible && !open
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto',
        scrolled || open
          ? 'border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl shadow-2xl'
          : 'bg-transparent md:bg-gradient-to-b md:from-black/75 md:via-black/35 md:to-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${siteConfig.brand} home`}>
          <img
            src={logoImg}
            alt={`${siteConfig.brand} logo`}
            className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden font-heading text-sm font-medium tracking-[0.08em] text-white sm:block md:text-base">
            {siteConfig.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-[13px] tracking-wide transition-colors',
                  isActive
                    ? 'text-[#d5b2dd] font-medium'
                    : 'text-white/80 hover:text-white'
                )
              }
              end={link.href === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://paystack.shop/pay/b52q6dwlmu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-[13px] font-medium text-white/80 transition hover:text-white"
          >
            Make a Payment
          </a>
          <Button
            to="/book"
            className="rounded-full border-none bg-[#8524F9] px-6 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#731bd9]"
          >
            Book a Consultation
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0a0a]/95 text-white backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-6" aria-label="Mobile">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-sm px-3 py-3 text-base transition',
                      isActive ? 'bg-white/10 text-[#d5b2dd] font-medium' : 'text-white/80 hover:text-white'
                    )
                  }
                  end={link.href === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="https://paystack.shop/pay/b52q6dwlmu"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm px-3 py-3 text-white/80 transition hover:text-white"
              >
                Make a Payment
              </a>
              <div className="mt-3 px-1">
                <Button
                  to="/book"
                  className="w-full rounded-full border-none bg-[#8524F9] py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#731bd9]"
                >
                  Book a Consultation
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
