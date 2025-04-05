
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/HeaderWithNotifications";
import SideNavigation from "@/components/SideNavigation";
import SkillsVisualization from "@/components/SkillsVisualization";
import GamificationSystem from "@/components/GamificationSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const SkillsGrowth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>Skills Growth | ContribSpark</title>
        <meta name="description" content="Track your skills growth and achievements in open source contributions." />
      </Helmet>
      
      <div className="flex min-h-screen flex-col md:flex-row bg-background">
        <SideNavigation />
        <div className="flex-1">
          <Header />
          <main className="container py-6 px-4 md:px-6">
            <h1 className="text-2xl font-semibold mb-6">Skills & Achievements</h1>
            
            <Tabs defaultValue="skills" className="space-y-6">
              <TabsList className="mb-2">
                <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills">
                <SkillsVisualization />
              </TabsContent>
              
              <TabsContent value="achievements">
                <GamificationSystem />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default SkillsGrowth;
