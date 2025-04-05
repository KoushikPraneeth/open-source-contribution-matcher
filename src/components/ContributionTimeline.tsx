
import React, { useState } from 'react';
import { Contribution, ContributionStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, isEqual, isSameMonth } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { BarChart, LineChart } from '@/components/ui/chart';

interface ContributionTimelineProps {
  contributions: Contribution[];
}

const ContributionTimeline = ({ contributions }: ContributionTimelineProps) => {
  const isMobile = useIsMobile();
  const [viewType, setViewType] = useState<'calendar' | 'chart'>('calendar');
  const [timeframe, setTimeframe] = useState<'month' | '3months' | '6months' | 'year'>('month');
  
  if (!contributions || contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Timeline</CardTitle>
          <CardDescription>
            Visualize your open source journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              Start contributing to see your timeline here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort contributions by date
  const sortedContributions = [...contributions].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return dateB - dateA;
  });
  
  // Get current month
  const currentMonth = new Date();
  
  // Generate calendar data
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Map contributions to calendar days
  const contributionMap = new Map<string, Contribution[]>();
  sortedContributions.forEach(contribution => {
    const date = format(new Date(contribution.dateAdded), 'yyyy-MM-dd');
    if (!contributionMap.has(date)) {
      contributionMap.set(date, []);
    }
    contributionMap.get(date)?.push(contribution);
  });
  
  // Group contributions by month for chart data
  const contributionsByMonth = sortedContributions.reduce((acc, contribution) => {
    const date = new Date(contribution.dateAdded);
    const month = format(date, 'MMM yyyy');
    
    if (!acc[month]) {
      acc[month] = { total: 0, byStatus: {} };
    }
    
    acc[month].total += 1;
    
    if (!acc[month].byStatus[contribution.status]) {
      acc[month].byStatus[contribution.status] = 0;
    }
    
    acc[month].byStatus[contribution.status] += 1;
    
    return acc;
  }, {} as Record<string, { total: number, byStatus: Record<string, number> }>);
  
  // Create chart data
  const chartLabels = Object.keys(contributionsByMonth).slice(-6);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Contributions',
        data: chartLabels.map(month => contributionsByMonth[month].total),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Merged',
        data: chartLabels.map(month => 
          contributionsByMonth[month].byStatus[ContributionStatus.Merged] || 0
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'In Progress',
        data: chartLabels.map(month => 
          contributionsByMonth[month].byStatus[ContributionStatus.InProgress] || 0
        ),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      }
    ]
  };
  
  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Contribution Growth',
        data: chartLabels.map((_, index) => {
          return chartLabels.slice(0, index + 1).reduce((sum, month) => {
            return sum + contributionsByMonth[month].total;
          }, 0);
        }),
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
      }
    ]
  };
  
  // Helper function for status colors
  const getStatusColor = (status: ContributionStatus) => {
    switch (status) {
      case ContributionStatus.Interested:
        return "bg-amber-100 text-amber-800 border-amber-300";
      case ContributionStatus.InProgress:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case ContributionStatus.PRSubmitted:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case ContributionStatus.Merged:
        return "bg-green-100 text-green-800 border-green-300";
      case ContributionStatus.Closed:
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Contribution Timeline</CardTitle>
            <CardDescription>
              Visualize your open source journey
            </CardDescription>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Select value={viewType} onValueChange={(value) => setViewType(value as 'calendar' | 'chart')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="chart">Chart</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewType === 'calendar' ? (
          <div className="space-y-6">
            <div className="text-center font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayContributions = contributionMap.get(dateKey) || [];
                const hasContributions = dayContributions.length > 0;
                
                return (
                  <div 
                    key={i} 
                    className={`
                      aspect-square rounded-md flex flex-col items-center justify-center
                      text-sm border border-border
                      ${hasContributions ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted/50'}
                      ${isSameMonth(day, currentMonth) ? '' : 'opacity-40'}
                    `}
                  >
                    <span className={`${hasContributions ? 'font-medium' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {hasContributions && (
                      <div className="text-xs mt-1">
                        <Badge variant="outline" className="h-5 px-1">
                          {dayContributions.length}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Recent Contributions</h3>
              <div className="space-y-3">
                {sortedContributions.slice(0, 3).map((contribution) => (
                  <div key={contribution.id} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className={getStatusColor(contribution.status)}>
                      {contribution.status}
                    </Badge>
                    <div>
                      <div className="font-medium">{contribution.issue.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(contribution.dateAdded), 'PPP')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Activity</TabsTrigger>
              <TabsTrigger value="line">Growth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar">
              <div className="h-80">
                <BarChart 
                  height={320} 
                  data={chartData}
                  options={{
                    scales: {
                      x: {
                        stacked: true
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold mt-1">{contributions.length}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-green-600">Merged</div>
                  <div className="text-2xl font-bold mt-1 text-green-700">
                    {contributions.filter(c => c.status === ContributionStatus.Merged).length}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium text-blue-600">In Progress</div>
                  <div className="text-2xl font-bold mt-1 text-blue-700">
                    {contributions.filter(c => c.status === ContributionStatus.InProgress).length}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="line">
              <div className="h-80">
                <LineChart 
                  height={320} 
                  data={lineChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Contribution Summary</h3>
                <p className="text-sm text-muted-foreground">
                  You've contributed to {sortedContributions.reduce((acc, curr) => {
                    if (!acc.includes(curr.issue.repositoryName)) {
                      acc.push(curr.issue.repositoryName);
                    }
                    return acc;
                  }, [] as string[]).length} repositories over time.
                  Your most active month was {Object.entries(contributionsByMonth)
                    .sort((a, b) => b[1].total - a[1].total)[0]?.[0] || 'N/A'}.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionTimeline;
