
import { useState } from 'react';
import { Issue, ContributionStatus, Contribution } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { mockContributions } from '@/data/mockData';

export function useContributions() {
  const [contributions, setContributions] = useState<Contribution[]>(mockContributions);
  
  // Track or untrack an issue
  const toggleTrackIssue = (issue: Issue) => {
    const isTracking = contributions.some(c => c.issue.id === issue.id);
    
    if (isTracking) {
      // Untrack the issue
      setContributions(contributions.filter(c => c.issue.id !== issue.id));
      toast({
        title: "Issue untracked",
        description: `You are no longer tracking "${issue.title}"`,
      });
    } else {
      // Track the issue
      const newContribution: Contribution = {
        id: `contrib-${Date.now()}`,
        issue,
        status: ContributionStatus.Interested,
        dateAdded: new Date().toISOString(),
      };
      
      setContributions([...contributions, newContribution]);
      toast({
        title: "Issue tracked",
        description: `You are now tracking "${issue.title}"`,
      });
    }
  };
  
  // Update the status of a tracked issue
  const updateContributionStatus = (issue: Issue, status: ContributionStatus) => {
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
  
  // Check if an issue is being tracked
  const isTracking = (issueId: string) => {
    return contributions.some(c => c.issue.id === issueId);
  };
  
  // Get the current status of a tracked issue
  const getContributionStatus = (issueId: string) => {
    const contribution = contributions.find(c => c.issue.id === issueId);
    return contribution?.status;
  };
  
  // Filter contributions by status
  const getContributionsByStatus = (status: ContributionStatus | ContributionStatus[]) => {
    const statusArray = Array.isArray(status) ? status : [status];
    return contributions.filter(c => statusArray.includes(c.status));
  };
  
  return {
    contributions,
    toggleTrackIssue,
    updateContributionStatus,
    isTracking,
    getContributionStatus,
    getContributionsByStatus,
  };
}
