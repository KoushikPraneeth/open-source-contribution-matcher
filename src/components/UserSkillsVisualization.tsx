
import React from 'react';
import { SkillCategory, Skill, SkillLevel } from '@/types';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface UserSkillsVisualizationProps {
  skills: Skill[];
}

const UserSkillsVisualization = ({ skills }: UserSkillsVisualizationProps) => {
  const getSkillLevelPercentage = (level: SkillLevel): number => {
    switch (level) {
      case SkillLevel.Beginner:
        return 33;
      case SkillLevel.Intermediate:
        return 66;
      case SkillLevel.Advanced:
        return 100;
      default:
        return 0;
    }
  };

  const getSkillsByCategory = (category: SkillCategory): Skill[] => {
    return skills.filter(skill => skill.category === category);
  };

  const renderSkillCategory = (category: SkillCategory, title: string) => {
    const categorySkills = getSkillsByCategory(category);
    
    if (categorySkills.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="grid gap-2">
          {categorySkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1/3 text-sm">{skill.name}</div>
              <div className="w-2/3">
                <Progress value={getSkillLevelPercentage(skill.level)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!skills || skills.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Skills</h3>
        <p className="text-sm text-muted-foreground">No skills added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Skills</h3>
      
      {renderSkillCategory(SkillCategory.Language, "Programming Languages")}
      {renderSkillCategory(SkillCategory.Framework, "Frameworks & Libraries")}
      {renderSkillCategory(SkillCategory.Tool, "Tools & Technologies")}
      {renderSkillCategory(SkillCategory.Other, "Other Skills")}
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index}
              variant={skill.category === SkillCategory.Language ? "default" :
                      skill.category === SkillCategory.Framework ? "secondary" :
                      "outline"}
              className="px-2 py-1"
            >
              {skill.name}
              <span className="ml-1 text-xs opacity-70">
                ({skill.level})
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSkillsVisualization;
