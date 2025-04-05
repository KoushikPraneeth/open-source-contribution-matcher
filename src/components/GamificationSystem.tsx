
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Zap, TrendingUp, Target, Star, Trophy, Medal } from 'lucide-react';
import { BadgeCategory } from '@/types';

// Mock badges data
const badges = [
  {
    id: '1',
    name: 'First Contribution',
    description: 'Made your first pull request',
    iconUrl: '',
    dateEarned: '2025-03-15',
    category: BadgeCategory.Contribution,
    icon: GitContribution
  },
  {
    id: '2',
    name: 'Bug Hunter',
    description: 'Fixed 5 bugs in open source projects',
    iconUrl: '',
    dateEarned: '2025-03-20',
    category: BadgeCategory.Contribution,
    icon: BugFixer
  },
  {
    id: '3',
    name: 'React Expert',
    description: 'Contributed to React projects',
    iconUrl: '',
    dateEarned: '2025-03-25',
    category: BadgeCategory.Skill,
    icon: SkillMaster
  },
  {
    id: '4',
    name: 'Community Helper',
    description: 'Answered 10 questions in the community',
    iconUrl: '',
    dateEarned: '',
    category: BadgeCategory.Community,
    icon: CommunityHelper,
    locked: true,
    progress: 40
  },
  {
    id: '5',
    name: 'Documentation Wizard',
    description: 'Improved documentation in 3 projects',
    iconUrl: '',
    dateEarned: '',
    category: BadgeCategory.Contribution,
    icon: DocWizard,
    locked: true,
    progress: 66
  }
];

// Custom badge icon components
function GitContribution() {
  return <Award className="h-12 w-12 text-amber-500" />;
}

function BugFixer() {
  return <Zap className="h-12 w-12 text-purple-500" />;
}

function SkillMaster() {
  return <TrendingUp className="h-12 w-12 text-blue-500" />;
}

function CommunityHelper() {
  return <Target className="h-12 w-12 text-green-500" />;
}

function DocWizard() {
  return <Star className="h-12 w-12 text-pink-500" />;
}

// Mock achievements data
const achievements = [
  { name: 'Pull Requests', current: 7, target: 10, icon: <Trophy className="h-5 w-5 text-amber-500" /> },
  { name: 'Issues Closed', current: 5, target: 20, icon: <Medal className="h-5 w-5 text-blue-500" /> },
  { name: 'Projects', current: 3, target: 5, icon: <Star className="h-5 w-5 text-purple-500" /> }
];

const GamificationSystem = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Progress</h2>
          <p className="text-muted-foreground">Earn badges and level up your open source journey</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">485</div>
          <div className="text-xs text-muted-foreground">Contribution Points</div>
        </div>
      </div>
      
      {/* Level progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Current Level: 3</CardTitle>
            <Badge>Junior Contributor</Badge>
          </div>
          <CardDescription>485 / 750 points to Level 4</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={64} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Level 3</span>
            <span>Level 4</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Badges */}
      <div>
        <h3 className="text-xl font-medium mb-4">Your Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className={`text-center ${badge.locked ? 'opacity-70' : ''}`}>
              <CardContent className="p-4 flex flex-col items-center">
                <div className="mb-2 mt-2">
                  <badge.icon />
                </div>
                <h4 className="font-medium text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                
                {badge.locked ? (
                  <div className="w-full mt-3">
                    <Progress value={badge.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">{badge.progress}% complete</p>
                  </div>
                ) : (
                  <Badge variant="outline" className="mt-2 text-xs">Earned</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Achievement goals */}
      <div>
        <h3 className="text-xl font-medium mb-4">Current Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-full p-2">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={(achievement.current / achievement.target) * 100} 
                        className="h-2 flex-1" 
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {achievement.current}/{achievement.target}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem;
