
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';

// Lazy load GithubConnectionStatus to improve initial load performance
const GithubConnectionStatus = lazy(() => import('@/components/GithubConnectionStatus'));

export default function DashboardHeader() {
  const { currentUser } = useAuth();
  
  return (
    <Card className="bg-card border-none shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-medium">
              Welcome back, {currentUser?.username || 'there'}!
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentUser?.isGithubConnected 
                ? 'Your GitHub is connected. View your personalized recommendations.'
                : 'Connect your GitHub to get personalized recommendations.'}
            </p>
            
            <Suspense fallback={<div className="h-6 mt-2" />}>
              {currentUser && (
                <GithubConnectionStatus user={{
                  id: currentUser.id,
                  username: currentUser.username,
                  avatarUrl: currentUser.avatarUrl || '',
                  githubUrl: currentUser.githubUrl || '',
                  skills: currentUser.skills || [],
                  experienceLevel: currentUser.experienceLevel || undefined,
                  areasOfInterest: currentUser.areasOfInterest || [],
                  projectTypes: currentUser.projectTypes || [],
                  contributionGoals: currentUser.contributionGoals || [],
                  contributions: currentUser.contributions || [],
                  savedRepositories: currentUser.savedRepositories || [],
                  isGithubConnected: currentUser.isGithubConnected,
                  githubUsername: currentUser.githubUsername,
                  contributionPoints: currentUser.contributionPoints,
                  badges: currentUser.badges,
                }} />
              )}
            </Suspense>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <KeyboardShortcutsHelp />
            
            <Link to="/recommendations">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Find Issues</span>
              </Button>
            </Link>
            
            <Link to="/contributions">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                <span>Add Contribution</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
