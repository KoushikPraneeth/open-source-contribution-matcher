
import { useState } from 'react';
import Header from '@/components/Header';
import SideNavigation from '@/components/SideNavigation';
import IssueCard from '@/components/IssueCard';
import { mockContributions } from '@/data/mockData';
import { Issue, ContributionStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ArrowLeft, CirclePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contributions = () => {
  const [contributions, setContributions] = useState(mockContributions);
  
  const handleStatusChange = (issue: Issue, status: ContributionStatus) => {
    setContributions(
      contributions.map(c => 
        c.issue.id === issue.id 
          ? { ...c, status } 
          : c
      )
    );
    
    toast({
      title: "Status updated",
      description: `"${issue.title}" is now ${status}`,
    });
  };
  
  // Group contributions by status
  const inProgress = contributions.filter(c => 
    c.status === ContributionStatus.InProgress || 
    c.status === ContributionStatus.Interested
  );
  
  const submitted = contributions.filter(c => 
    c.status === ContributionStatus.PRSubmitted
  );
  
  const completed = contributions.filter(c => 
    c.status === ContributionStatus.Merged
  );
  
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
              <h1 className="text-2xl font-bold">My Contributions</h1>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Track and manage your open source contributions
              </p>
              
              <Link to="/recommendations">
                <Button className="flex items-center gap-1">
                  <CirclePlus className="h-4 w-4" />
                  Find New Issues
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="in-progress" className="space-y-4">
              <TabsList>
                <TabsTrigger value="in-progress">
                  In Progress ({inProgress.length})
                </TabsTrigger>
                <TabsTrigger value="submitted">
                  Submitted ({submitted.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completed.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="in-progress">
                <div className="grid gap-4">
                  {inProgress.length > 0 ? (
                    inProgress.map(contribution => (
                      <IssueCard
                        key={contribution.issue.id}
                        issue={contribution.issue}
                        isTracking={true}
                        currentStatus={contribution.status}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <h3 className="font-medium text-lg">No issues in progress</h3>
                      <p className="text-muted-foreground mt-2">
                        Find and track new issues to get started
                      </p>
                      <Link to="/recommendations" className="mt-4 inline-block">
                        <Button variant="outline" className="flex items-center gap-1">
                          <CirclePlus className="h-4 w-4" />
                          Browse Issues
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="submitted">
                <div className="grid gap-4">
                  {submitted.length > 0 ? (
                    submitted.map(contribution => (
                      <IssueCard
                        key={contribution.issue.id}
                        issue={contribution.issue}
                        isTracking={true}
                        currentStatus={contribution.status}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <h3 className="font-medium text-lg">No submitted PRs yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Update your issue status when you submit a PR
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="grid gap-4">
                  {completed.length > 0 ? (
                    completed.map(contribution => (
                      <IssueCard
                        key={contribution.issue.id}
                        issue={contribution.issue}
                        isTracking={true}
                        currentStatus={contribution.status}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <h3 className="font-medium text-lg">No completed contributions yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Your completed contributions will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contributions;
