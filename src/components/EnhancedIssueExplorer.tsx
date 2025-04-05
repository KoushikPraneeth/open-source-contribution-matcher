import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useGitHub } from '@/hooks/useGitHub';
import { useAuth } from '@/contexts/AuthContext';
import { GitHubIssue } from '@/services/github';
import { IssueComplexity } from '@/types';
import { 
  ExternalLink, 
  Search, 
  Filter, 
  Calendar, 
  MessageSquare, 
  BookmarkPlus, 
  Zap, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Clock, 
  Star
} from 'lucide-react';
import { format } from 'date-fns';

interface EnhancedIssueExplorerProps {
  repositoryFullName?: string;
}

export default function EnhancedIssueExplorer({ repositoryFullName }: EnhancedIssueExplorerProps) {
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
  const [complexity, setComplexity] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [savedIssues, setSavedIssues] = useState<string[]>([]);
  
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
    
    // Load saved issues from localStorage
    const saved = localStorage.getItem('savedIssues');
    if (saved) {
      setSavedIssues(JSON.parse(saved));
    }
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
      applyFiltersAndSort(repoIssues, searchQuery, selectedLabels, complexity, sortBy);
    } catch (error) {
      console.error("Failed to load issues:", error);
      toast({
        title: "Error",
        description: "Failed to load issues. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const determineIssueComplexity = (issue: GitHubIssue): IssueComplexity => {
    // Logic to determine complexity based on labels or other criteria
    const labels = issue.labels.map(l => l.name.toLowerCase());
    
    if (labels.some(l => l.includes('easy') || l.includes('good first issue') || l.includes('beginner'))) {
      return IssueComplexity.Easy;
    } else if (labels.some(l => l.includes('hard') || l.includes('expert') || l.includes('difficult'))) {
      return IssueComplexity.Hard;
    } else {
      return IssueComplexity.Medium;
    }
  };
  
  const applyFiltersAndSort = (
    issueList: GitHubIssue[], 
    query: string, 
    labels: string[],
    complexityFilter: string,
    sort: string
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
    
    // Apply complexity filter
    if (complexityFilter !== "any") {
      filtered = filtered.filter(issue => {
        const issueComplexity = determineIssueComplexity(issue);
        return issueComplexity === complexityFilter;
      });
    }
    
    // Apply sorting
    switch (sort) {
      case "recent":
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered = filtered.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "most-commented":
        filtered = filtered.sort((a, b) => 
          ((b.comments || 0) - (a.comments || 0))
        );
        break;
      case "least-commented":
        filtered = filtered.sort((a, b) => 
          ((a.comments || 0) - (b.comments || 0))
        );
        break;
      default:
        // Default to recent
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
    
    setFilteredIssues(filtered);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFiltersAndSort(issues, query, selectedLabels, complexity, sortBy);
  };
  
  const handleLabelToggle = (label: string) => {
    const updatedLabels = selectedLabels.includes(label)
      ? selectedLabels.filter(l => l !== label)
      : [...selectedLabels, label];
    
    setSelectedLabels(updatedLabels);
    applyFiltersAndSort(issues, searchQuery, updatedLabels, complexity, sortBy);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value === "all" ? undefined : value);
  };
  
  const handleComplexityChange = (value: string) => {
    setComplexity(value);
    applyFiltersAndSort(issues, searchQuery, selectedLabels, value, sortBy);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFiltersAndSort(issues, searchQuery, selectedLabels, complexity, value);
  };
  
  const handleSaveIssue = (issueUrl: string) => {
    const updated = [...savedIssues];
    if (updated.includes(issueUrl)) {
      // Remove from saved
      const index = updated.indexOf(issueUrl);
      updated.splice(index, 1);
      toast({ description: "Issue removed from saved items" });
    } else {
      // Add to saved
      updated.push(issueUrl);
      toast({ description: "Issue saved for later" });
    }
    
    setSavedIssues(updated);
    localStorage.setItem('savedIssues', JSON.stringify(updated));
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
  
  const getComplexityBadgeVariant = (complexity: IssueComplexity) => {
    switch (complexity) {
      case IssueComplexity.Easy:
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case IssueComplexity.Medium:
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
      case IssueComplexity.Hard:
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      default:
        return "";
    }
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
            </Button>
            
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden md:inline">Sort</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="most-commented">Most commented</SelectItem>
                <SelectItem value="least-commented">Least commented</SelectItem>
              </SelectContent>
            </Select>
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
          
          {isFiltersOpen && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label className="text-sm mb-2 block">Complexity level:</Label>
                  <RadioGroup value={complexity} onValueChange={handleComplexityChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any">Any</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={IssueComplexity.Easy} id="easy" />
                      <Label htmlFor="easy">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={IssueComplexity.Medium} id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={IssueComplexity.Hard} id="hard" />
                      <Label htmlFor="hard">Hard</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLabels(['good first issue']);
                    setComplexity('any');
                    setSortBy('recent');
                    loadIssues();
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
          
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
                const issueComplexity = determineIssueComplexity(issue);
                const isSaved = savedIssues.includes(issue.html_url);
                
                return (
                  <div key={issue.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleSaveIssue(issue.html_url)}
                              >
                                <BookmarkPlus className={`h-4 w-4 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {isSaved ? "Remove from saved issues" : "Save for later"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
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
                      </div>
                      
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
                      
                      <Badge 
                        className={getComplexityBadgeVariant(issueComplexity)}
                        variant="outline"
                      >
                        {issueComplexity} complexity
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Created {format(new Date(issue.created_at), 'MMM d, yyyy')}
                      </div>
                      
                      {issue.comments !== undefined && issue.comments > 0 && (
                        <div className="flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          {issue.comments} comments
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        #{issue.number}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopyIssueLink(issue.html_url)}
                      >
                        Copy Link
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => window.open(issue.html_url, '_blank')}
                      >
                        View on GitHub
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
                  setComplexity('any');
                  setSortBy('recent');
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
};
