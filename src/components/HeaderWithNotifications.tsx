
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationsPanel from './NotificationsPanel';

const HeaderWithNotifications = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && isAuthenticated && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/dashboard" className="text-sm font-medium">Dashboard</Link>
                  <Link to="/recommendations" className="text-sm font-medium">Recommendations</Link>
                  <Link to="/contributions" className="text-sm font-medium">My Contributions</Link>
                  <Link to="/saved" className="text-sm font-medium">Saved Items</Link>
                  <Link to="/skills" className="text-sm font-medium">Skills Growth</Link>
                  <Link to="/community" className="text-sm font-medium">Community</Link>
                  <Link to="/settings" className="text-sm font-medium">Settings</Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <Link to="/" className="text-xl font-bold">
            Contrib<span className="text-primary">Spark</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Toggle theme" 
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <NotificationsPanel />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username || 'User'} />
                      <AvatarFallback>
                        {currentUser?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {currentUser?.username || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderWithNotifications;
