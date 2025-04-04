
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ExperienceLevel, Skill, SkillLevel, SkillCategory } from '@/types';

// Common skills by category
const commonSkills = {
  Language: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 
    'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'
  ],
  Framework: [
    'React', 'Angular', 'Vue', 'Next.js', 'Svelte', 'Express', 
    'Django', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET'
  ],
  Tool: [
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 
    'CI/CD', 'Webpack', 'Vite', 'Jest', 'Cypress'
  ],
  Other: [
    'UI/UX', 'Accessibility', 'Performance', 'Security', 'Documentation',
    'Databases', 'GraphQL', 'REST API', 'Machine Learning'
  ]
};

// Project types
const projectTypes = [
  'Web Development', 'Mobile Apps', 'Data Science', 'Game Development',
  'DevOps', 'Documentation', 'Design', 'Testing', 'Cybersecurity'
];

// Contribution goals
const contributionGoals = [
  'Learning new skills', 'Career advancement', 'Hacktoberfest', 
  'Building portfolio', 'Giving back to the community'
];

export default function UserPreferences() {
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [skills, setSkills] = useState<Skill[]>(currentUser?.skills || []);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    currentUser?.experienceLevel || ExperienceLevel.Beginner
  );
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>(
    currentUser?.projectTypes || []
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    currentUser?.contributionGoals || []
  );
  const [newSkill, setNewSkill] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>(SkillCategory.Language);
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(SkillLevel.Beginner);
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check if skill already exists
    if (skills.some(skill => 
      skill.name.toLowerCase() === newSkill.toLowerCase() && 
      skill.category === newSkillCategory
    )) {
      toast({
        title: "Skill already added",
        description: `${newSkill} is already in your ${newSkillCategory} skills`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedSkills = [...skills, {
      name: newSkill,
      category: newSkillCategory,
      level: newSkillLevel
    }];
    
    setSkills(updatedSkills);
    setNewSkill('');
  };
  
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };
  
  const handleCommonSkillToggle = (skillName: string, category: SkillCategory) => {
    // Check if skill already exists
    const existingSkillIndex = skills.findIndex(skill => 
      skill.name === skillName && skill.category === category
    );
    
    if (existingSkillIndex >= 0) {
      // Remove skill
      handleRemoveSkill(existingSkillIndex);
    } else {
      // Add skill with default level
      setSkills([...skills, {
        name: skillName,
        category,
        level: SkillLevel.Beginner
      }]);
    }
  };
  
  const handleProjectTypeToggle = (type: string) => {
    setSelectedProjectTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };
  
  const handleSavePreferences = async () => {
    if (!updateUserProfile) {
      toast({
        title: "Error",
        description: "Unable to update profile. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateUserProfile({
        ...currentUser,
        skills,
        experienceLevel,
        projectTypes: selectedProjectTypes,
        contributionGoals: selectedGoals
      });
      
      toast({
        title: "Preferences saved",
        description: "Your profile preferences have been updated"
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader>
        <CardTitle>Your Preferences</CardTitle>
        <CardDescription>
          Customize your experience to get better recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Experience Level</h3>
          <RadioGroup 
            value={experienceLevel} 
            onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={ExperienceLevel.Beginner} id="beginner" />
              <Label htmlFor="beginner">Beginner - New to open source</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={ExperienceLevel.Intermediate} id="intermediate" />
              <Label htmlFor="intermediate">Intermediate - Some experience with open source</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={ExperienceLevel.Advanced} id="advanced" />
              <Label htmlFor="advanced">Advanced - Experienced contributor</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Skills</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(commonSkills).map(([category, skillList]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillList.map(skill => {
                    const isSelected = skills.some(s => 
                      s.name === skill && s.category === category
                    );
                    
                    return (
                      <Button
                        key={skill}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCommonSkillToggle(skill, category as SkillCategory)}
                        className="h-7"
                      >
                        {skill}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow">
              <Input 
                placeholder="Add custom skill" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
            <Select
              value={newSkillCategory}
              onValueChange={(value) => setNewSkillCategory(value as SkillCategory)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SkillCategory).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newSkillLevel}
              onValueChange={(value) => setNewSkillLevel(value as SkillLevel)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SkillLevel).map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={handleAddSkill}>Add</Button>
          </div>
          
          {skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Your selected skills:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{skill.category}</span>
                        <span>•</span>
                        <span>{skill.level}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveSkill(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Types</h3>
          <p className="text-sm text-muted-foreground">
            What kinds of projects are you interested in contributing to?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {projectTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`project-type-${type}`} 
                  checked={selectedProjectTypes.includes(type)}
                  onCheckedChange={() => handleProjectTypeToggle(type)}
                />
                <label
                  htmlFor={`project-type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contribution Goals</h3>
          <p className="text-sm text-muted-foreground">
            What are you hoping to achieve with your open source contributions?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contributionGoals.map(goal => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox 
                  id={`goal-${goal}`} 
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => handleGoalToggle(goal)}
                />
                <label
                  htmlFor={`goal-${goal}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {goal}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
