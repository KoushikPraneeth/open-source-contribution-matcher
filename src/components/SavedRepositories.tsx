
import React from 'react';
import { Repository } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, GitBranch, ExternalLink, Calendar, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import ShareDialog from './ShareDialog';

interface SavedRepositoriesProps {
  savedRepos: Array<{ 
    id: number; 
    date: string; 
    repository?: Repository;
  }>;
}

const SavedRepositories = ({ savedRepos }: SavedRepositoriesProps) => {
  const { toast } = useToast();
  const [shareRepo, setShareRepo] = React.useState<Repository | null>(null);
  
  const handleCopyRepoLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ description: "Repository link copied to clipboard!" });
  };
  
  if (!savedRepos || savedRepos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Repositories</CardTitle>
          <CardDescription>
            Repositories you've saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              You haven't saved any repositories yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Repositories</CardTitle>
          <CardDescription>
            Repositories you've saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {savedRepos.map((savedRepo) => {
              const repo = savedRepo.repository;
              if (!repo) return null;
              
              return (
                <div 
                  key={savedRepo.id}
                  className="flex flex-col p-4 rounded-lg hover:bg-muted transition-colors border"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      <a 
                        href={repo.url || repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {repo.full_name || repo.name}
                      </a>
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => window.open(repo.url || repo.html_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setShareRepo(repo)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {repo.description || "No description provided"}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{repo.stars || repo.stargazers_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <GitBranch className="h-4 w-4" />
                      <span>{repo.forks || 0}</span>
                    </div>
                    {repo.language && (
                      <Badge variant="outline">{repo.language}</Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Saved on {format(new Date(savedRepo.date), 'MMM d, yyyy')}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleCopyRepoLink(repo.url || repo.html_url || '')}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <ShareDialog 
        repository={shareRepo} 
        isOpen={!!shareRepo} 
        onClose={() => setShareRepo(null)} 
      />
    </>
  );
};

export default SavedRepositories;
