
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, AreaChart } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Users, GithubIcon, BookOpen, CodeIcon } from 'lucide-react';

// Mock analytics data
const userSignups = [65, 74, 85, 98, 76, 83, 92, 86, 78, 85, 96, 110];
const contributionData = [42, 53, 67, 78, 59, 68, 75, 82, 71, 84, 92, 104];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const topLanguages = [
  { name: "JavaScript", value: 35 },
  { name: "Python", value: 22 },
  { name: "TypeScript", value: 18 },
  { name: "Java", value: 12 },
  { name: "Go", value: 8 },
  { name: "Other", value: 5 }
];

const activeUsers = [
  { date: "Apr 1", count: 245 },
  { date: "Apr 2", count: 267 },
  { date: "Apr 3", count: 289 },
  { date: "Apr 4", count: 276 },
  { date: "Apr 5", count: 293 },
  { date: "Apr 6", count: 312 },
  { date: "Apr 7", count: 305 }
];

const topUsers = [
  { id: 1, name: "Sarah Chen", contributions: 42, avatar: "", username: "sarahchen" },
  { id: 2, name: "Michael Johnson", contributions: 37, avatar: "", username: "mjohnson" },
  { id: 3, name: "Alex Rodriguez", contributions: 31, avatar: "", username: "alexr" },
  { id: 4, name: "Emily Davis", contributions: 28, avatar: "", username: "emilyd" },
  { id: 5, name: "Jason Kim", contributions: 24, avatar: "", username: "jasonk" }
];

const topRepositories = [
  { name: "facebook/react", stars: 4823, issues: 127, contributors: 42 },
  { name: "tailwindlabs/tailwindcss", stars: 3651, issues: 83, contributors: 37 },
  { name: "vuejs/vue", stars: 3142, issues: 95, contributors: 29 },
  { name: "tensorflow/tensorflow", stars: 2983, issues: 142, contributors: 54 },
  { name: "vercel/next.js", stars: 2754, issues: 114, contributors: 48 }
];

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState("month");
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard | ContribSpark</title>
        <meta name="description" content="Admin analytics and monitoring dashboard for ContribSpark" />
      </Helmet>
      
      <Header />
      
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform usage and user engagement</p>
          </div>
          
          <Button className="gap-2">
            <DownloadIcon className="h-4 w-4" /> Export Report
          </Button>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">1,245</h3>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <GithubIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contributions</p>
                <h3 className="text-2xl font-bold">867</h3>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <h3 className="text-2xl font-bold">423</h3>
                <p className="text-xs text-green-600">+16% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CodeIcon className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Merged PRs</p>
                <h3 className="text-2xl font-bold">312</h3>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Signups</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant={dateRange === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange("week")}
                      >
                        Week
                      </Button>
                      <Button
                        variant={dateRange === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange("month")}
                      >
                        Month
                      </Button>
                      <Button
                        variant={dateRange === "year" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange("year")}
                      >
                        Year
                      </Button>
                    </div>
                  </div>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    height={300}
                    data={{
                      labels: months,
                      datasets: [{
                        label: 'New Users',
                        data: userSignups,
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                      }]
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Programming Languages</CardTitle>
                  <CardDescription>Languages used across all contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    height={300}
                    data={{
                      labels: topLanguages.map(lang => lang.name),
                      datasets: [{
                        label: 'Languages',
                        data: topLanguages.map(lang => lang.value),
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.8)',
                          'rgba(244, 114, 182, 0.8)',
                          'rgba(52, 211, 153, 0.8)',
                          'rgba(251, 146, 60, 0.8)',
                          'rgba(79, 70, 229, 0.8)',
                          'rgba(156, 163, 175, 0.8)',
                        ],
                      }]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Users (Last 7 Days)</CardTitle>
                <CardDescription>Daily active users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  height={300}
                  data={{
                    labels: activeUsers.map(day => day.date),
                    datasets: [{
                      label: 'Active Users',
                      data: activeUsers.map(day => day.count),
                      borderColor: 'rgba(99, 102, 241, 1)',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      fill: true,
                    }]
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Users with the most contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {topUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{user.contributions} contributions</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Contributions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    height={300}
                    data={{
                      labels: months,
                      datasets: [{
                        label: 'Contributions',
                        data: contributionData,
                        backgroundColor: 'rgba(244, 114, 182, 0.8)',
                      }]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contributions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contribution Growth</CardTitle>
                <CardDescription>Monthly contribution totals</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  height={300}
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'PRs Opened',
                        data: [32, 42, 51, 62, 45, 55, 63, 58, 47, 52, 58, 65],
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                      },
                      {
                        label: 'PRs Merged',
                        data: [25, 35, 43, 57, 38, 48, 54, 49, 42, 47, 53, 60],
                        backgroundColor: 'rgba(52, 211, 153, 0.8)',
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="repositories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Repositories</CardTitle>
                <CardDescription>Repositories with the most user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Repository</th>
                        <th className="py-3 px-4 text-left font-medium">Stars</th>
                        <th className="py-3 px-4 text-left font-medium">Open Issues</th>
                        <th className="py-3 px-4 text-left font-medium">Contributors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRepositories.map((repo, index) => (
                        <tr key={index} className={index !== topRepositories.length - 1 ? "border-b" : ""}>
                          <td className="py-3 px-4">{repo.name}</td>
                          <td className="py-3 px-4">{repo.stars}</td>
                          <td className="py-3 px-4">{repo.issues}</td>
                          <td className="py-3 px-4">{repo.contributors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
