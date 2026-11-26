export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  imagePublicId?: string;
  content: string;
  published: boolean;
  type?: 'article' | 'blog';
  link?: string;
  buttonText?: string;
};

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-welcome-rare-aesthetics',
    slug: 'welcome-to-rare-aesthetics-where-science-meets-beauty-vision',
    title: 'Welcome to Rare Aesthetics — Where Science Meets Beauty Vision',
    excerpt:
      'Every great skincare brand begins with an idea. Discover how Rare Aesthetics guides beauty entrepreneurs from inspiration to market-ready products.',
    category: 'Brand Vision',
    date: '2026-11-20',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80',
    content: `## Where science meets beauty vision

At Rare Aesthetics, we believe that every great skincare brand begins with an idea — a spark of inspiration, a dream to create something truly transformative. Our mission is to guide beauty entrepreneurs through the intricate world of cosmetic product development with confidence, clarity, and creativity.

We understand that bringing a product to life can feel overwhelming. From researching the right active ingredients to ensuring regulatory compliance, the journey is filled with complex decisions. That's where we come in.

With years of scientific expertise and industry insight, we partner with you to turn your vision into high-performance, market-ready products that deliver on their claims. Our work blends innovation with precision — helping you build a brand that stands out in a competitive market while maintaining authenticity and trust.

Welcome to the beginning of your brand's next chapter.`,
    published: true,
    type: 'blog',
    link: '/book-consultation',
    buttonText: 'Book a consultation',
  },
  {
    id: 'blog-rd-services-rare-aesthetics',
    slug: 'our-comprehensive-rd-services',
    title: 'Our Comprehensive R&D Services',
    excerpt:
      'From ingredient research and formula creation to clinical validation and brand launch planning — a clear look at how we support your product journey.',
    category: 'R&D',
    date: '2026-11-21',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    content: `## Science-led support from concept to shelf

At Rare Aesthetics, we don't just formulate products — we help you build confidence in the science behind them. Our comprehensive R&D services are designed to support beauty founders at every milestone.

### What we offer

- **Ingredient and market technology research** to identify cutting-edge actives and trends.
- **Formula and sample creation** tailored to your brand's vision and goals.
- **Ingredient and formula safety evaluations** to ensure efficacy and compliance.
- **Formulation testing and clinical trials** to validate product performance.
- **Competitive trend analysis** to position your brand strategically.
- **Brand strategy and positioning**, media and marketing launch plans, and regulatory compliance to support your success from concept to shelf.
- **Quality management and reverse engineering** to refine, optimize, or replicate formulations.

Together, we'll create skincare innovations that are as effective as they are inspiring.`,
    published: true,
    type: 'blog',
    link: '/process',
    buttonText: 'Explore our process',
  },
  {
    id: 'blog-idea-to-market-ready',
    slug: 'from-idea-to-market-ready-skincare',
    title: 'From Idea to Market-Ready Skincare',
    excerpt:
      'Bringing a product to life can feel overwhelming. Here is how scientific partnership turns complex decisions into clear, confident progress.',
    category: 'Product Development',
    date: '2026-11-22',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80',
    content: `## Clarity through every complex decision

We understand that bringing a product to life can feel overwhelming. From researching the right active ingredients to ensuring regulatory compliance, the journey is filled with complex decisions.

That's where Rare Aesthetics comes in.

With years of scientific expertise and industry insight, we partner with you to turn your vision into high-performance, market-ready products that deliver on their claims. Our work blends innovation with precision — helping you build a brand that stands out in a competitive market while maintaining authenticity and trust.

### A partnership built for founders

Whether you are shaping your first formula or refining an existing range, we bring structure to the unknown: research, sampling, safety, testing, and launch readiness — so your brand can move forward with confidence.`,
    published: true,
    type: 'blog',
    link: '/book-consultation',
    buttonText: 'Start your project',
  },
  {
    id: 'blog-confidence-in-the-science',
    slug: 'building-confidence-in-the-science',
    title: 'Building Confidence in the Science Behind Your Brand',
    excerpt:
      'Formulation is only part of the story. Learn how Rare Aesthetics helps founders trust the science, claims, and craftsmanship behind every product.',
    category: 'Science & Trust',
    date: '2026-11-24',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=80',
    content: `## More than formulation

At Rare Aesthetics, we don't just formulate products — we help you build confidence in the science behind them.

That means pairing creative brand vision with rigorous ingredient research, careful safety evaluation, performance testing, and thoughtful positioning. The result is skincare that feels true to your story and credible in the market.

### Your next chapter starts here

Together, we'll create skincare innovations that are as effective as they are inspiring.

**Welcome to Rare Aesthetics** — where science meets beauty vision. Welcome to the beginning of your brand's next chapter.`,
    published: true,
    type: 'blog',
    link: '/book-consultation',
    buttonText: 'Book a consultation',
  },
];
