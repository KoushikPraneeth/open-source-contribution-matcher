
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, BookmarkPlus, XCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ShareDialog from './ShareDialog';
import { GitHubRepository } from '@/services/github';

export interface RepositoryFeedbackProps {
  repositoryId: number;
  repository?: GitHubRepository;
  onFeedback: (repoId: number, feedbackType: 'like' | 'dislike' | 'save' | 'hide') => void;
  className?: string;
}

export default function RepositoryFeedbackButtons({ 
  repositoryId, 
  repository,
  onFeedback,
  className 
}: RepositoryFeedbackProps) {
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const handleFeedback = (type: 'like' | 'dislike' | 'save' | 'hide') => {
    onFeedback(repositoryId, type);
    
    const messages = {
      like: "You liked this repository. We'll show more like this!",
      dislike: "You disliked this repository. We'll show fewer like this.",
      save: "Repository saved for later.",
      hide: "Repository hidden. We won't show it again."
    };
    
    toast({ description: messages[type] });
  };
  
  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => handleFeedback('like')}
          title="I like this"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => handleFeedback('dislike')}
          title="Not relevant"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => handleFeedback('save')}
          title="Save for later"
        >
          <BookmarkPlus className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => handleFeedback('hide')}
          title="Not interested"
        >
          <XCircle className="h-4 w-4" />
        </Button>
        
        {repository && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => setShareDialogOpen(true)}
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {repository && (
        <ShareDialog 
          repository={repository} 
          isOpen={shareDialogOpen} 
          onClose={() => setShareDialogOpen(false)} 
        />
      )}
    </>
  );
}
