
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { mockUser } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Wrench, PlusCircle } from 'lucide-react';
import { SkillCategory, SkillLevel } from '@/types';

const SkillsSection = () => {
  const languages = mockUser.skills.filter(skill => skill.category === SkillCategory.Language);
  const frameworks = mockUser.skills.filter(skill => skill.category === SkillCategory.Framework);
  const tools = mockUser.skills.filter(skill => skill.category === SkillCategory.Tool);
  
  const renderSkillBadge = (name: string, level: SkillLevel) => {
    let colorClass = "bg-muted text-muted-foreground";
    
    if (level === SkillLevel.Beginner) {
      colorClass = "bg-apple-lightGray/30 text-apple-gray";
    } else if (level === SkillLevel.Intermediate) {
      colorClass = "bg-apple-blue/10 text-apple-blue";
    } else if (level === SkillLevel.Advanced) {
      colorClass = "bg-apple-green/10 text-apple-green";
    }
    
    return (
      <Badge key={name} className={`${colorClass} hover:${colorClass} rounded-lg flex items-center gap-1 border-0`}>
        {name}
        <span className="text-xs opacity-70">• {level}</span>
      </Badge>
    );
  };
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Skills</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Add Skill
          </Button>
        </div>
        <CardDescription>
          Skills matched with contribution opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="languages">
          <TabsList className="w-full">
            <TabsTrigger value="languages" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Languages
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Frameworks
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-1">
              <Wrench className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="languages" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {languages.map(skill => renderSkillBadge(skill.name, skill.level))}
            </div>
          </TabsContent>
          
          <TabsContent value="frameworks" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {frameworks.map(skill => renderSkillBadge(skill.name, skill.level))}
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {tools.map(skill => renderSkillBadge(skill.name, skill.level))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Areas of Interest</h4>
          <div className="flex flex-wrap gap-2">
            {mockUser.areasOfInterest.map(area => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
