
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
import { EditIcon, Github, Link2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { Skill, SkillLevel, SkillCategory, ExperienceLevel } from '@/types';

export default function UserProfile() {
  const { currentUser } = useAuth();
  const { userProfile, userRepositories, isLoading } = useGitHub();
  const [savedRepos, setSavedRepos] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, fetch saved repositories from the database
    // For demo purposes, using mock data from localStorage
    const savedReposFromStorage = localStorage.getItem('savedRepositories');
    if (savedReposFromStorage) {
      setSavedRepos(JSON.parse(savedReposFromStorage));
    }
  }, []);
  
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
  
  return (
    <div className="min-h-screen bg-background">
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
                      <Badge variant={currentUser.experienceLevel === ExperienceLevel.Beginner ? "default" : 
                                     currentUser.experienceLevel === ExperienceLevel.Intermediate ? "secondary" : 
                                     "outline"}>
                        {currentUser.experienceLevel || ExperienceLevel.Beginner}
                      </Badge>
                    </div>
                  </div>
                  
                  {currentUser.isGithubConnected && currentUser.githubUsername && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">GitHub</h3>
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <a 
                          href={`https://github.com/${currentUser.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {currentUser.githubUsername}
                          <Link2 className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Skills</h3>
                  {currentUser.skills && currentUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill, index) => (
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="saved">
              <TabsList className="mb-4">
                <TabsTrigger value="saved">Saved Repositories</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="history">Match History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Repositories</CardTitle>
                    <CardDescription>
                      Repositories you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedRepos.length > 0 ? (
                      <div className="grid gap-4">
                        {savedRepos.map((repo) => (
                          <div 
                            key={repo.id}
                            className="flex items-start p-3 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex-grow">
                              <h3 className="font-medium">
                                <a 
                                  href={repo.html_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {repo.full_name}
                                </a>
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {repo.description || "No description provided"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{repo.language}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  Saved on {format(new Date(repo.savedAt || new Date()), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">
                          You haven't saved any repositories yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contributions">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Contributions</CardTitle>
                    <CardDescription>
                      Track your open source contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">
                        Your contributions will appear here once you start contributing to open source projects.
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
