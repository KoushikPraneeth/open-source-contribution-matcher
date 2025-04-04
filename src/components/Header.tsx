
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, Github, Loader2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState, ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const { currentUser, logout, loginWithGithub } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    navigate('/');
  };

  const handleConnectGithub = async () => {
    setIsConnectingGithub(true);
    try {
      await loginWithGithub();
      // The page will redirect to GitHub OAuth flow
    } catch (error) {
      // Error handled in loginWithGithub
      setIsConnectingGithub(false);
    }
  };
  
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="text-apple-blue font-bold text-xl">Contrib<span className="text-foreground">Spark</span></div>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser && !currentUser.isGithubConnected ? (
          <Button 
            variant="default" 
            className="flex items-center gap-2" 
            onClick={handleConnectGithub}
            disabled={isConnectingGithub}
          >
            {isConnectingGithub ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            Connect GitHub
          </Button>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-apple-red rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto py-2">
                  <div className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <div className="font-medium">New issue recommendation</div>
                    <div className="text-sm text-muted-foreground">A new issue matching your skills was found in react/react</div>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </div>
                  <div className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <div className="font-medium">Contribution activity</div>
                    <div className="text-sm text-muted-foreground">Your PR was merged in typescript/typescript</div>
                    <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
                    <AvatarFallback>{currentUser?.username?.substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{currentUser?.username || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/skills')}>Profile & Skills</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contributions')}>My Contributions</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
