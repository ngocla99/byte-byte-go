import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BlogList } from '../components/blog-list';
import Loader from '../components/loader';
import type { BlogPost } from '../lib/blogs';
import { getAllBlogPosts } from '../lib/blogs';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const blogPosts = await getAllBlogPosts();
        setPosts(blogPosts);
      } catch {
        // eslint-disable-next-line no-console
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <BlogList posts={posts} />
    </div>
  );
}
