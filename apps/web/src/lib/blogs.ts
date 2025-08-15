export type BlogPost = {
  id: string;
  title: string;
  date: Date;
  year: string;
  slug: string;
  path: string;
  category?: string;
};

// Extract all blog posts from the public/blogs directory structure
export function getAllBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(getBlogPosts());
}

// Define the blog files manually since we're in a static context
// In a real app, you might use a build-time script to generate this
const blogFiles = [
  // 2025
  '2025/250116 From Monolith to Microservices - Key Transition Patterns.html',
  '2025/250109 Understanding Message Queues.html',
  "2025/250102 Kubernetes Made Easy - A Beginner's Roadmap to Container Orchestration.html",

  // 2024
  '2024/241219 The Sidecar Pattern Explained - Decoupling Operational Features.html',
  '2024/241212 Database Performance Demystified - Essential Tips and Strategies.html',
  '2024/241205 Mastering Modern Authentication - Cookies, Sessions, JWT, and PASETO.html',
  '2024/241128 Stateless Architecture - The Key to Building Scalable and Resilient Systems.html',
  '2024/241121 Distributed Caching - The Secret to High-Performance Applications.html',
  '2024/241114 Speedrunning Guide - Junior to Staff Engineer in 3 years.html',
  '2024/241107 A Pattern Every Modern Developer Should Know - CQRS.html',
  '2024/241031 Why Executives Seem Out of Touch, and How to Reach Them.html',
  '2024/241024 Event-Driven Architectural Patterns.html',
  '2024/241017 Data Sharing Between Microservices.html',
  "2024/241010 CAP, PACELC, ACID, BASE - Essential Concepts for an Architect's Toolkit.html",
  '2024/241003 API Gateway.html',
  '2024/240926 Software Architecture Patterns.html',
  '2024/240919 The Saga Pattern.html',
  '2024/240912 Infrastructure as Code.html',
  '2024/240905 A Crash Course on Scaling the Data Layer.html',
  '2024/240829 A Crash Course on Load Balancers for Scaling.html',
  '2024/240822 A Crash Course on Scaling the API Layer.html',
  '2024/240815 A Crash Course on Architectural Scalability.html',
  '2024/240808 A Crash Course on Microservices Design Patterns.html',
  '2024/240801 A Crash Course on Domain-Driven Design.html',
  '2024/240725 Tidying Code.html',
  '2024/240718 A Crash Course on Relational Database Design.html',
  '2024/240711 A Crash Course on Distributed Systems.html',
  '2024/240704 A Crash Course in Database Scaling Strategies.html',
  '2024/240627 A Crash Course in Database Sharding.html',
  '2024/240620 A Crash Course on Microservice Communication Patterns.html',
  '2024/240613 A Crash Course on Cell-based Architecture.html',
  '2024/240606 A Crash Course on Content-Delivery Networks (CDN).html',
  '2024/240530 A Crash Course on REST APIs.html',
  '2024/240523 API Security Best Practices.html',
  '2024/240516 A Crash Course in GraphQL.html',
  '2024/240509 HTTP1 vs HTTP2 vs HTTP3 - A Deep Dive.html',
  '2024/240502 Unlocking the Power of SQL Queries for Improved Performance.html',
  '2024/240425 What Happens When a SQL is Executed.html',
  '2024/240418 A Crash Course in API Versioning Strategies.html',
  '2024/240411 Embracing Chaos to Improve System Resilience - Chaos Engineering.html',
  '2024/240404 A Crash Course in CICD.html',
  '2024/240328 A Crash Course in IPv4 Addressing.html',
  '2024/240321 A Brief History of Scaling Netflix.html',
  '2024/240314 15 Open-Source Projects That Changed the World.html',
  '2024/240307 The Top 3 Resume Mistakes Costing You the Job.html',
  '2024/240229 How Video Recommendations Work - Part 1.html',
  '2024/240222 How to Design a Good API.html',
  '2024/240215 Virtualization and Containerization - Which one to pick.html',
  '2024/240208 How do We Design for High Availability.html',
  '2024/240201 Good Code vs Bad Code.html',
  '2024/240125 Mastering Design Principles - SOLID.html',
  '2024/240118 A Crash Course in Networking.html',
  '2024/240111 Netflix - What Happens When You Press Play - Part 2.html',
  '2024/240104 Netflix - What Happens When You Press Play.html',

  // 2023
  '2023/231221 6 More Microservices Interview Questions.html',
  '2023/231214 7 Microservices Interview Questions.html',
  '2023/231207 How the Internet Stays Connected.html',
  '2023/231130 Unlock Highly Relevant Search with AI.html',
  '2023/231116 Serverless Has Servers.html',
  '2023/231109 A Crash Course in Docker.html',
  '2023/231107 Shipping to Production.html',
  '2023/231102 Kubernetes - When and How to Apply It.html',
  '2023/231026 A Crash Course in Kubernetes.html',
  '2023/231019 Redis Can Do More Than Caching.html',
  '2023/231012 The 6 Most Impactful Ways Redis is Used in Production Systems.html',
  '2023/231010 The Tech Promotion Algorithm - A Structured Guide to Moving Up.html',
  '2023/231005 No More Vendor Lock-In - The Rise of Sky Computing.html',
  '2023/230930 A Crash Course in DNS.html',
  '2023/230921 A Crash Course in Redis.html',
  '2023/230914 Why is Kafka so fast - How does it work.html',
  '2023/230907 How to Choose a Replication Strategy.html',
  '2023/230831 Data Replication - A Key Component for Building Large-Scale Distributed Systems.html',
  '2023/230824 Common Failure Causes.html',
  '2023/230817 How to Choose a Message Queue.html',
  '2023/230810 Why Do We Need a Message Queue.html',
  '2023/230803 Database Indexing Strategies - Part 2.html',
  '2023/230727 I Was Under Leveled - Avoiding the Tragedy of Making Only 500k a Year.html',
  '2023/230720 Network Protocols behind Server Push, Online Gaming, and Emails.html',
  '2023/230713 The Foundation of REST API - HTTP.html',
  '2023/230706 Database Indexing Strategies.html',
  '2023/230629 Capacity Planning.html',
  '2023/230622 Everything You Always Wanted to Know About TCP But Too Afraid to Ask.html',
  '2023/230615 Network Protocols Run the Internet.html',
  '2023/230608 Rate Limiter For The Real World.html',
  '2023/230606 How to Build a Smart Chatbot in 10 mins with LangChain.html',
  '2023/230531 Rate Limiting Fundamentals.html',
  '2023/230524 API redesign - shopping cart and Stripe payment.html',
  '2023/230517 Design Effective and Secure REST APIs.html',
  '2023/230510 Mastering the Art of API Design.html',
  '2023/230503 Key Steps in the Database Selection Process.html',
  '2023/230426 Factors to Consider in Database Selection.html',
  '2023/230419 Understanding Database Types.html',
  '2023/230412 Password, Session, Cookie, Token, JWT, SSO, OAuth - Authentication Explained - Part 2.html',
  '2023/230405 Password, Session, Cookie, Token, JWT, SSO, OAuth - Authentication Explained - Part 1.html',
  '2023/230329 A Crash Course in Caching - Final Part.html',
  '2023/230322 A Crash Course in Caching - Part 2.html',
  '2023/230315 A Crash Course in Caching - Part 1.html',
  '2023/230301 From 0 to Millions - A Guide to Scaling Your App - Part 3.html',
  '2023/230222 From 0 to Millions - A Guide to Scaling Your App - Part 2.html',
  '2023/230215 From 0 to Millions - A Guide to Scaling Your App - Part 1.html',
];

