
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitHubRepository } from '@/services/github';
import { Copy, Twitter, Linkedin, Facebook, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  repository: GitHubRepository | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog = ({ repository, isOpen, onClose }: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  if (!repository) return null;
  
  const shareUrl = repository.html_url;
  const shareTitle = `Check out this open source project: ${repository.full_name}`;
  const shareText = repository.description ? 
    `${shareTitle} - ${repository.description}` : 
    shareTitle;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ description: "Link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShareSocial = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Repository</DialogTitle>
          <DialogDescription>
            Share this repository with your network
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-muted rounded-md mb-4">
          <h3 className="font-medium text-base">{repository.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{repository.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">{repository.language || 'No language'}</span>
            <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">⭐ {repository.stargazers_count}</span>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <div className="flex items-center gap-2">
              <Input
                id="link"
                value={shareUrl}
                readOnly
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShareSocial('twitter')}
              title="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShareSocial('linkedin')}
              title="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShareSocial('facebook')}
              title="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
