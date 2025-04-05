
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, RadarChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skill, SkillLevel, SkillCategory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// Mock historical skills data to show growth
const skillsHistory = [
  { date: '2025-01', skills: 5, level: 1.5 },
  { date: '2025-02', skills: 7, level: 2.0 },
  { date: '2025-03', skills: 8, level: 2.3 },
  { date: '2025-04', skills: 10, level: 2.7 }
];

const SkillsVisualization = () => {
  const { currentUser } = useAuth();
  const [chartType, setChartType] = useState<'category' | 'level'>('category');
  
  // Filter skills if they exist, otherwise use empty array
  const skills = currentUser?.skills || [];
  
  // Process skills data for visualization
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = 0;
    }
    acc[skill.category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const skillsByLevel = skills.reduce((acc, skill) => {
    if (!acc[skill.level]) {
      acc[skill.level] = 0;
    }
    acc[skill.level]++;
    return acc;
  }, {} as Record<string, number>);
  
  // Prepare radar chart data
  const radarData = {
    labels: ['Languages', 'Frameworks', 'Tools', 'Databases', 'DevOps', 'Design'],
    datasets: [
      {
        label: 'Current Skills',
        data: [
          skills.filter(s => s.category === SkillCategory.Language).length,
          skills.filter(s => s.category === SkillCategory.Framework).length,
          skills.filter(s => s.category === SkillCategory.Tool).length,
          skills.filter(s => s.name.toLowerCase().includes('database')).length,
          skills.filter(s => s.name.toLowerCase().includes('devops')).length,
          skills.filter(s => s.name.toLowerCase().includes('design')).length,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Skills Growth</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <h3 className="text-3xl font-bold">{skills.length}</h3>
              </div>
              <Badge className="text-xs" variant="outline">
                {skills.length > 0 ? '+2 this month' : 'No skills added'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Add more skills to improve your matches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Skill Level</p>
                <h3 className="text-3xl font-bold">
                  {skills.length > 0 
                    ? (skills.reduce((acc, skill) => {
                        return acc + (skill.level === SkillLevel.Beginner ? 1 : 
                                      skill.level === SkillLevel.Intermediate ? 2 : 3);
                      }, 0) / skills.length).toFixed(1)
                    : '0.0'
                  }
                </h3>
              </div>
              <Badge className="text-xs" variant="outline">
                {skills.length > 0 ? '+0.2 this month' : 'No skills added'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Improve your skills to increase your level
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Skill Categories</p>
                <h3 className="text-3xl font-bold">
                  {Object.keys(skillsByCategory).length}
                </h3>
              </div>
              <Badge className="text-xs" variant="outline">
                {Object.keys(skillsByCategory).length > 0 ? '+1 this month' : 'No categories'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Diverse skills help you find more projects
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Skills Breakdown</TabsTrigger>
          <TabsTrigger value="growth">Growth Over Time</TabsTrigger>
          <TabsTrigger value="radar">Skill Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills by {chartType === 'category' ? 'Category' : 'Level'}</CardTitle>
                <div className="flex gap-1">
                  <Badge 
                    variant={chartType === 'category' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setChartType('category')}
                  >
                    Category
                  </Badge>
                  <Badge 
                    variant={chartType === 'level' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setChartType('level')}
                  >
                    Level
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {chartType === 'category' 
                  ? 'Distribution of your skills by category'
                  : 'Distribution of your skills by proficiency level'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No skills data available. Add skills in your profile.
                </div>
              ) : (
                <PieChart
                  height={300}
                  data={{
                    labels: chartType === 'category' 
                      ? Object.keys(skillsByCategory)
                      : Object.keys(skillsByLevel),
                    datasets: [{
                      label: chartType === 'category' ? 'Skills by Category' : 'Skills by Level',
                      data: chartType === 'category'
                        ? Object.values(skillsByCategory)
                        : Object.values(skillsByLevel),
                      backgroundColor: chartType === 'category'
                        ? [
                            'rgba(99, 102, 241, 0.8)',  // Indigo
                            'rgba(239, 68, 68, 0.8)',   // Red
                            'rgba(16, 185, 129, 0.8)',  // Green
                            'rgba(245, 158, 11, 0.8)',  // Amber
                          ]
                        : [
                            'rgba(56, 189, 248, 0.8)',  // Light blue (Beginner)
                            'rgba(139, 92, 246, 0.8)',  // Purple (Intermediate)
                            'rgba(236, 72, 153, 0.8)',  // Pink (Advanced)
                          ],
                    }]
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Growth Over Time</CardTitle>
              <CardDescription>
                Track how your skills are developing month by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                height={300}
                data={{
                  labels: skillsHistory.map(entry => entry.date),
                  datasets: [
                    {
                      label: 'Number of Skills',
                      data: skillsHistory.map(entry => entry.skills),
                      backgroundColor: 'rgba(99, 102, 241, 0.8)',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Average Skill Level',
                      data: skillsHistory.map(entry => entry.level),
                      backgroundColor: 'rgba(236, 72, 153, 0.8)',
                      yAxisID: 'y1',
                      type: 'line',
                    }
                  ]
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Skills'
                      }
                    },
                    y1: {
                      beginAtZero: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Avg. Skill Level'
                      },
                      grid: {
                        drawOnChartArea: false
                      },
                      max: 3,
                      ticks: {
                        stepSize: 0.5
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Radar</CardTitle>
              <CardDescription>
                Visualize your skill distribution across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No skills data available. Add skills in your profile.
                </div>
              ) : (
                <RadarChart
                  height={350}
                  data={radarData}
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                          stepSize: 2
                        }
                      }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsVisualization;
