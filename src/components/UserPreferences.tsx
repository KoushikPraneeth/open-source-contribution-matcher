
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
import { motion } from 'framer-motion';

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

interface UserPreferencesProps {
  searchQuery?: string; // Make searchQuery optional
}

export default function UserPreferences({ searchQuery = '' }: UserPreferencesProps) {
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
  
  // Filter skills based on search query
  const filteredSkills = Object.entries(commonSkills).reduce((acc, [category, skillList]) => {
    if (searchQuery) {
      const filtered = skillList.filter(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    } else {
      acc[category] = skillList;
    }
    return acc;
  }, {} as Record<string, string[]>);
  
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
    
    // Save to localStorage for persistence
    localStorage.setItem('user-skills', JSON.stringify(updatedSkills));
  };
  
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    
    // Update localStorage
    localStorage.setItem('user-skills', JSON.stringify(updatedSkills));
  };
  
  const handleCommonSkillToggle = (skillName: string, category: SkillCategory) => {
    // Check if skill already exists
    const existingSkillIndex = skills.findIndex(skill => 
      skill.name === skillName && skill.category === category
    );
    
    let updatedSkills: Skill[];
    
    if (existingSkillIndex >= 0) {
      // Remove skill
      updatedSkills = [...skills];
      updatedSkills.splice(existingSkillIndex, 1);
    } else {
      // Add skill with default level
      updatedSkills = [...skills, {
        name: skillName,
        category,
        level: SkillLevel.Beginner
      }];
    }
    
    setSkills(updatedSkills);
    
    // Update localStorage
    localStorage.setItem('user-skills', JSON.stringify(updatedSkills));
  };
  
  const handleProjectTypeToggle = (type: string) => {
    const updatedTypes = selectedProjectTypes.includes(type)
      ? selectedProjectTypes.filter(t => t !== type)
      : [...selectedProjectTypes, type];
    
    setSelectedProjectTypes(updatedTypes);
    
    // Update localStorage
    localStorage.setItem('user-project-types', JSON.stringify(updatedTypes));
  };
  
  const handleGoalToggle = (goal: string) => {
    const updatedGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    
    setSelectedGoals(updatedGoals);
    
    // Update localStorage
    localStorage.setItem('user-contribution-goals', JSON.stringify(updatedGoals));
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
        skills,
        experienceLevel,
        projectTypes: selectedProjectTypes,
        contributionGoals: selectedGoals
      });
      
      // Persist to localStorage for offline access
      localStorage.setItem('user-skills', JSON.stringify(skills));
      localStorage.setItem('user-experience-level', experienceLevel);
      localStorage.setItem('user-project-types', JSON.stringify(selectedProjectTypes));
      localStorage.setItem('user-contribution-goals', JSON.stringify(selectedGoals));
      
      toast({
        title: "Preferences saved",
        description: "Your profile preferences have been updated"
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      
      // Still save to localStorage even if API fails
      localStorage.setItem('user-skills', JSON.stringify(skills));
      localStorage.setItem('user-experience-level', experienceLevel);
      localStorage.setItem('user-project-types', JSON.stringify(selectedProjectTypes));
      localStorage.setItem('user-contribution-goals', JSON.stringify(selectedGoals));
      
      toast({
        title: "Saved locally",
        description: "Your preferences are saved locally. They will sync when you're back online.",
        variant: "default"
      });
    }
  };
  
  // Load data from localStorage on component mount
  React.useEffect(() => {
    // Only load from localStorage if we don't have data from the server
    if (!currentUser?.skills?.length) {
      const savedSkills = localStorage.getItem('user-skills');
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    }
    
    if (!currentUser?.experienceLevel) {
      const savedLevel = localStorage.getItem('user-experience-level');
      if (savedLevel) {
        setExperienceLevel(savedLevel as ExperienceLevel);
      }
    }
    
    if (!currentUser?.projectTypes?.length) {
      const savedTypes = localStorage.getItem('user-project-types');
      if (savedTypes) {
        setSelectedProjectTypes(JSON.parse(savedTypes));
      }
    }
    
    if (!currentUser?.contributionGoals?.length) {
      const savedGoals = localStorage.getItem('user-contribution-goals');
      if (savedGoals) {
        setSelectedGoals(JSON.parse(savedGoals));
      }
    }
  }, [currentUser]);
  
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
            onValueChange={(value) => {
              setExperienceLevel(value as ExperienceLevel);
              localStorage.setItem('user-experience-level', value);
            }}
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
            {Object.entries(filteredSkills).map(([category, skillList]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillList.map(skill => {
                    const isSelected = skills.some(s => 
                      s.name === skill && s.category === category
                    );
                    
                    return (
                      <motion.div
                        key={skill}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCommonSkillToggle(skill, category as SkillCategory)}
                          className="h-8 min-w-[80px] touch-manipulation"
                        >
                          {skill}
                        </Button>
                      </motion.div>
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
                className="h-10"
              />
            </div>
            <Select
              value={newSkillCategory}
              onValueChange={(value) => setNewSkillCategory(value as SkillCategory)}
            >
              <SelectTrigger className="w-full sm:w-[150px] h-10">
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
              <SelectTrigger className="w-full sm:w-[150px] h-10">
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
            <Button type="button" onClick={handleAddSkill} className="h-10">Add</Button>
          </div>
          
          {skills.length > 0 && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-sm font-medium mb-2">Your selected skills:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {skills.map((skill, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  >
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
                      className="h-8 w-8 p-0"
                    >
                      ✕
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Types</h3>
          <p className="text-sm text-muted-foreground">
            What kinds of projects are you interested in contributing to?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {projectTypes.map(type => (
              <motion.div 
                key={type} 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Checkbox 
                  id={`project-type-${type}`} 
                  checked={selectedProjectTypes.includes(type)}
                  onCheckedChange={() => handleProjectTypeToggle(type)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={`project-type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type}
                </label>
              </motion.div>
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
              <motion.div 
                key={goal} 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Checkbox 
                  id={`goal-${goal}`} 
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => handleGoalToggle(goal)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={`goal-${goal}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {goal}
                </label>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="flex justify-end"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={handleSavePreferences} className="px-6">
            Save Preferences
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
