import { Calendar, Tag } from 'lucide-react';
import type { BlogPost } from '../lib/blogs';
import { formatDate } from '../lib/blogs';
import { Card, CardContent, CardHeader } from './ui/card';

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  const handleClick = () => {
    window.open(post.path, '_blank');
  };

  return (
    <Card
      className="group hover:-translate-y-1 cursor-pointer border-border/40 transition-all duration-200 hover:border-border/80 hover:shadow-lg"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          {post.category && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
                {post.category}
              </span>
            </div>
          )}
        </div>
        <h3 className="line-clamp-2 h-[45px] font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Click to read →</span>
          <span className="text-muted-foreground text-xs">{post.year}</span>
        </div>
      </CardContent>
    </Card>
  );
}
