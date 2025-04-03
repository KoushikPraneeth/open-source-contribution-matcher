
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { mockRepositories } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Github, Star, GitFork, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecommendedRepos() {
  // Get top 3 repositories based on maintainer activity
  const topRepos = [...mockRepositories]
    .sort((a, b) => b.maintainerActivity - a.maintainerActivity)
    .slice(0, 3);
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recommended Repositories</CardTitle>
          <Button variant="link" className="text-apple-blue flex items-center gap-1 p-0">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <CardDescription>
          Active projects matching your skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {topRepos.map((repo) => (
            <div 
              key={repo.id}
              className="flex items-start p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Avatar className="h-8 w-8 mr-3 mt-1">
                <AvatarImage src={repo.owner.avatarUrl} alt={repo.owner.name} />
                <AvatarFallback>{repo.owner.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow min-width-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">
                    {repo.owner.name}/{repo.name}
                  </h3>
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      repo.maintainerActivity > 90 
                        ? "bg-apple-green" 
                        : repo.maintainerActivity > 70 
                          ? "bg-apple-orange" 
                          : "bg-apple-gray"
                    )}
                    title={`Maintainer Activity: ${repo.maintainerActivity}%`}
                  />
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 mr-1" />
                    {repo.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <GitFork className="h-3.5 w-3.5 mr-1" />
                    {repo.forks.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
                    {repo.language}
                  </div>
                </div>
              </div>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-2"
                onClick={() => window.open(repo.url, '_blank')}
              >
                <Github className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
