
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UserBadges = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default UserBadges;
