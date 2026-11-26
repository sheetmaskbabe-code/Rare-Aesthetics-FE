export type OkoaArticle = {
  id: string;
  title: string;
  url: string;
  category: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => {
      if (word.toLowerCase() === 'vs') return 'vs';
      if (word.toLowerCase() === 'okoa') return 'OKOA';
      if (word.toLowerCase() === 'okoaskin') return 'OkoaSkin';
      if (word.toLowerCase() === 'cerave') return 'CeraVe';
      if (word.toLowerCase() === 'cetaphil') return 'Cetaphil';
      if (word.toLowerCase() === 'drmtlgy') return 'DRMTLGY';
      if (word.toLowerCase() === 'gopure') return 'goPure';
      if (word.toLowerCase() === 'nars') return 'NARS';
      if (word.toLowerCase() === 'plexaderm') return 'Plexaderm';
      if (word.toLowerCase() === 'skinmedica') return 'SkinMedica';
      if (word.toLowerCase() === 'idealift') return 'IDEALIFT';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function categoryFromPath(path: string) {
  const segment = path.split('/')[2] || 'editorial';
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const OKOA_URLS = [
  'https://okoaskin.com/blogs/anti-aging/best-caffeine-eye-creams',
  'https://okoaskin.com/blogs/anti-aging/best-lifting-cream',
  'https://okoaskin.com/blogs/anti-aging/best-skin-firming-cream',
  'https://okoaskin.com/blogs/anti-aging/best-toner',
  'https://okoaskin.com/blogs/anti-aging/best-vitamin-c-serum',
  'https://okoaskin.com/blogs/anti-aging/glycolic-acid-vs-salicylic-acid',
  'https://okoaskin.com/blogs/anti-aging/what-is-idealift',
  'https://okoaskin.com/blogs/anti-aging/what-is-tinted-moisturizer',
  'https://okoaskin.com/blogs/comparison/best-face-moisturizer',
  'https://okoaskin.com/blogs/comparison/cerave-vs-cetaphil',
  'https://okoaskin.com/blogs/comparison/okoa-vs-saie',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-bareminerals',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-carpe',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-drmtlgy',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-gopure',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-il-makiage',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-nars',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-peter-thomas-roth',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-plexaderm',
  'https://okoaskin.com/blogs/comparison/okoaskin-vs-serious-skincare',
  'https://okoaskin.com/blogs/comparison/skinmedica-vs-okoaskin',
  'https://okoaskin.com/blogs/ingredients/best-ingredients-for-dry-skin',
  'https://okoaskin.com/blogs/ingredients/hyaluronic-acid-vs-sodium-hyaluronate',
  'https://okoaskin.com/blogs/ingredients/is-aloe-vera-good-for-face-skin',
  'https://okoaskin.com/blogs/ingredients/when-to-apply-retinol',
  'https://okoaskin.com/blogs/news/okoa-skin-reviews',
  'https://okoaskin.com/blogs/okoaskin-the-blog/aloe-vera-for-irritated-skin',
  'https://okoaskin.com/blogs/okoaskin-the-blog/side-effects-of-aloe-vera-on-face',
  'https://okoaskin.com/blogs/okoaskin-the-blog/vegan-moisturizer',
  'https://okoaskin.com/blogs/okoaskin-the-blog/what-causes-sagging-skin',
  'https://okoaskin.com/blogs/okoaskin-the-blog/what-does-glycerin-do-for-skin',
  'https://okoaskin.com/blogs/okoaskin-the-blog/what-is-retinol-in-skincare',
  'https://okoaskin.com/blogs/skin-tightening/at-home-skin-tightening',
  'https://okoaskin.com/blogs/skin-tightening/benefits-of-vitamin-c',
  'https://okoaskin.com/blogs/skin-tightening/best-wrinkle-cream',
  'https://okoaskin.com/blogs/skin-tightening/crepey-neck',
  'https://okoaskin.com/blogs/skin-tightening/crepey-skin-under-eyes',
  'https://okoaskin.com/blogs/skin-tightening/do-firming-creams-work',
  'https://okoaskin.com/blogs/skin-tightening/does-caffeine-eye-cream-work',
  'https://okoaskin.com/blogs/skin-tightening/face-lift-without-surgery',
  'https://okoaskin.com/blogs/skin-tightening/how-to-tighten-sagging-jowls',
  'https://okoaskin.com/blogs/skin-tightening/laser-vs-cream-for-sagging-skin',
  'https://okoaskin.com/blogs/skin-tightening/loose-skin-after-weight-loss',
  'https://okoaskin.com/blogs/skin-tightening/retinol-for-skin-firming',
  'https://okoaskin.com/blogs/skin-tightening/skin-tightening-after-50',
  'https://okoaskin.com/blogs/skin-tightening/tech-neck-wrinkles',
] as const;

export const OKOA_HUB_PATH = '/articles/okoaskin';
export const OKOA_LOGO_URL = 'https://okoaskin.com/cdn/shop/files/okoa-logo.jpg';

export const okoaArticles: OkoaArticle[] = OKOA_URLS.map((url) => {
  const path = new URL(url).pathname;
  const slug = path.split('/').filter(Boolean).pop() || 'article';
  return {
    id: slug,
    title: titleFromSlug(slug),
    url,
    category: categoryFromPath(path),
  };
});

export const okoaArticleCount = okoaArticles.length;

export const okoaCategories = [
  'All',
  ...Array.from(new Set(okoaArticles.map((a) => a.category))),
];
