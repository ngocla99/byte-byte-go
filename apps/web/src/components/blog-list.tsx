import { BookOpen, Filter, Search } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent">
            Byte Byte Go
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore our collection of technical articles covering system design,
          architecture, databases, and more.
        </p>
        <div className="text-muted-foreground text-sm">
          <span className="font-medium">{posts.length}</span> articles available
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            value={searchTerm}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                className="text-xs"
                key={category}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

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
    </div>
  );
}
