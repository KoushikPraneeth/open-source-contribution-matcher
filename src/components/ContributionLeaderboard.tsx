
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUser } from '@/data/mockData';
import { Github, Trophy, Medal, Star } from 'lucide-react';

// Mockup data for the leaderboard - in a real app, this would come from a backend
const leaderboardData = [
  {
    id: 1,
    username: 'codecrafter',
    avatarUrl: mockUser.avatarUrl,
    contributions: 73,
    preferredLanguages: ['JavaScript', 'TypeScript', 'React'],
    streak: 14,
    role: 'Top Contributor'
  },
  {
    id: 2,
    username: 'devguru',
    avatarUrl: mockUser.avatarUrl,
    contributions: 65,
    preferredLanguages: ['Python', 'Django', 'JavaScript'],
    streak: 9,
    role: 'Active Contributor'
  },
  {
    id: 3,
    username: 'opensourcehero',
    avatarUrl: mockUser.avatarUrl,
    contributions: 58,
    preferredLanguages: ['Go', 'Rust', 'C++'],
    streak: 6,
    role: 'Regular Contributor'
  },
  {
    id: 4,
    username: 'codeartist',
    avatarUrl: mockUser.avatarUrl,
    contributions: 42,
    preferredLanguages: ['Java', 'Spring', 'Kotlin'],
    streak: 4,
    role: 'Rising Star'
  },
  {
    id: 5,
    username: 'bugslayer',
    avatarUrl: mockUser.avatarUrl,
    contributions: 37,
    preferredLanguages: ['C#', '.NET', 'TypeScript'],
    streak: 3,
    role: 'Newcomer'
  }
];

export default function ContributionLeaderboard() {
  const [timeFrame, setTimeFrame] = useState('month');
  
  // This would be connected to real data in a production app
  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      case 'all':
        return 'All Time';
      default:
        return 'This Month';
    }
  };
  
  const getBadgeVariant = (position: number) => {
    switch (position) {
      case 0:
        return "default";
      case 1:
        return "secondary";
      case 2:
        return "outline";
      default:
        return "outline";
    }
  };
  
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-4 w-4" />;
      case 1:
        return <Medal className="h-4 w-4" />;
      case 2:
        return <Star className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-card border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Contribution Leaderboard</CardTitle>
            <CardDescription>
              Top contributors in our community
            </CardDescription>
          </div>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="font-semibold text-lg w-6 text-center">
                  {index + 1}
                </div>
                
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.username}</span>
                    <Badge variant={getBadgeVariant(index)} className="flex items-center gap-1">
                      {getPositionIcon(index)}
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1">
                    <span>{user.contributions} contributions</span>
                    <span className="mx-1">•</span>
                    <span>{user.streak} day streak</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.preferredLanguages.map(lang => (
                      <span key={lang} className="text-xs px-1.5 py-0.5 rounded-full bg-muted">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-muted-foreground">
                <a 
                  href={`https://github.com/${user.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
