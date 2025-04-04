
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useGitHub } from '@/hooks/useGitHub';
import { useAuth } from '@/contexts/AuthContext';
import { GitHubIssue } from '@/services/github';
import { ExternalLink, Search, Filter, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface IssueExplorerProps {
  repositoryFullName?: string;
}

export default function IssueExplorer({ repositoryFullName }: IssueExplorerProps) {
  const { currentUser } = useAuth();
  const { getBeginnerFriendlyIssues, isLoading } = useGitHub();
  const { toast } = useToast();
  
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<GitHubIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['good first issue']);
  const [language, setLanguage] = useState<string | undefined>(
    currentUser?.skills?.find(s => s.category === 'Language')?.name
  );
  
  // Common issue labels
  const commonLabels = [
    'good first issue',
    'help wanted',
    'beginner friendly',
    'documentation',
    'bug',
    'enhancement'
  ];
  
  useEffect(() => {
    loadIssues();
  }, [language, repositoryFullName]);
  
  const loadIssues = async () => {
    try {
      const fetchedIssues = await getBeginnerFriendlyIssues(language);
      
      // Filter by repository if specified
      const repoIssues = repositoryFullName 
        ? fetchedIssues.filter(issue => {
            const repoUrl = issue.repository_url;
            return repoUrl.includes(repositoryFullName);
          })
        : fetchedIssues;
      
      setIssues(repoIssues);
      applyFilters(repoIssues, searchQuery, selectedLabels);
    } catch (error) {
      console.error("Failed to load issues:", error);
      toast({
        title: "Error",
        description: "Failed to load issues. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const applyFilters = (
    issueList: GitHubIssue[], 
    query: string, 
    labels: string[]
  ) => {
    let filtered = [...issueList];
    
    // Apply search filter
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(lowercaseQuery) ||
        (issue.body && issue.body.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply label filters if any are selected
    if (labels.length > 0) {
      filtered = filtered.filter(issue => 
        issue.labels.some(label => 
          labels.some(selectedLabel => 
            label.name.toLowerCase().includes(selectedLabel.toLowerCase())
          )
        )
      );
    }
    
    // Sort by most recent first
    filtered = filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setFilteredIssues(filtered);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(issues, query, selectedLabels);
  };
  
  const handleLabelToggle = (label: string) => {
    const updatedLabels = selectedLabels.includes(label)
      ? selectedLabels.filter(l => l !== label)
      : [...selectedLabels, label];
    
    setSelectedLabels(updatedLabels);
    applyFilters(issues, searchQuery, updatedLabels);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value === "all" ? undefined : value);
  };
  
  const handleCopyIssueLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ description: "Issue link copied to clipboard!" });
  };
  
  const extractRepoInfoFromUrl = (repoUrl: string) => {
    // Format: https://api.github.com/repos/owner/repo
    const parts = repoUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { owner, repo, fullName: `${owner}/${repo}` };
  };
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Issue Explorer</CardTitle>
            <CardDescription>
              Find beginner-friendly issues to contribute to
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={language || "all"} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {currentUser?.skills
                    ?.filter(skill => skill.category === 'Language')
                    .map(skill => (
                      <SelectItem key={skill.name} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-sm mb-2 block">Filter by labels:</Label>
            <div className="flex flex-wrap gap-2">
              {commonLabels.map(label => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`label-${label}`} 
                    checked={selectedLabels.includes(label)}
                    onCheckedChange={() => handleLabelToggle(label)}
                  />
                  <label
                    htmlFor={`label-${label}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="space-y-4">
              {filteredIssues.map(issue => {
                const { owner, repo, fullName } = extractRepoInfoFromUrl(issue.repository_url);
                
                return (
                  <div key={issue.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-base">
                        <a 
                          href={issue.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {issue.title}
                        </a>
                      </h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => window.open(issue.html_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 text-sm">
                      <a 
                        href={`https://github.com/${owner}/${repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:underline"
                      >
                        {fullName}
                      </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {issue.labels.map(label => (
                        <Badge key={label.name} variant="outline" style={{
                          backgroundColor: `#${label.color}20`,
                          color: `#${label.color}`,
                          borderColor: `#${label.color}50`
                        }}>
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Created {format(new Date(issue.created_at), 'MMM d, yyyy')}
                      </div>
                      
                      <div className="flex items-center">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        #{issue.number}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopyIssueLink(issue.html_url)}>
                        Copy Link
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="font-medium text-lg">No matching issues found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or checking back later
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLabels(['good first issue']);
                  loadIssues();
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
