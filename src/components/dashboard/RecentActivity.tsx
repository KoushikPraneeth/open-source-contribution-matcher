
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitPullRequest } from "lucide-react";

const RecentActivity = () => {
  return (
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
  );
};

export default RecentActivity;
