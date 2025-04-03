
import { Issue, ContributionStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink, GitPullRequest, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IssueCardProps {
  issue: Issue;
  isTracking?: boolean;
  onTrack?: (issue: Issue) => void;
  onStatusChange?: (issue: Issue, status: ContributionStatus) => void;
  currentStatus?: ContributionStatus;
}

export default function IssueCard({ 
  issue, 
  isTracking = false, 
  onTrack, 
  onStatusChange,
  currentStatus
}: IssueCardProps) {
  const handleTrack = () => {
    if (onTrack) {
      onTrack(issue);
    }
  };

  const handleStatusChange = (status: ContributionStatus) => {
    if (onStatusChange) {
      onStatusChange(issue, status);
    }
  };

  return (
    <Card className="w-full bg-card shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {issue.repositoryName}
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-apple-blue/10 text-apple-blue border-0">
              {issue.complexity}
            </Badge>
            <Badge variant="outline" className="bg-apple-green/10 text-apple-green border-0">
              {issue.matchScore}% Match
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-base sm:text-lg font-medium leading-tight mt-2">
          {issue.title}
        </CardTitle>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {issue.labels.map((label) => (
            <Badge 
              key={label.name}
              variant="secondary" 
              className={cn(
                "text-xs",
                label.name === "good first issue" && "bg-apple-green/10 text-apple-green",
                label.name === "help wanted" && "bg-apple-orange/10 text-apple-orange",
                label.name === "documentation" && "bg-apple-blue/10 text-apple-blue",
                label.name === "bug" && "bg-apple-red/10 text-apple-red",
              )}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <CardDescription className="text-sm">
            <div className="text-muted-foreground">Required Skills</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {issue.requiredSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardDescription>
          
          <CardDescription className="text-sm">
            <div className="text-muted-foreground">Why it's a match</div>
            <ul className="mt-1 space-y-1 pl-5 list-disc text-foreground/80">
              {issue.matchReason.slice(0, 2).map((reason, i) => (
                <li key={i} className="text-xs">{reason}</li>
              ))}
            </ul>
          </CardDescription>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            onClick={() => window.open(issue.url, '_blank')}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View Issue
          </Button>
          
          {isTracking ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={cn(
                    "text-xs h-8",
                    currentStatus === ContributionStatus.Merged && "text-apple-green",
                    currentStatus === ContributionStatus.InProgress && "text-apple-orange",
                    currentStatus === ContributionStatus.PRSubmitted && "text-apple-blue"
                  )}
                >
                  <GitPullRequest className="mr-1 h-3 w-3" />
                  {currentStatus || "Update Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange(ContributionStatus.Interested)}>
                  Interested
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(ContributionStatus.InProgress)}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(ContributionStatus.PRSubmitted)}>
                  PR Submitted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(ContributionStatus.Merged)}>
                  Merged
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(ContributionStatus.Closed)}>
                  Closed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant={isTracking ? "default" : "outline"}
              className="text-xs h-8"
              onClick={handleTrack}
            >
              <Bookmark className={cn("mr-1 h-3 w-3", isTracking && "fill-current")} />
              {isTracking ? "Tracking" : "Track Issue"}
            </Button>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-xs h-8"
        >
          <LineChart className="h-3 w-3" />
          <span className="sr-only">Stats</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
