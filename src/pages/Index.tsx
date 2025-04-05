
import { useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Star, GitPullRequest, BookOpen } from "lucide-react";
import SideNavigation from "@/components/SideNavigation";
import HeaderWithNotifications from "@/components/HeaderWithNotifications";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded components for performance optimization
const UserStats = lazy(() => import("@/components/UserStats"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));

// Skeleton loaders for lazy-loaded components
const UserStatsSkeleton = () => (
  <Card className="bg-card border-none shadow-sm">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </CardContent>
  </Card>
);

const SkillsSectionSkeleton = () => (
  <Card className="bg-card border-none shadow-sm">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Redirect to the onboarding if user has no skills set up
  useEffect(() => {
    if (isAuthenticated && currentUser && (!currentUser.skills || currentUser.skills.length === 0)) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Redirect to the landing page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>Dashboard | ContribSpark</title>
        <meta name="description" content="View your open source contribution dashboard. Track your progress and find new issues to contribute to." />
      </Helmet>
      
      <div className="flex min-h-screen flex-col md:flex-row bg-background">
        <SideNavigation />
        <div className="flex-1">
          <HeaderWithNotifications />
          <main className="container py-6 px-4 md:px-6">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      Welcome Back{currentUser?.username ? `, ${currentUser.username}` : ''}!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ready to start contributing to open source? Let's find the perfect issue for you.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        className="flex items-center gap-2"
                        onClick={() => navigate('/recommendations')}
                      >
                        <Search className="h-4 w-4" />
                        Find Projects
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => navigate('/saved')}
                      >
                        <BookOpen className="h-4 w-4" />
                        Your Saved Items
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Suspense fallback={<UserStatsSkeleton />}>
                  <UserStats />
                </Suspense>
                
                <Card className="bg-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">You saved a repository</p>
                          <p className="text-sm text-muted-foreground">react/react</p>
                          <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="bg-green-100 p-2 rounded-full">
                          <GitPullRequest className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">You submitted a pull request</p>
                          <p className="text-sm text-muted-foreground">tailwindlabs/tailwindcss</p>
                          <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Suspense fallback={<SkillsSectionSkeleton />}>
                  <SkillsSection />
                </Suspense>
                
                <Card className="bg-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Contributions</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Saved Issues</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Active PRs</span>
                        <span className="font-medium">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {!isMobile && (
                  <Card className="bg-card border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Your Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <div className="bg-primary/10 h-10 w-10 flex items-center justify-center rounded-full mx-auto mb-2">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs font-medium">First Contribution</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <div className="bg-primary/10 h-10 w-10 flex items-center justify-center rounded-full mx-auto mb-2">
                            <GitPullRequest className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs font-medium">Bug Hunter</p>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <Button 
                          variant="link" 
                          className="text-xs" 
                          onClick={() => navigate('/skills')}
                        >
                          View All Badges
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Index;
