import { BookOpen, Filter, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BlogPost } from '../lib/blogs';
import {
  filterPostsByCategory,
  filterPostsBySearch,
  getUniqueCategories,
} from '../lib/blogs';
import { BlogCard } from './blog-card';
import { Button } from './ui/button';
import { Input } from './ui/input';

type BlogListProps = {
  posts: BlogPost[];
};

function BlogHeader() {
  return (
    <div className="space-y-4 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent">
          Byte Byte Go
        </h1>
      </div>
    </div>
  );
}

function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  posts,
  hasActiveFilters,
  clearFilters,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  posts: BlogPost[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className="space-y-6 rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative mx-auto max-w-md flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
          <Input
            className="rounded-xl border-2 py-3 pr-4 pl-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title, topic, or keyword..."
            value={searchTerm}
          />
          {searchTerm && (
            <Button
              className="-translate-y-1/2 absolute top-1/2 right-2 h-7 w-7 p-0 hover:bg-muted"
              onClick={() => setSearchTerm('')}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">Filter by Category</span>
            <div className="text-muted-foreground text-sm">
              {posts.length} articles available
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              className="text-muted-foreground text-xs hover:text-foreground"
              onClick={clearFilters}
              size="sm"
              variant="ghost"
            >
              <X className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              className={`rounded-lg px-3 py-2 font-medium text-xs transition-all duration-200 ${
                selectedCategory === category
                  ? 'scale-105 bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'hover:scale-105 hover:bg-muted hover:shadow-md'
              }
                `}
              key={category}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
            >
              {category}
              {category !== 'All' && (
                <span className="ml-2 text-xs opacity-70">
                  {filterPostsByCategory(posts, category).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-border/50 border-t pt-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Active filters:</span>
            <div className="flex items-center gap-2">
              {searchTerm && (
                <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    className="rounded p-0.5 hover:bg-primary/20"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedCategory !== 'All' && (
                <div className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-blue-600">
                  <span>Category: {selectedCategory}</span>
                  <button
                    className="rounded p-0.5 hover:bg-blue-500/20"
                    onClick={() => setSelectedCategory('All')}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogResults({
  filteredPosts,
  searchTerm,
  selectedCategory,
}: {
  filteredPosts: BlogPost[];
  searchTerm: string;
  selectedCategory: string;
}) {
  return (
    <>
      {/* Results count */}
      {(searchTerm || selectedCategory !== 'All') && (
        <div className="text-muted-foreground text-sm">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}{' '}
          found
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      )}

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="space-y-2 text-muted-foreground">
            <p className="text-lg">No articles found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function BlogList({ posts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    return ['All', ...getUniqueCategories(posts)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = filterPostsByCategory(posts, selectedCategory);
    filtered = filterPostsBySearch(filtered, searchTerm);
    return filtered;
  }, [posts, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const hasActiveFilters = Boolean(searchTerm) || selectedCategory !== 'All';

  return (
    <div className="space-y-6">
      <BlogHeader />

      <SearchAndFilters
        categories={categories}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        posts={posts}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        setSearchTerm={setSearchTerm}
        setSelectedCategory={setSelectedCategory}
      />

      <BlogResults
        filteredPosts={filteredPosts}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
