
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, BookmarkPlus, XCircle, Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import ShareDialog from './ShareDialog';
import { GitHubRepository } from '@/services/github';
import { useAuth } from '@/contexts/AuthContext';

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
  const { currentUser, updateUserProfile } = useAuth();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [userFeedback, setUserFeedback] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  
  // Check if the repo is already saved
  useEffect(() => {
    if (currentUser?.savedRepositories) {
      const isSaved = currentUser.savedRepositories.some(
        repo => repo.id === repositoryId
      );
      setSaved(isSaved);
    }
  }, [currentUser, repositoryId]);
  
  const handleFeedback = async (type: 'like' | 'dislike' | 'save' | 'hide') => {
    // Call the parent component's feedback handler
    onFeedback(repositoryId, type);
    
    // If the feedback is 'save', update the user's saved repositories
    if (type === 'save' && currentUser) {
      // Toggle saved status
      if (saved) {
        // Remove from saved repositories
        const updatedSavedRepos = currentUser.savedRepositories?.filter(
          repo => repo.id !== repositoryId
        ) || [];
        
        try {
          await updateUserProfile({
            ...currentUser,
            savedRepositories: updatedSavedRepos
          });
          setSaved(false);
        } catch (error) {
          console.error("Failed to remove repository from saved list:", error);
        }
        
        toast({ description: "Repository removed from saved list." });
      } else {
        // Add to saved repositories
        const updatedSavedRepos = [
          ...(currentUser.savedRepositories || []),
          { id: repositoryId, date: new Date().toISOString() }
        ];
        
        try {
          await updateUserProfile({
            ...currentUser,
            savedRepositories: updatedSavedRepos
          });
          setSaved(true);
        } catch (error) {
          console.error("Failed to save repository:", error);
        }
        
        toast({ description: "Repository saved for later." });
      }
    } else {
      // Set active feedback state for like/dislike
      if (type === 'like' || type === 'dislike') {
        if (userFeedback === type) {
          // Toggle off if clicking the same button
          setUserFeedback(null);
        } else {
          setUserFeedback(type);
        }
      }
      
      // Show appropriate toast messages
      const messages = {
        like: "You liked this repository. We'll show more like this!",
        dislike: "You disliked this repository. We'll show fewer like this.",
        save: saved ? "Repository removed from saved list." : "Repository saved for later.",
        hide: "Repository hidden. We won't show it again."
      };
      
      toast({ description: messages[type] });
    }
  };
  
  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        <Button 
          variant={userFeedback === 'like' ? "default" : "ghost"} 
          size="icon" 
          className={cn("h-8 w-8 rounded-full", userFeedback === 'like' ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800" : "")} 
          onClick={() => handleFeedback('like')}
          title="I like this"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={userFeedback === 'dislike' ? "default" : "ghost"} 
          size="icon" 
          className={cn("h-8 w-8 rounded-full", userFeedback === 'dislike' ? "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800" : "")} 
          onClick={() => handleFeedback('dislike')}
          title="Not relevant"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={saved ? "default" : "ghost"} 
          size="icon" 
          className={cn("h-8 w-8 rounded-full", saved ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800" : "")} 
          onClick={() => handleFeedback('save')}
          title={saved ? "Saved" : "Save for later"}
        >
          {saved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
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
