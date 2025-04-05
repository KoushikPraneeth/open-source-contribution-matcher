
import React from 'react';
import { User } from '@/types';
import { Github, Link2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GithubConnectionStatusProps {
  user: User;
}

const GithubConnectionStatus = ({ user }: GithubConnectionStatusProps) => {
  const { connectGithub } = useAuth();
  const { toast } = useToast();
  
  const handleConnectGithub = async () => {
    if (!connectGithub) {
      toast({
        title: "Error",
        description: "GitHub connection functionality is not available",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await connectGithub();
      toast({
        title: "Success",
        description: "Your GitHub account has been connected"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect GitHub account",
        variant: "destructive"
      });
    }
  };
  
  if (user.isGithubConnected && user.githubUsername) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">GitHub</h3>
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Connected</span>
          <a 
            href={`https://github.com/${user.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1 ml-2"
          >
            {user.githubUsername}
            <Link2 className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">GitHub</h3>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm">Not connected</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          onClick={handleConnectGithub}
        >
          <Github className="h-4 w-4 mr-2" />
          Connect GitHub
        </Button>
      </div>
    </div>
  );
};

export default GithubConnectionStatus;
