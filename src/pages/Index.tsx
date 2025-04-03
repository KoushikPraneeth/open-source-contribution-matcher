
import { useState } from 'react';
import Header from '@/components/Header';
import SideNavigation from '@/components/SideNavigation';
import UserStats from '@/components/UserStats';
import SkillsSection from '@/components/SkillsSection';
import RecommendedRepos from '@/components/RecommendedRepos';
import IssueCard from '@/components/IssueCard';
import IssueFilters from '@/components/IssueFilters';
import { mockIssues, mockContributions, defaultFilters } from '@/data/mockData';
import { Issue, IssueComplexity, ContributionStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: '',
  });
  
  const [trackedIssues, setTrackedIssues] = useState(
    mockContributions.map(c => c.issue.id)
  );
  
  const handleFilterChange = (newFilters: {
    complexity: IssueComplexity[];
    skills: string[];
    labels: string[];
    search?: string;
  }) => {
    setFilters(newFilters);
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
  
  // Get top recommended issues
  const topIssues = filteredIssues.slice(0, 2);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNavigation />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Welcome to ContribSpark</h1>
            <p className="text-muted-foreground max-w-3xl">
              Find open source contribution opportunities that match your skills and experience level. 
              ContribSpark analyzes issues and repositories to help you make meaningful contributions.
            </p>
            
            <UserStats />
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Recommended Issues</h2>
                    <Link to="/recommendations">
                      <Button variant="link" className="text-apple-blue flex items-center gap-1 p-0">
                        View All Recommendations
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                  
                  <IssueFilters onFilterChange={handleFilterChange} />
                  
                  <div className="mt-4 grid gap-4">
                    {filteredIssues.length > 0 ? (
                      filteredIssues.slice(0, 5).map(issue => (
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
                </section>
              </div>
              
              <div className="space-y-6">
                <SkillsSection />
                <RecommendedRepos />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
