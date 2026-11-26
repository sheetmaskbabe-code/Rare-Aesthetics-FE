export type OkoaRedditPost = {
  id: string;
  title: string;
  url: string;
  author: string;
  authorUrl: string;
  community: string;
};

export const OKOA_REDDIT_HUB_PATH = '/articles/okoaskin-reddit';
export const OKOA_REDDIT_SUBREDDIT_URL = 'https://www.reddit.com/r/OKOASkin/';
export const OKOA_REDDIT_LOGO_URL =
  'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png';
export const OKOA_BRAND_LOGO_URL = 'https://okoaskin.com/cdn/shop/files/okoa-logo.jpg';

export const okoaRedditPosts: OkoaRedditPost[] = [
  {
    id: '4-butylresorcinol-dark-spot',
    title: 'Why we picked 4-butylresorcinol for our dark spot vial, and not vitamin C',
    url: 'https://www.reddit.com/r/OKOASkin/comments/1xcl47c/why_we_picked_4butylresorcinol_for_our_dark_spot/',
    author: 'u/inboundmage',
    authorUrl: 'https://www.reddit.com/user/inboundmage/',
    community: 'r/OKOASkin',
  },
  {
    id: 'horizontal-neck-lines',
    title: "Those horizontal lines on your neck probably aren't about age",
    url: 'https://www.reddit.com/r/OKOASkin/comments/1y2vrtq/those_horizontal_lines_on_your_neck_probably/',
    author: 'u/inboundmage',
    authorUrl: 'https://www.reddit.com/user/inboundmage/',
    community: 'r/OKOASkin',
  },
  {
    id: 'skin-in-menopause',
    title: 'What actually happens to skin in menopause, from someone who formulates for it',
    url: 'https://www.reddit.com/r/OKOASkin/comments/1vy2zyx/misc_what_actually_happens_to_skin_in_menopause/',
    author: 'u/inboundmage',
    authorUrl: 'https://www.reddit.com/user/inboundmage/',
    community: 'r/OKOASkin',
  },
  {
    id: '40-plus-skincare-mistake',
    title: 'The 40+ skincare mistake that can make everything look worse',
    url: 'https://www.reddit.com/r/OKOASkin/comments/1vllfxm/the_40_skincare_mistake_that_can_make_everything/',
    author: 'u/inboundmage',
    authorUrl: 'https://www.reddit.com/user/inboundmage/',
    community: 'r/OKOASkin',
  },
];

export const okoaRedditPostCount = okoaRedditPosts.length;
