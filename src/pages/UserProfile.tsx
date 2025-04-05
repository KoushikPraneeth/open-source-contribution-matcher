
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SideNavigation from '@/components/SideNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useGitHub } from '@/hooks/useGitHub';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EditIcon, Github, Link2, Calendar, User, Star, GitPullRequest, BookMarked, Award } from 'lucide-react';
import { format } from 'date-fns';
import { Skill, SkillLevel, SkillCategory, ExperienceLevel, ContributionStatus, User as UserType } from '@/types';
import UserSkillsVisualization from '@/components/UserSkillsVisualization';
import GithubConnectionStatus from '@/components/GithubConnectionStatus';
import ContributionHistory from '@/components/ContributionHistory';
import SavedRepositories from '@/components/SavedRepositories';
import UserBadges from '@/components/UserBadges';
import UserStats from '@/components/UserStats';
import { Helmet } from "react-helmet-async";

export default function UserProfile() {
  const { currentUser } = useAuth();
  const { userProfile, userRepositories, isLoading } = useGitHub();
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <SideNavigation />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <p>Please log in to view your profile.</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Add default values for missing user properties in the UserProfile component
  const userWithDefaults = {
    ...currentUser,
    badges: currentUser?.badges || [],
    contributionPoints: currentUser?.contributionPoints || 0,
    contributions: currentUser?.contributions || [],
    githubUrl: currentUser?.githubUrl || '',
    areasOfInterest: currentUser?.areasOfInterest || []
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>User Profile | ContribSpark</title>
        <meta name="description" content="View and manage your ContribSpark profile, skills, and contributions." />
      </Helmet>
      
      <Header />
      <div className="flex">
        <SideNavigation />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={currentUser.avatarUrl} />
                      <AvatarFallback>
                        {currentUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{currentUser.username}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {currentUser.email}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="flex gap-2 items-center">
                    <EditIcon className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Experience Level</h3>
                    <div>
                      <Badge variant={userWithDefaults.experienceLevel === ExperienceLevel.Beginner ? "default" : 
                                     userWithDefaults.experienceLevel === ExperienceLevel.Intermediate ? "secondary" : 
                                     "outline"}>
                        {userWithDefaults.experienceLevel || ExperienceLevel.Beginner}
                      </Badge>
                    </div>
                  </div>
                  
                  <GithubConnectionStatus user={userWithDefaults as UserType} />
                </div>
                
                <Separator className="my-4" />
                
                <UserSkillsVisualization skills={userWithDefaults.skills || []} />
                
                {userWithDefaults.badges && userWithDefaults.badges.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <UserBadges badges={userWithDefaults.badges} />
                  </>
                )}
                
                {userWithDefaults.contributionPoints && userWithDefaults.contributionPoints > 0 && (
                  <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Contribution Points</h3>
                      <span className="font-bold">{userWithDefaults.contributionPoints}</span>
                    </div>
                    <Progress 
                      value={Math.min(userWithDefaults.contributionPoints / 10, 100)} 
                      className="h-2 mt-2" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <UserStats />
            
            <Tabs defaultValue="saved">
              <TabsList className="mb-4">
                <TabsTrigger value="saved">Saved Repositories</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="history">Match History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved">
                <SavedRepositories savedRepos={userWithDefaults.savedRepositories || []} />
              </TabsContent>
              
              <TabsContent value="contributions">
                <ContributionHistory contributions={userWithDefaults.contributions || []} />
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Match History</CardTitle>
                    <CardDescription>
                      Previously recommended repositories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">
                        Your match history will be shown here as you browse repository recommendations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
