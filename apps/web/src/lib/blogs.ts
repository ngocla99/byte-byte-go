import { compareDesc, format, isValid, parse } from 'date-fns';

export type BlogPost = {
  id: string;
  title: string;
  date: Date;
  year: string;
  slug: string;
  path: string;
  category?: string;
};

// Automatically discover blog files using Vite's import.meta.glob
// This will find all .html files in the public/blogs directory at build time
const blogFilesGlob = import.meta.glob('/public/blogs/**/*.html', {
  eager: false,
  as: 'url',
});

const BLOG_FILENAME_REGEX = /^(\d{6})\s+(.+)\.html$/;
const YEAR_START = 0;
const YEAR_END = 2;
const MONTH_START = 2;
const MONTH_END = 4;
const DAY_START = 4;
const DAY_END = 6;

const CATEGORY_KEYWORDS = {
  Architecture: ['microservice', 'architecture'],
  Database: ['database', 'sql'],
  API: ['api', 'rest', 'graphql'],
  Caching: ['cache', 'redis'],
  DevOps: ['kubernetes', 'docker', 'infrastructure'],
  Security: ['auth', 'security', 'jwt', 'authentication'],
  Performance: ['scale', 'scaling', 'performance', 'optimization'],
  Networking: ['network', 'tcp', 'http', 'networking'],
  Career: ['career', 'engineer', 'resume', 'job'],
  'Case Study': ['netflix', 'video', 'case study'],
};

// Extract all blog posts from the public/blogs directory structure
export function getAllBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(getBlogPosts());
}

function getBlogPosts(): BlogPost[] {
  const blogFilePaths = Object.keys(blogFilesGlob);
  const blogPosts = blogFilePaths
    .map(parseBlogFile)
    .filter((post): post is BlogPost => post !== null);

  return blogPosts.sort((a, b) => compareDesc(a.date, b.date));
}

function parseBlogFile(fullPath: string): BlogPost | null {
  const relativePath = fullPath.replace('/public/blogs/', '');
  const fileName = relativePath.split('/')[1];
  const match = fileName.match(BLOG_FILENAME_REGEX);

  if (!match) return null;

  const [, dateStr, title] = match;
  const year = dateStr.substring(YEAR_START, YEAR_END);
  const month = dateStr.substring(MONTH_START, MONTH_END);
  const day = dateStr.substring(DAY_START, DAY_END);

  const fullYear =
    year.startsWith('0') || year.startsWith('1') || year.startsWith('2')
      ? `20${year}`
      : `19${year}`;

  const date = parse(`${fullYear}${month}${day}`, 'yyyyMMdd', new Date());

  if (!isValid(date)) return null;

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  return {
    id: `${fullYear}${month}${day}`,
    title,
    date,
    year: format(date, 'yyyy'),
    slug,
    path: `/blogs/${relativePath}`,
    category: getCategoryFromTitle(title),
  };
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowerTitle.includes(keyword))) {
      return category;
    }
  }

  return 'General';
}

export function getUniqueCategories(posts: BlogPost[]): string[] {
  const categories = new Set(posts.map((post) => post.category || 'General'));
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export function filterPostsByCategory(
  posts: BlogPost[],
  category: string
): BlogPost[] {
  if (category === 'All') {
    return posts;
  }
  return posts.filter((post) => post.category === category);
}

export function filterPostsBySearch(
  posts: BlogPost[],
  search: string
): BlogPost[] {
  if (!search.trim()) {
    return posts;
  }
  const searchLower = search.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchLower) ||
      post.category?.toLowerCase().includes(searchLower)
  );
}

// Re-export formatDate from date utils for convenience
export { formatDate } from './date';
