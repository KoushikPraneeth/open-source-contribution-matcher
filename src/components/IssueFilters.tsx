
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sliders, Search, X } from 'lucide-react';
import { IssueComplexity } from '@/types';
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { commonSkills } from '@/data/mockData';

interface IssueFiltersProps {
  onFilterChange: (filters: {
    complexity: IssueComplexity[];
    skills: string[];
    labels: string[];
    search?: string;
  }) => void;
}

export default function IssueFilters({ onFilterChange }: IssueFiltersProps) {
  const [complexity, setComplexity] = useState<IssueComplexity[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const handleComplexityChange = (value: IssueComplexity, checked: boolean) => {
    let newComplexity: IssueComplexity[];
    
    if (checked) {
      newComplexity = [...complexity, value];
    } else {
      newComplexity = complexity.filter(c => c !== value);
    }
    
    setComplexity(newComplexity);
    onFilterChange({ complexity: newComplexity, skills, labels, search });
  };

  const handleSkillChange = (value: string) => {
    if (!skills.includes(value)) {
      const newSkills = [...skills, value];
      setSkills(newSkills);
      onFilterChange({ complexity, skills: newSkills, labels, search });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setSkills(newSkills);
    onFilterChange({ complexity, skills: newSkills, labels, search });
  };

  const handleLabelChange = (label: string) => {
    let newLabels: string[];
    
    if (labels.includes(label)) {
      newLabels = labels.filter(l => l !== label);
    } else {
      newLabels = [...labels, label];
    }
    
    setLabels(newLabels);
    onFilterChange({ complexity, skills, labels: newLabels, search });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ complexity, skills, labels, search: value });
  };

  const handleClearFilters = () => {
    setComplexity([]);
    setSkills([]);
    setLabels([]);
    setSearch('');
    onFilterChange({ complexity: [], skills: [], labels: [], search: '' });
  };

  const commonLabels = ['good first issue', 'help wanted', 'documentation', 'bug'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-9"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <Sliders className="mr-2 h-4 w-4" />
                Filters
                {(complexity.length > 0 || skills.length > 0 || labels.length > 0) && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1 h-5 min-w-5 rounded-full text-xs"
                  >
                    {complexity.length + skills.length + labels.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Complexity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={complexity.includes(IssueComplexity.Easy)}
                onCheckedChange={(checked) => handleComplexityChange(IssueComplexity.Easy, checked)}
              >
                Easy
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={complexity.includes(IssueComplexity.Medium)}
                onCheckedChange={(checked) => handleComplexityChange(IssueComplexity.Medium, checked)}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={complexity.includes(IssueComplexity.Hard)}
                onCheckedChange={(checked) => handleComplexityChange(IssueComplexity.Hard, checked)}
              >
                Hard
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuLabel className="mt-2">Labels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {commonLabels.map(label => (
                <DropdownMenuCheckboxItem
                  key={label}
                  checked={labels.includes(label)}
                  onCheckedChange={() => handleLabelChange(label)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Select onValueChange={handleSkillChange}>
            <SelectTrigger className="w-[150px] flex-shrink-0">
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Skills</SelectLabel>
                {commonSkills.slice(0, 10).map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {(complexity.length > 0 || skills.length > 0 || labels.length > 0 || search) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearFilters}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {(complexity.length > 0 || skills.length > 0 || labels.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {complexity.map(c => (
            <Badge key={c} variant="secondary" className="flex items-center gap-1">
              {c}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleComplexityChange(c, false)}
              />
            </Badge>
          ))}
          
          {skills.map(skill => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveSkill(skill)}
              />
            </Badge>
          ))}
          
          {labels.map(label => (
            <Badge key={label} variant="secondary" className="flex items-center gap-1">
              {label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleLabelChange(label)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
