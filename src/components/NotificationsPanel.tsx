
import { useState } from 'react';
import { Bell, X, GitPullRequest, Star, MessageSquare, Bookmark, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'contribution',
    title: 'Your PR has been merged!',
    description: 'Congrats! Your pull request to react/react has been merged.',
    date: '5 minutes ago',
    read: false,
    icon: GitPullRequest,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100',
    link: '#'
  },
  {
    id: 2,
    type: 'match',
    title: 'New issue matches your skills',
    description: 'We found a beginner-friendly React issue that matches your skills.',
    date: '1 hour ago',
    read: false,
    icon: Star,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    link: '#'
  },
  {
    id: 3,
    type: 'community',
    title: 'Someone replied to your post',
    description: 'Jane Smith replied to your question about Redux.',
    date: '2 hours ago',
    read: true,
    icon: MessageSquare,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100',
    link: '#'
  },
  {
    id: 4,
    type: 'contribution',
    title: 'Issue was assigned to you',
    description: 'The issue "Fix button styling" has been assigned to you.',
    date: '1 day ago',
    read: true,
    icon: Bookmark,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    link: '#'
  },
  {
    id: 5,
    type: 'match',
    title: 'New repository match',
    description: 'Check out this repository that matches your interests: tailwindcss/tailwindcss',
    date: '2 days ago',
    read: true,
    icon: GitBranch,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-100',
    link: '#'
  }
];

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="h-[calc(100%-60px)]">
          <TabsList className="w-full grid grid-cols-3 p-0 h-12 rounded-none border-b">
            <TabsTrigger value="all" className="rounded-none data-[state=active]:bg-muted">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-none data-[state=active]:bg-muted">
              Unread {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="mentions" className="rounded-none data-[state=active]:bg-muted">
              Mentions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="divide-y">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <a href={notification.link} className="flex gap-3 items-start">
                        <div className={`${notification.iconBg} p-2 rounded-full`}>
                          <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.date}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="divide-y">
                {notifications.filter(n => !n.read).length > 0 ? (
                  notifications.filter(n => !n.read).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-4 hover:bg-muted/50 transition-colors bg-muted/30"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <a href={notification.link} className="flex gap-3 items-start">
                        <div className={`${notification.iconBg} p-2 rounded-full`}>
                          <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.date}
                          </p>
                        </div>
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No unread notifications
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="mentions" className="h-full m-0">
            <div className="p-4 text-center text-muted-foreground">
              No mentions yet
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
