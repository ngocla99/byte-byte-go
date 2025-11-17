# Byte Byte Go

A modern, feature-rich blog platform focused on software engineering and system design topics. Built with React 19, TypeScript, and TanStack Router, Byte Byte Go delivers a fast, accessible, and beautiful reading experience.

## Features

### Blog Management
- **Static Blog Generation** - Blogs stored as HTML files in `/public/blogs` organized by year
- **Automatic Discovery** - Files auto-detected using Vite's `import.meta.glob()`
- **Smart Metadata Extraction** - Date and title parsed from filename (`YYMMDD Title.html`)
- **Intelligent Image Preview** - Automatically extracts meaningful images from blog content

### Search & Discovery
- **Full-Text Search** - Search across blog titles and categories
- **Category Filtering** - 9 predefined categories including:
  - System Design
  - Microservices & Distributed Systems
  - Performance & Scaling
  - API Design
  - Database
  - DevOps & Infrastructure
  - Security & Networking
  - Code Quality
  - Career & Engineering
- **Dynamic Category Detection** - Automatic category assignment based on keywords
- **Active Filter Display** - Visual feedback with clear functionality

### User Experience
- **Dark/Light Mode** - Theme toggle with preference persistence
- **Responsive Design** - Mobile-first with adaptive layouts (1/2/3 column grid)
- **Progressive Web App** - Installable with offline support
- **Smooth Animations** - Polished interactions and transitions
- **Accessible** - ARIA labels, semantic HTML, and proper color contrast

## Tech Stack

### Frontend & Core
- **React 19.0.0** - Latest React with modern features
- **TypeScript 5.8.3** - Strict type safety throughout
- **Vite 6.2.2** - Lightning-fast build tool with HMR
- **TanStack Router 1.114.25** - Type-safe file-based routing

### Styling & UI
- **TailwindCSS 4.0.15** - Utility-first CSS framework
- **shadcn/ui** - Pre-built, customizable components
- **Lucide React 0.473.0** - Modern icon library
- **next-themes 0.4.6** - Theme management

### State & Data
- **TanStack React Query 5.80.5** - Server state management
- **React Hook Form 5.1.1** - Lightweight form handling
- **Zod 4.0.2** - TypeScript-first validation
- **date-fns 4.1.0** - Date utilities

### Build & Quality
- **Turborepo 2.5.4** - Monorepo orchestration
- **Biome 2.2.0** - Fast linting and formatting
- **Husky 9.1.7** - Git hooks
- **lint-staged 16.1.2** - Pre-commit checks

## Getting Started

### Prerequisites
- **Node.js** 18+
- **pnpm** 10.13.1+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd byte-byte-go

# Install dependencies
pnpm install
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start only the web application (port 3001)
pnpm dev:web

# Build all applications
pnpm build

# Type check
pnpm check-types

# Lint and format
pnpm check
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

### Adding Blog Posts

#### Automated Sync (Recommended)

The repository includes an **automated sync system** that fetches ByteByteGo blog posts directly from Gmail:

- 🤖 **Fully Automated** - Runs daily via GitHub Actions
- 📧 **Gmail Integration** - Fetches posts from your ByteByteGo subscription emails
- 🆓 **100% Free** - Uses only free-tier services (Gmail API, GitHub Actions)
- 📁 **Auto-organized** - Saves to correct year folders with proper naming

**Setup:** See [AUTOMATION_SETUP.md](docs/AUTOMATION_SETUP.md) for detailed instructions.

**Quick start:**
```bash
cd scripts
pnpm install
pnpm run auth          # One-time: Get Gmail credentials
pnpm run sync:dry-run  # Test the sync
pnpm run sync          # Sync new blogs
```

#### Manual Method

1. Create an HTML file in `apps/web/public/blogs/YYYY/` (e.g., `apps/web/public/blogs/2023/`)
2. Name the file using the format: `YYMMDD Title.html` (e.g., `231215 Understanding Microservices.html`)
3. The blog will automatically appear with:
   - Date extracted from filename
   - Title extracted from filename
   - Category auto-assigned based on keywords
   - First meaningful image extracted for preview

## Project Structure

```
byte-byte-go/
├── apps/
│   └── web/                      # Main React application
│       ├── public/
│       │   ├── blogs/            # Blog HTML files organized by year
│       │   │   └── 2023/         # Year-organized blogs
│       │   └── logo.png          # App logo
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── ui/           # shadcn/ui components
│       │   │   ├── blog-list.tsx # Blog listing with search/filter
│       │   │   ├── blog-card.tsx # Blog preview card
│       │   │   ├── header.tsx    # Site header
│       │   │   └── ...
│       │   ├── routes/           # TanStack Router routes
│       │   │   ├── __root.tsx    # Root layout
│       │   │   └── index.tsx     # Home page
│       │   ├── lib/              # Utility functions
│       │   │   ├── blogs.ts      # Blog parsing and filtering
│       │   │   ├── constants.ts  # Category keywords
│       │   │   ├── date.ts       # Date formatting
│       │   │   └── image-extractor.ts # Image extraction logic
│       │   ├── main.tsx          # React entry point
│       │   └── index.css         # Global styles + theme vars
│       ├── vite.config.ts        # Vite configuration
│       ├── tsconfig.json         # TypeScript config
│       ├── package.json          # Dependencies and scripts
│       ├── components.json       # shadcn/ui config
│       └── vercel.json           # Vercel deployment config
├── package.json                  # Monorepo root
├── pnpm-workspace.yaml           # PNPM workspace config
├── turbo.json                    # Turborepo config
└── biome.json                    # Linting/formatting config
```

## Available Scripts

### Monorepo Commands
```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps (Turbo optimized)
pnpm dev:web          # Start only web app on port 3001
pnpm check-types      # TypeScript type checking
pnpm check            # Biome linting and formatting
```

### Web App Commands (in `apps/web/`)
```bash
pnpm dev                    # Vite dev server (port 3001)
pnpm build                  # Production build
pnpm serve                  # Preview production build
pnpm check-types            # TypeScript type check
pnpm generate-pwa-assets    # Generate PWA icons
```

## Deployment

The application is optimized for Vercel deployment with:
- Aggressive caching for immutable assets (1 year)
- HTML with must-revalidate for freshness
- Separate headers for images, fonts, and static files
- Manual code splitting (vendor, router, app chunks)

### Deploy to Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

## Architecture

### Data Flow
1. User lands on home page (`/`)
2. `getAllBlogPosts()` discovers blogs via `import.meta.glob()`
3. Blog metadata parsed from filenames
4. Categories auto-assigned via keyword matching
5. Images extracted from HTML content
6. BlogList displays filtered/searched results
7. Click opens full blog in new tab

### Component Structure
- **Layout**: Header, ThemeProvider, Root layout
- **Features**: BlogList, BlogCard, Search/Filter UI
- **UI**: Reusable shadcn/ui components (Button, Input, Card, etc.)
- **Utilities**: Blog parsing, image extraction, date formatting

### Styling Approach
- Tailwind utility classes with custom theme variables
- OKLch color space for accessible theming
- CSS custom properties for dark/light mode
- Mobile-first responsive design

## Code Quality

- **TypeScript Strict Mode** - Full type safety
- **Biome** - Fast linting and formatting with Ultracite rules
- **Git Hooks** - Pre-commit checks with Husky
- **Type-Safe Routing** - TanStack Router with full inference
- **Runtime Validation** - Zod schemas for data validation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using React 19, TypeScript, and TanStack Router
