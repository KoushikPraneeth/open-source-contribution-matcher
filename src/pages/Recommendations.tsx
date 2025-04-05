
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SideNavigation from "@/components/SideNavigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RecommendedRepos from "@/components/RecommendedRepos";
import EnhancedIssueExplorer from "@/components/EnhancedIssueExplorer";

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState<string>("repositories");
  
  return (
    <>
      <Helmet>
        <title>Recommendations | ContribSpark</title>
        <meta name="description" content="Discover open source projects that match your skills and interests. Find beginner-friendly issues to contribute to." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col md:flex-row">
          <SideNavigation />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold">Recommendations</h1>
              
              <Card className="bg-card border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Find Your Next Contribution</CardTitle>
                  <CardDescription>
                    Discover repositories and issues that match your skills and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our matching algorithm finds open source projects and specific issues where 
                    your skills and experience can make the greatest impact. Save repositories 
                    you're interested in or jump directly to an issue to start contributing!
                  </p>
                </CardContent>
              </Card>
              
              <Tabs 
                defaultValue="repositories" 
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="repositories">Repositories</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                </TabsList>
                
                <TabsContent value="repositories">
                  <RecommendedRepos />
                </TabsContent>
                
                <TabsContent value="issues">
                  <EnhancedIssueExplorer />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
