
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="bg-card border-none shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">
        Welcome Back{currentUser?.username ? `, ${currentUser.username}` : ''}!
      </h2>
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
    </div>
  );
};

export default DashboardHeader;
