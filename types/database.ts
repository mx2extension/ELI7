export type Program = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  location: string;
  status: 'active' | 'upcoming' | 'completed';
  featured: boolean;
  hero_image: string | null;
  impact_summary: string | null;
  people_reached: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  location: string;
  status: 'active' | 'upcoming' | 'completed';
  featured: boolean;
  hero_image: string | null;
  impact_summary: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type ImpactStat = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  display_order: number;
  active: boolean;
};

export type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
  display_order: number;
};