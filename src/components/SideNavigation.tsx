
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Sparkles, 
  Layers, 
  BookMarked, 
  BarChart, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { 
    name: 'Dashboard', 
    icon: Home, 
    path: '/dashboard'
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
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = () => (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className="block"
          onClick={() => isMobile && setIsMenuOpen(false)}
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
  );

  const SettingsLink = () => (
    <Link to="/settings" onClick={() => isMobile && setIsMenuOpen(false)}>
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
  );

  if (isMobile) {
    return (
      <div className="block md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-3 left-3 z-50"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <div className="text-apple-blue font-bold text-xl">
                  Contrib<span className="text-foreground">Spark</span>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <NavLinks />
              </div>
              <div className="p-4 border-t border-border mt-auto">
                <SettingsLink />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="hidden md:flex h-[calc(100vh-62px)] w-64 flex-col border-r border-border p-4">
      <NavLinks />
      <div className="mt-auto mb-4">
        <SettingsLink />
      </div>
    </div>
  );
};

export default SideNavigation;
