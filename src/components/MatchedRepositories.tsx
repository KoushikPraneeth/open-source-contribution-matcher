
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Github, Star, GitFork, ArrowRight, Code2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGitHub } from '@/hooks/useGitHub';
import { useAuth } from '@/contexts/AuthContext';
import { GitHubRepository } from '@/services/github';
import { format } from 'date-fns';
import { Skill } from '@/types';
import RepositoryFeedbackButtons from './RepositoryFeedbackButtons';

export default function MatchedRepositories() {
  const { currentUser } = useAuth();
  const { getMatchedRepositories, isLoading } = useGitHub();
  const { toast } = useToast();
  const [matchedRepos, setMatchedRepos] = useState<GitHubRepository[]>([]);
  const [minMatchScore, setMinMatchScore] = useState<number>(60);
  const [hiddenRepoIds, setHiddenRepoIds] = useState<number[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      loadMatchedRepos();
    }
  }, [currentUser, minMatchScore]);
  
  const loadMatchedRepos = async () => {
    if (!currentUser?.skills || !currentUser?.experienceLevel) {
      toast({
        title: "Profile incomplete",
        description: "Please complete your skills profile to get personalized repository matches.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const repos = await getMatchedRepositories(
        currentUser.skills,
        currentUser.experienceLevel,
        minMatchScore
      );
      
      // Filter out hidden repositories
      const filteredRepos = repos.filter(repo => !hiddenRepoIds.includes(repo.id));
      setMatchedRepos(filteredRepos);
      
      if (filteredRepos.length === 0) {
        toast({
          title: "No matches found",
          description: "Try adjusting the match quality or updating your skills."
        });
      }
    } catch (error) {
      console.error("Failed to load matched repositories:", error);
      toast({
        title: "Error",
        description: "Failed to load repository matches. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleMinScoreChange = (value: string) => {
    setMinMatchScore(parseInt(value));
  };
  
  const handleFeedback = (repoId: number, feedbackType: 'like' | 'dislike' | 'save' | 'hide') => {
    // In a real app, this would be sent to a backend to store user preferences
    console.log(`Feedback for repo ${repoId}: ${feedbackType}`);
    
    // If the user hides a repository, remove it from the current list
    if (feedbackType === 'hide') {
      setHiddenRepoIds(prev => [...prev, repoId]);
      setMatchedRepos(prev => prev.filter(repo => repo.id !== repoId));
    }
    
    // In a real app, this feedback would be used to improve future recommendations
    // For now, we'll just adjust the match scores locally as a demo
    if (feedbackType === 'like') {
      // Simulate improving matches for repositories with similar topics
      const likedRepo = matchedRepos.find(repo => repo.id === repoId);
      if (likedRepo) {
        setMatchedRepos(prev => 
          prev.map(repo => {
            // Find repos with similar topics and boost their score slightly
            const hasCommonTopics = repo.topics.some(topic => 
              likedRepo.topics.includes(topic)
            );
            
            if (hasCommonTopics && repo.id !== repoId) {
              return {
                ...repo,
                matchScore: Math.min(100, (repo.matchScore || 0) + 5)
              };
            }
            return repo;
          })
        );
      }
    }
  };
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Matched Repositories</CardTitle>
            <CardDescription>
              Projects that match your skills and experience
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Match quality:</span>
            <Select value={minMatchScore.toString()} onValueChange={handleMinScoreChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Match quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="40">Low (40+)</SelectItem>
                <SelectItem value="60">Medium (60+)</SelectItem>
                <SelectItem value="75">High (75+)</SelectItem>
                <SelectItem value="85">Excellent (85+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-3 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : matchedRepos.length > 0 ? (
          <div className="grid gap-4">
            {matchedRepos.map((repo) => (
              <div 
                key={repo.id}
                className="flex items-start p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-10 w-10 mr-3 mt-1">
                  <AvatarImage src={repo.owner.avatar_url} alt={repo.owner.login} />
                  <AvatarFallback>{repo.owner.login[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-grow min-width-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm truncate">
                      {repo.full_name}
                    </h3>
                    
                    {repo.matchScore !== undefined && (
                      <span 
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          repo.matchScore >= 85 ? "bg-green-100 text-green-800" :
                          repo.matchScore >= 75 ? "bg-blue-100 text-blue-800" :
                          repo.matchScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                                                 "bg-gray-100 text-gray-800"
                        )}
                      >
                        {repo.matchScore}% match
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {repo.description || "No description provided"}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      {repo.stargazers_count.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <GitFork className="h-3.5 w-3.5 mr-1" />
                      {repo.forks_count.toLocaleString()}
                    </div>
                    {repo.language && (
                      <div className="flex items-center text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                        <Code2 className="h-3 w-3 mr-1" />
                        {repo.language}
                      </div>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Updated {format(new Date(repo.updated_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {repo.topics.slice(0, 5).map(topic => (
                        <span 
                          key={topic}
                          className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                      {repo.topics.length > 5 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          +{repo.topics.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    <RepositoryFeedbackButtons 
                      repositoryId={repo.id}
                      repository={repo}
                      onFeedback={handleFeedback}
                    />
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="ml-2 flex-shrink-0"
                      onClick={() => window.open(repo.html_url, '_blank')}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {matchedRepos.length > 5 && (
              <Button variant="outline" className="mt-2">
                View All Matches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="font-medium text-lg">No matching repositories found</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Try adjusting the match quality setting or update your skills profile
              to get better repository recommendations.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={loadMatchedRepos}
            >
              Refresh Matches
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
