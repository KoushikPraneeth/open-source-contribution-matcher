
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, Bookmark, Eye, EyeOff, Share2 } from 'lucide-react';
import { RepositoryFeedbackType, Repository } from '@/types';
import { GitHubRepository } from '@/services/github';

interface RepositoryFeedbackButtonsProps {
  repositoryId: number;
  onFeedback: (type: RepositoryFeedbackType) => Promise<void>;
  onShare?: () => void;
  feedbackState?: {
    liked: boolean;
    disliked: boolean;
    saved: boolean;
    hidden: boolean;
  };
  repository?: Repository | GitHubRepository;
  size?: 'sm' | 'default';
  className?: string;
}

const RepositoryFeedbackButtons = ({
  repositoryId,
  onFeedback,
  onShare = () => {},
  feedbackState = {
    liked: false,
    disliked: false,
    saved: false,
    hidden: false
  },
  size = 'default',
  className = ''
}: RepositoryFeedbackButtonsProps) => {
  const { toast } = useToast();
  
  const handleFeedback = async (type: RepositoryFeedbackType) => {
    try {
      await onFeedback(type);
      
      const messages = {
        'like': feedbackState.liked ? 'Removed like from repository' : 'Repository liked! We\'ll show you more like this',
        'dislike': feedbackState.disliked ? 'Removed dislike from repository' : 'Repository disliked. We\'ll show fewer like this',
        'save': feedbackState.saved ? 'Repository removed from saved items' : 'Repository saved to your profile',
        'hide': feedbackState.hidden ? 'Repository unhidden' : 'Repository hidden from your recommendations'
      };
      
      toast({ description: messages[type] });
    } catch (error) {
      toast({ 
        title: 'Error',
        description: 'Failed to save your feedback',
        variant: 'destructive'
      });
    }
  };
  
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonSize}
              onClick={() => handleFeedback('like')}
            >
              <ThumbsUp className={`h-4 w-4 ${feedbackState.liked ? 'fill-current text-primary' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {feedbackState.liked ? 'Unlike repository' : 'Like repository'}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonSize}
              onClick={() => handleFeedback('dislike')}
            >
              <ThumbsDown className={`h-4 w-4 ${feedbackState.disliked ? 'fill-current text-primary' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {feedbackState.disliked ? 'Remove dislike' : 'Dislike repository'}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonSize}
              onClick={() => handleFeedback('save')}
            >
              <Bookmark className={`h-4 w-4 ${feedbackState.saved ? 'fill-current text-primary' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {feedbackState.saved ? 'Unsave repository' : 'Save repository'}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonSize}
              onClick={() => handleFeedback('hide')}
            >
              {feedbackState.hidden ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {feedbackState.hidden ? 'Unhide repository' : 'Hide repository'}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonSize}
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Share repository
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default RepositoryFeedbackButtons;
