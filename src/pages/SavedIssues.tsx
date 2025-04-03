
import { useState } from "react";
import { useContributions } from "@/hooks/useContributions";
import SideNavigation from "@/components/SideNavigation";
import { Issue, ContributionStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const SavedIssues = () => {
  const { contributions, toggleTrackIssue, updateContributionStatus } = useContributions();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<ContributionStatus | "all">("all");
  
  const savedIssues = contributions.filter(contribution => 
    filterStatus === "all" || contribution.status === filterStatus
  );

  const handleRemove = (issue: Issue) => {
    toggleTrackIssue(issue);
  };

  const handleUpdateStatus = (issue: Issue, status: ContributionStatus) => {
    updateContributionStatus(issue, status);
  };

  const getStatusColor = (status: ContributionStatus) => {
    switch(status) {
      case ContributionStatus.Interested:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ContributionStatus.InProgress:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ContributionStatus.PRSubmitted:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ContributionStatus.Merged:
        return "bg-green-100 text-green-800 border-green-200";
      case ContributionStatus.Closed:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header title="Saved Issues" />
        <main className="container py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Saved Issues</h1>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === "all" ? "default" : "outline"} 
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={filterStatus === ContributionStatus.Interested ? "default" : "outline"} 
                onClick={() => setFilterStatus(ContributionStatus.Interested)}
                size="sm"
              >
                Interested
              </Button>
              <Button 
                variant={filterStatus === ContributionStatus.InProgress ? "default" : "outline"} 
                onClick={() => setFilterStatus(ContributionStatus.InProgress)}
                size="sm"
              >
                In Progress
              </Button>
              <Button 
                variant={filterStatus === ContributionStatus.PRSubmitted ? "default" : "outline"} 
                onClick={() => setFilterStatus(ContributionStatus.PRSubmitted)}
                size="sm"
              >
                PR Submitted
              </Button>
              <Button 
                variant={filterStatus === ContributionStatus.Merged ? "default" : "outline"} 
                onClick={() => setFilterStatus(ContributionStatus.Merged)}
                size="sm"
              >
                Merged
              </Button>
              <Button 
                variant={filterStatus === ContributionStatus.Closed ? "default" : "outline"} 
                onClick={() => setFilterStatus(ContributionStatus.Closed)}
                size="sm"
              >
                Closed
              </Button>
            </div>
          </div>

          {savedIssues.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent className="pt-8">
                <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved issues</h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === "all" 
                    ? "You haven't saved any issues yet. Browse recommendations to find issues to contribute to." 
                    : `You don't have any issues with the '${filterStatus}' status.`}
                </p>
                <Button asChild>
                  <a href="/recommendations">Browse Recommendations</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedIssues.map((contribution) => (
                <Card key={contribution.id} className="overflow-hidden">
                  <CardHeader className="bg-accent/50 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{contribution.issue.repositoryName}</Badge>
                        <Badge className={getStatusColor(contribution.status)}>
                          {contribution.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(contribution.issue)}
                        >
                          <BookmarkCheck className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={contribution.issue.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View on GitHub
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-lg mb-3">{contribution.issue.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 my-2">
                      {contribution.issue.labels.map((label) => (
                        <Badge 
                          key={label.name} 
                          style={{
                            backgroundColor: `#${label.color}20`,
                            color: `#${label.color}`,
                            borderColor: `#${label.color}40`
                          }}
                          variant="outline"
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Update Status:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(ContributionStatus).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={contribution.status === status ? "default" : "outline"}
                            onClick={() => handleUpdateStatus(contribution.issue, status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SavedIssues;
