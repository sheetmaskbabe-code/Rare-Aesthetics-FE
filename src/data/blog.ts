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
};

export const defaultBlogPosts: BlogPost[] = [];