function getBlogPosts(): BlogPost[] {
  const blogPosts: BlogPost[] = [];

  for (const filePath of blogFiles) {
    const fileName = filePath.split('/')[1]; // Get filename without year folder
    const match = fileName.match(/^(\d{6})\s+(.+)\.html$/);

    if (match) {
      const [, dateStr, title] = match;
      const year = dateStr.substring(0, 2);
      const month = dateStr.substring(2, 4);
      const day = dateStr.substring(4, 6);

      // Convert YY to full year (assuming 2000s)
      const fullYear =
        year.startsWith('0') || year.startsWith('1') || year.startsWith('2')
          ? `20${year}`
          : `19${year}`;

      const date = new Date(`${fullYear}-${month}-${day}`);
      const id = `${fullYear}${month}${day}`;
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      blogPosts.push({
        id,
        title,
        date,
        year: fullYear,
        slug,
        path: `/blogs/${filePath}`,
        category: getCategoryFromTitle(title),
      });
    }
  }

  // Sort by date descending (newest first)
  return blogPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes('microservice') ||
    lowerTitle.includes('architecture')
  ) {
    return 'Architecture';
  }
  if (lowerTitle.includes('database') || lowerTitle.includes('sql')) {
    return 'Database';
  }
  if (
    lowerTitle.includes('api') ||
    lowerTitle.includes('rest') ||
    lowerTitle.includes('graphql')
  ) {
    return 'API';
  }
  if (lowerTitle.includes('cache') || lowerTitle.includes('redis')) {
    return 'Caching';
  }
  if (
    lowerTitle.includes('kubernetes') ||
    lowerTitle.includes('docker') ||
    lowerTitle.includes('infrastructure')
  ) {
    return 'DevOps';
  }
  if (
    lowerTitle.includes('auth') ||
    lowerTitle.includes('security') ||
    lowerTitle.includes('jwt')
  ) {
    return 'Security';
  }
  if (
    lowerTitle.includes('scale') ||
    lowerTitle.includes('scaling') ||
    lowerTitle.includes('performance')
  ) {
    return 'Performance';
  }
  if (
    lowerTitle.includes('network') ||
    lowerTitle.includes('tcp') ||
    lowerTitle.includes('http')
  ) {
    return 'Networking';
  }
  if (
    lowerTitle.includes('career') ||
    lowerTitle.includes('engineer') ||
    lowerTitle.includes('resume')
  ) {
    return 'Career';
  }
  if (lowerTitle.includes('netflix') || lowerTitle.includes('video')) {
    return 'Case Study';
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

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
