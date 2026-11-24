export const siteConfig = {
  brand: 'My Rare Aesthetics',
  founder: 'Lindi-Grace',
  tagline: 'Where Science Meets the Art of Beauty.',
  location: 'Pretoria, South Africa',
  address: '60 Willow Rd, Muckleneuk, Pretoria, 0002, South Africa',
  phone: '+27 65 128 0000',
  email: 'sheetmaskbabe@gmail.com',
  /** Replace with the client's live Calendly URL before launch */
  calendlyUrl: '',
  /** Replace with the approved payment provider checkout URL before launch */
  paymentProviderUrl: 'https://paystack.shop/pay/b52q6dwlmu',
  social: {
    tiktok: 'https://www.tiktok.com/@rareaesthetics_ra?lang=en-GB&is_from_webapp=1&sender_device=mobile&sender_web_id=7705406834072356404',
    x: 'https://x.com/RareAesthetics_',
    facebook: 'https://www.facebook.com/RareAestheticsRA?mibextid=rS40aB7S9Ucbxw6v',
    youtube: 'https://youtube.com/@darlingwheresthecoffee?si=Gh_Zh0RBPdCFTf0_',
  },
} as const;

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;
