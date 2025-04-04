
import { useState } from 'react';
import Header from '@/components/Header';
import SideNavigation from '@/components/SideNavigation';
import IssueCard from '@/components/IssueCard';
import IssueFilters from '@/components/IssueFilters';
import MatchedRepositories from '@/components/MatchedRepositories';
import IssueExplorer from '@/components/IssueExplorer';
import { mockIssues, mockContributions, defaultFilters } from '@/data/mockData';
import { Issue, IssueComplexity, ContributionStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Recommendations = () => {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: '',
  });
  
  const [trackedIssues, setTrackedIssues] = useState(
    mockContributions.map(c => c.issue.id)
  );
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleFilterChange = (newFilters: {
    complexity: IssueComplexity[];
    skills: string[];
    labels: string[];
    search: string;
  }) => {
    setFilters({
      ...newFilters,
      search: newFilters.search || '',
    });
  };
  
  const handleTrackIssue = (issue: Issue) => {
    if (trackedIssues.includes(issue.id)) {
      setTrackedIssues(trackedIssues.filter(id => id !== issue.id));
      toast({
        title: "Issue untracked",
        description: `You are no longer tracking "${issue.title}"`,
      });
    } else {
      setTrackedIssues([...trackedIssues, issue.id]);
      toast({
        title: "Issue tracked",
        description: `You are now tracking "${issue.title}"`,
      });
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Recommendations refreshed",
        description: "Found 2 new issues matching your skills",
      });
    }, 1500);
  };
  
  // Filter issues based on the current filters
  const filteredIssues = mockIssues
    .filter(issue => {
      // Filter by complexity
      if (filters.complexity.length > 0 && !filters.complexity.includes(issue.complexity)) {
        return false;
      }
      
      // Filter by skills
      if (filters.skills.length > 0 && !issue.requiredSkills.some(skill => 
        filters.skills.includes(skill)
      )) {
        return false;
      }
      
      // Filter by labels
      if (filters.labels.length > 0 && !issue.labels.some(label => 
        filters.labels.includes(label.name)
      )) {
        return false;
      }
      
      // Filter by search
      if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNavigation />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Recommendations</h1>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Personalized recommendations based on your skills and interests
              </p>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="issues">Issue Recommendations</TabsTrigger>
                <TabsTrigger value="explorer">Issue Explorer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="repositories">
                <MatchedRepositories />
              </TabsContent>
              
              <TabsContent value="issues" className="space-y-6">
                <IssueFilters onFilterChange={handleFilterChange} />
                
                <div className="grid gap-4">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        isTracking={trackedIssues.includes(issue.id)}
                        onTrack={handleTrackIssue}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <h3 className="font-medium text-lg">No matching issues found</h3>
                      <p className="text-muted-foreground mt-2">
                        Try adjusting your filters or checking back later
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="explorer">
                <IssueExplorer />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recommendations;
