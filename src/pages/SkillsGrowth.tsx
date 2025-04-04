import { useState } from "react";
import SideNavigation from "@/components/SideNavigation";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, BarChartHorizontal, PieChart, LineChart, Calendar, TrendingUp } from "lucide-react";
import { mockUser } from "@/data/mockData";
import { SkillCategory, SkillLevel } from "@/types";
import SkillsSection from "@/components/SkillsSection";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid
} from "recharts";

// Mock data for charts
const contributionsBySkill = [
  { name: "JavaScript", value: 12, color: "#f1e05a" },
  { name: "TypeScript", value: 8, color: "#2b7489" },
  { name: "React", value: 7, color: "#61dafb" },
  { name: "CSS", value: 5, color: "#563d7c" },
  { name: "HTML", value: 3, color: "#e34c26" },
  { name: "Python", value: 2, color: "#3572A5" },
];

const growthOverTime = [
  { month: "Jan", contributions: 2, skills: 1 },
  { month: "Feb", contributions: 3, skills: 2 },
  { month: "Mar", contributions: 5, skills: 3 },
  { month: "Apr", contributions: 4, skills: 3 },
  { month: "May", contributions: 7, skills: 4 },
  { month: "Jun", contributions: 9, skills: 5 },
];

const skillsByLevel = [
  { name: "Beginner", value: 5, color: "#FFB1C1" },
  { name: "Intermediate", value: 8, color: "#6ACDFF" },
  { name: "Advanced", value: 3, color: "#4ADE80" },
];

const SkillsGrowth = () => {
  const [chartView, setChartView] = useState<"bar" | "pie" | "line">("bar");
  
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header>Skills Growth</Header>
        <main className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Skills Growth</h1>
            <p className="text-muted-foreground">
              Track your open source contributions by skill and measure your growth over time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 text-apple-blue mr-2" />
                  <span className="text-3xl font-bold">16</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Skills Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-apple-green mr-2" />
                  <span className="text-3xl font-bold">8</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Contribution Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-3xl font-bold">7</span>
                  <span className="text-muted-foreground ml-2">days</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Contribution Analytics</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant={chartView === "bar" ? "default" : "outline"} 
                        size="icon" 
                        onClick={() => setChartView("bar")}
                      >
                        <BarChartHorizontal className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={chartView === "pie" ? "default" : "outline"} 
                        size="icon" 
                        onClick={() => setChartView("pie")}
                      >
                        <PieChart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={chartView === "line" ? "default" : "outline"} 
                        size="icon" 
                        onClick={() => setChartView("line")}
                      >
                        <LineChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {chartView === "bar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={contributionsBySkill}
                          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="value">
                            {contributionsBySkill.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                    {chartView === "pie" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={skillsByLevel}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={(entry) => `${entry.name}: ${entry.value}`}
                          >
                            {skillsByLevel.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    {chartView === "line" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={growthOverTime}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="contributions"
                            stroke="#0066CC"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="skills" stroke="#4ADE80" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <SkillsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkillsGrowth;
