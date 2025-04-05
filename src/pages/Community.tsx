
import { useState } from "react";
import Header from "@/components/Header";
import SideNavigation from "@/components/SideNavigation";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContributionLeaderboard from "@/components/ContributionLeaderboard";
import CommunityDiscussions from "@/components/CommunityDiscussions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Award, Share2 } from "lucide-react";

export default function Community() {
  return (
    <>
      <Helmet>
        <title>Community | ContribSpark</title>
        <meta name="description" content="Connect with other open source contributors, share experiences, and learn from the community." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col md:flex-row">
          <SideNavigation />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold">Community</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2 bg-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Welcome to the Community</CardTitle>
                    <CardDescription>
                      Connect with other contributors, share your experiences, and learn together
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Join discussions, share your insights, and connect with other open source enthusiasts. 
                      Help each other find the perfect projects and overcome contribution challenges.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="default">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Join Discussion
                      </Button>
                      <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Active Members</span>
                      </div>
                      <span className="font-medium">1,245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Discussions</span>
                      </div>
                      <span className="font-medium">347</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Contributions</span>
                      </div>
                      <span className="font-medium">5,129</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="discussions">
                <TabsList className="mb-4">
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>
                
                <TabsContent value="discussions">
                  <CommunityDiscussions />
                </TabsContent>
                
                <TabsContent value="leaderboard">
                  <ContributionLeaderboard />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
