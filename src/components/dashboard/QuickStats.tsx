
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickStats = () => {
  return (
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
  );
};

export default QuickStats;
