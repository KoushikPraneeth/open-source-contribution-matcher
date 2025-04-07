
import { useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import SideNavigation from "@/components/SideNavigation";
import HeaderWithNotifications from "@/components/HeaderWithNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickStats from "@/components/dashboard/QuickStats";
import UserBadges from "@/components/dashboard/UserBadges";
import OnboardingTour from "@/components/OnboardingTour";

// Lazy-loaded components for performance optimization
const UserStats = lazy(() => import("@/components/UserStats"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));

// Skeleton loaders for lazy-loaded components
const UserStatsSkeleton = () => (
  <div className="bg-card border-none shadow-sm rounded-lg" aria-hidden="true">
    <div className="p-4 pb-2">
      <Skeleton className="h-6 w-40" />
    </div>
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  </div>
);

const SkillsSectionSkeleton = () => (
  <div className="bg-card border-none shadow-sm rounded-lg" aria-hidden="true">
    <div className="p-4 pb-2">
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="p-4">
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigate with keyboard shortcuts
      if (e.altKey) {
        switch(e.key) {
          case 'd':
            navigate('/dashboard');
            break;
          case 'r':
            navigate('/recommendations');
            break;
          case 'c':
            navigate('/contributions');
            break;
          case 's':
            navigate('/saved');
            break;
          case 'k':
            navigate('/skills');
            break;
          case 'p':
            navigate('/profile');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Dashboard | ContribSpark</title>
        <meta name="description" content="View your open source contribution dashboard. Track your progress and find new issues to contribute to." />
      </Helmet>
      
      <OnboardingTour />
      
      <div className="flex min-h-screen flex-col md:flex-row bg-background">
        <SideNavigation id="navigation-sidebar" aria-label="Main navigation" />
        <div className="flex-1">
          <HeaderWithNotifications />
          <main id="main-content" className="container py-6 px-4 md:px-6" tabIndex={-1} role="main">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div id="dashboard-header">
                  <DashboardHeader />
                </div>
                
                <div id="user-stats">
                  <Suspense fallback={<UserStatsSkeleton />}>
                    <UserStats />
                  </Suspense>
                </div>
                
                <div id="recent-activity">
                  <RecentActivity />
                </div>
              </div>
              
              <div className="space-y-6">
                <div id="skills-section">
                  <Suspense fallback={<SkillsSectionSkeleton />}>
                    <SkillsSection />
                  </Suspense>
                </div>
                
                <QuickStats />
                
                {!isMobile && <UserBadges />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Index;
