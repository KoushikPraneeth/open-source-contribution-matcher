import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SideNavigation from "@/components/SideNavigation";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to the landing page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header />
        <main className="container py-6">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-medium mb-4">Welcome Back!</h2>
                <p className="text-muted-foreground mb-4">
                  Ready to start contributing to open source? Let's find the perfect issue for you.
                </p>
                <div className="flex space-x-2">
                  <button className="bg-apple-blue text-white px-4 py-2 rounded-md text-sm font-medium">
                    Find Issues
                  </button>
                  <button className="bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-medium">
                    View Recommendations
                  </button>
                </div>
              </div>
              
              {/* Other dashboard content */}
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-3">Quick Stats</h2>
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
              </div>
              
              {/* Other widgets */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
