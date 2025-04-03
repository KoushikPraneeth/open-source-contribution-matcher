
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, GitPullRequest, Star, BookMarked } from 'lucide-react';
import { mockContributions } from '@/data/mockData';
import { ContributionStatus } from '@/types';

export default function UserStats() {
  // Calculate stats from mock data
  const totalContributions = mockContributions.length;
  const completedContributions = mockContributions.filter(
    c => c.status === ContributionStatus.Merged
  ).length;
  const completionRate = totalContributions > 0 
    ? Math.round((completedContributions / totalContributions) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-apple-blue" />
            Total Contributions
          </CardTitle>
          <CardDescription>
            Your overall activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalContributions}
          </div>
          <Progress value={totalContributions * 10} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-apple-green" />
            Merged PRs
          </CardTitle>
          <CardDescription>
            Successful contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedContributions}
          </div>
          <div className="flex items-center mt-2">
            <Progress value={completionRate} className="h-1 flex-grow" />
            <span className="text-xs text-muted-foreground ml-2">
              {completionRate}%
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-apple-orange" />
            Top Skills
          </CardTitle>
          <CardDescription>
            Most used in contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-apple-blue/10 text-apple-blue">
              JavaScript
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-apple-green/10 text-apple-green">
              React
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-apple-gray/10 text-apple-gray">
              Documentation
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-apple-darkBlue" />
            Saved Issues
          </CardTitle>
          <CardDescription>
            Issues you're tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mockContributions.length}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {mockContributions.filter(c => c.status === ContributionStatus.InProgress).length} in progress
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
