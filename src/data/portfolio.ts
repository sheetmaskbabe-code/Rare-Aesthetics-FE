export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imagePublicId?: string;
  published: boolean;
  link?: string;
  buttonText?: string;
};

export const defaultPortfolio: PortfolioItem[] = [];

export const portfolioCategories = [
  'All',
  'Skincare',
  'Packaging',
  'Brand Development',
  'Product Launch',
  'Formulation',
] as const;
