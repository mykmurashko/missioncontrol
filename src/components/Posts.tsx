import { useState, useEffect } from 'react';
import type { Post } from '../types';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';

interface PostsProps {
  posts: Post[];
  isEditing: boolean;
  onUpdate: (posts: Post[]) => void;
  orgName: string;
}

export function Posts({ posts, isEditing, onUpdate, orgName: _orgName }: PostsProps) {
  const sectionTitle = 'updates';
  // Track local state for post content fields to prevent overwriting while editing
  const [localPostContent, setLocalPostContent] = useState<Record<string, string>>({});
  
  // Initialize local state from posts when entering edit mode or when new posts are added
  useEffect(() => {
    if (isEditing) {
      setLocalPostContent(prev => {
        const updated = { ...prev };
        posts.forEach(post => {
          // Only initialize if not already in local state (to preserve edits in progress)
          if (!(post.id in updated)) {
            updated[post.id] = post.content;
          }
        });
        return updated;
      });
    } else {
      // Clear local state when exiting edit mode
      setLocalPostContent({});
    }
  }, [isEditing, posts.map(p => p.id).join(',')]); // Track post IDs to detect new posts
  
  // Sync local state from props when NOT editing to get updates from other users
  useEffect(() => {
    if (!isEditing) {
      const contentMap: Record<string, string> = {};
      posts.forEach(post => {
        contentMap[post.id] = post.content;
      });
      setLocalPostContent(contentMap);
    }
  }, [posts, isEditing]);
  
  const updatePosts = (updater: (prev: Post[]) => Post[]) => {
    onUpdate(updater([...posts]));
  };

  const addPost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      content: 'New post',
      author: 'Author',
      timestamp: new Date().toISOString(),
    };
    updatePosts((prev) => [newPost, ...prev]);
  };

  const removePost = (id: string) => {
    // Clean up local content state for deleted post
    setLocalPostContent(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    // Remove post from list
    updatePosts((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    updatePosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Sort posts in reverse chronological order (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col p-6 relative">
      <h3 className="mb-4 text-[10px] font-sans uppercase tracking-widest text-orange-600 dark:text-orange-500 font-bold">
        {sectionTitle.toUpperCase()}
      </h3>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {sortedPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 dark:border-white/10 p-3 bg-white dark:bg-transparent rounded-none">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={post.author}
                      onChange={(e) => updatePost(post.id, { author: e.target.value })}
                      className="text-[10px] font-bold h-7"
                      placeholder="Author"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePost(post.id)}
                      className="ml-2 h-5 w-5 p-0 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={localPostContent[post.id] ?? post.content}
                    onChange={(e) => {
                      setLocalPostContent(prev => ({ ...prev, [post.id]: e.target.value }));
                    }}
                    onBlur={() => {
                      const content = localPostContent[post.id];
                      if (content !== undefined && content !== post.content) {
                        updatePost(post.id, { content });
                      }
                    }}
                    className="min-h-[40px] resize-none text-[10px]"
                    placeholder="Post content"
                  />
                  <Input
                    type="datetime-local"
                    value={new Date(post.timestamp).toISOString().slice(0, 16)}
                    onChange={(e) =>
                      updatePost(post.id, { timestamp: new Date(e.target.value).toISOString() })
                    }
                    className="text-[10px] font-sans h-7"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white font-sans tracking-tight">{post.author}</span>
                    <span className="text-[9px] text-gray-600 dark:text-neutral-400 font-sans">{formatTimestamp(post.timestamp)}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-600 dark:text-neutral-400 font-sans">{post.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addPost}
            className="mt-3 w-full text-[10px] h-7"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Post
          </Button>
        )}
      </div>
      {/* COMING SOON Banner */}
      <div className="absolute bottom-4 right-4 bg-yellow-500 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 px-3 py-1.5 text-[9px] font-sans tracking-widest font-bold">
        slack channel integration coming soon
      </div>
    </div>
  );
}

