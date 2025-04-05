
import React from 'react';
import { Contribution, ContributionStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { GitPullRequest, ExternalLink, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface ContributionHistoryProps {
  contributions: Contribution[];
}

const ContributionHistory = ({ contributions }: ContributionHistoryProps) => {
  const getStatusColor = (status: ContributionStatus) => {
    switch (status) {
      case ContributionStatus.Interested:
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10";
      case ContributionStatus.InProgress:
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10";
      case ContributionStatus.PRSubmitted:
        return "bg-purple-500/10 text-purple-600 hover:bg-purple-500/10";
      case ContributionStatus.Merged:
        return "bg-green-500/10 text-green-600 hover:bg-green-500/10";
      case ContributionStatus.Closed:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/10";
      default:
        return "";
    }
  };
  
  if (!contributions || contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Contributions</CardTitle>
          <CardDescription>
            Track your open source contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              Your contributions will appear here once you start contributing to open source projects.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Contributions</CardTitle>
        <CardDescription>
          Track your open source contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-medium">
                    <a 
                      href={contribution.issue.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {contribution.issue.title}
                    </a>
                  </h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {contribution.issue.repositoryName}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Badge className={getStatusColor(contribution.status)}>
                    {contribution.status}
                  </Badge>
                  {contribution.points && (
                    <Badge variant="outline" className="bg-green-100/10">
                      +{contribution.points} pts
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {contribution.issue.labels.map((label) => (
                  <Badge key={label.name} variant="outline" style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}50`
                  }}>
                    {label.name}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <GitPullRequest className="h-3.5 w-3.5 mr-1" />
                  Added {format(new Date(contribution.dateAdded), 'MMM d, yyyy')}
                </div>
                
                {contribution.prUrl && (
                  <a 
                    href={contribution.prUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Pull Request
                  </a>
                )}
              </div>
              
              {contribution.notes && (
                <div className="mt-3 p-3 bg-muted/30 rounded text-sm">
                  <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Notes
                  </div>
                  {contribution.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionHistory;
