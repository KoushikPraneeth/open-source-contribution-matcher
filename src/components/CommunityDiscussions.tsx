
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ThumbsUp, MessageSquare, User, Calendar, Tag, Plus, Filter, Search, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DiscussionThread, DiscussionReply } from '@/types';

// Mock discussions data
const mockDiscussions: DiscussionThread[] = [
  {
    id: '1',
    title: 'How to find beginner-friendly React projects?',
    content: 'I\'m looking for React projects that are open to beginners. Any recommendations?',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2023-05-15T14:22:00Z',
    updatedAt: '2023-05-15T14:22:00Z',
    tags: ['React', 'Beginner', 'Open Source'],
    replies: [
      {
        id: 'r1',
        content: 'I would recommend checking out the "good first issue" tag on GitHub in React-based repositories.',
        authorId: 'user2',
        authorName: 'Michael Chen',
        authorAvatar: 'https://i.pravatar.cc/150?img=2',
        createdAt: '2023-05-15T15:30:00Z',
        likes: 3
      },
      {
        id: 'r2',
        content: 'Try looking at the React documentation repo, they often have issues marked for beginners and it\'s a great way to get started!',
        authorId: 'user3',
        authorName: 'Emma Williams',
        authorAvatar: 'https://i.pravatar.cc/150?img=3',
        createdAt: '2023-05-16T09:45:00Z',
        likes: 5
      }
    ],
    likes: 12,
    views: 89
  },
  {
    id: '2',
    title: 'Best practices for your first pull request',
    content: 'I\'m about to submit my first PR to an open source project. What are some best practices I should follow?',
    authorId: 'user4',
    authorName: 'Alex Thompson',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: '2023-05-14T10:15:00Z',
    updatedAt: '2023-05-14T10:15:00Z',
    tags: ['Pull Request', 'Best Practices', 'GitHub'],
    replies: [
      {
        id: 'r3',
        content: 'Make sure to read the contributing guidelines first, and keep your PR focused on a single issue or feature.',
        authorId: 'user5',
        authorName: 'Jessica Lee',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        createdAt: '2023-05-14T11:20:00Z',
        likes: 8
      }
    ],
    likes: 24,
    views: 142
  }
];

export default function CommunityDiscussions() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(mockDiscussions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [currentDiscussion, setCurrentDiscussion] = useState<DiscussionThread | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const allTags = Array.from(new Set(discussions.flatMap(d => d.tags)));
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = searchQuery === '' || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => discussion.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post",
        variant: "destructive"
      });
      return;
    }
    
    const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const newDiscussion: DiscussionThread = {
      id: `d${discussions.length + 1}`,
      title: newPost.title,
      content: newPost.content,
      authorId: currentUser?.id || 'anonymous',
      authorName: currentUser?.username || 'Anonymous',
      authorAvatar: currentUser?.avatarUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
      replies: [],
      likes: 0,
      views: 0
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    setNewPost({ title: '', content: '', tags: '' });
    setIsNewPostOpen(false);
    
    toast({
      title: "Success",
      description: "Your discussion post has been created"
    });
  };
  
  const handleReply = () => {
    if (!currentDiscussion || !replyContent.trim()) {
      return;
    }
    
    const newReply: DiscussionReply = {
      id: `r${currentDiscussion.replies.length + 1}`,
      content: replyContent,
      authorId: currentUser?.id || 'anonymous',
      authorName: currentUser?.username || 'Anonymous',
      authorAvatar: currentUser?.avatarUrl || '',
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const updatedDiscussion = {
      ...currentDiscussion,
      replies: [...currentDiscussion.replies, newReply],
      updatedAt: new Date().toISOString()
    };
    
    setDiscussions(discussions.map(d => 
      d.id === currentDiscussion.id ? updatedDiscussion : d
    ));
    
    setReplyContent('');
    toast({
      description: "Your reply has been posted"
    });
  };
  
  const handleLike = (discussionId: string) => {
    setDiscussions(discussions.map(d => 
      d.id === discussionId ? { ...d, likes: d.likes + 1 } : d
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-card border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Community Discussions</CardTitle>
              <CardDescription>
                Connect with other contributors and share your experiences
              </CardDescription>
            </div>
            
            <Button onClick={() => setIsNewPostOpen(true)} className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Topics</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map(discussion => (
                <Card key={discussion.id} className="overflow-hidden">
                  <div className="p-4 border-b flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.authorAvatar} />
                      <AvatarFallback>{discussion.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <h3 
                        className="font-medium hover:text-primary cursor-pointer"
                        onClick={() => setCurrentDiscussion(discussion)}
                      >
                        {discussion.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {discussion.authorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {discussion.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {discussion.replies.length}
                        </span>
                      </div>
                      
                      {discussion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {discussion.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs py-0 px-1.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleLike(discussion.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <h3 className="font-medium">No discussions found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery || selectedTags.length > 0 ? 
                    "Try adjusting your search filters" : 
                    "Be the first to start a discussion!"}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* New Discussion Dialog */}
      <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
            <DialogDescription>
              Start a conversation with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="What would you like to discuss?"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Share your thoughts or questions..."
                rows={5}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                placeholder="React, Beginners, Open Source"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags to help others find your discussion
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>
              Post Discussion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Discussion Details Dialog */}
      <Dialog open={!!currentDiscussion} onOpenChange={(open) => !open && setCurrentDiscussion(null)}>
        {currentDiscussion && (
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentDiscussion.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentDiscussion.authorAvatar} />
                  <AvatarFallback>{currentDiscussion.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {currentDiscussion.authorName} • {format(new Date(currentDiscussion.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </DialogHeader>
            
            <div className="py-4">
              <p className="whitespace-pre-line">{currentDiscussion.content}</p>
              
              <div className="flex flex-wrap gap-1 mt-4">
                {currentDiscussion.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {currentDiscussion.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {currentDiscussion.replies.length} replies
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleLike(currentDiscussion.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Like
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <h4 className="font-medium mb-4">
                {currentDiscussion.replies.length} Replies
              </h4>
              
              <div className="space-y-6">
                {currentDiscussion.replies.map(reply => (
                  <div key={reply.id} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.authorAvatar} />
                      <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{reply.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(reply.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm">{reply.content}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>
                    {currentUser?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleReply} 
                      disabled={!replyContent.trim()}
                      className="flex items-center gap-1"
                    >
                      <Send className="h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
