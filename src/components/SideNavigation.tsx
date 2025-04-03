
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Sparkles, 
  Layers, 
  BookMarked, 
  BarChart, 
  Users, 
  Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { 
    name: 'Dashboard', 
    icon: Home, 
    path: '/'
  },
  { 
    name: 'Recommendations', 
    icon: Sparkles, 
    path: '/recommendations' 
  },
  { 
    name: 'My Contributions', 
    icon: Layers, 
    path: '/contributions' 
  },
  { 
    name: 'Saved Issues', 
    icon: BookMarked, 
    path: '/saved' 
  },
  { 
    name: 'Skills Growth', 
    icon: BarChart, 
    path: '/skills' 
  },
  { 
    name: 'Community', 
    icon: Users, 
    path: '/community' 
  }
];

const SideNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="hidden md:flex h-[calc(100vh-62px)] w-64 flex-col border-r border-border p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block"
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-2", 
                currentPath === item.path 
                  ? "bg-accent text-apple-blue font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-2 h-5 w-5", 
                  currentPath === item.path 
                    ? "text-apple-blue" 
                    : "text-muted-foreground"
                )} 
              />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto mb-4">
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-2", 
              currentPath === '/settings' 
                ? "bg-accent text-apple-blue font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings 
              className={cn(
                "mr-2 h-5 w-5", 
                currentPath === '/settings' 
                  ? "text-apple-blue" 
                  : "text-muted-foreground"
              )} 
            />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SideNavigation;
