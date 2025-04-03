
import { useState } from "react";
import SideNavigation from "@/components/SideNavigation";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { mockUser } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Github, 
  Globe, 
  Mail, 
  Moon, 
  Shield, 
  Smartphone, 
  Sun, 
  User 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated."
    });
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header title="Settings" />
        <main className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          
          <Tabs defaultValue="profile">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 space-y-2">
                <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 space-y-1">
                  <TabsTrigger value="profile" className="justify-start px-3 py-2 h-9 text-left">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="justify-start px-3 py-2 h-9 text-left">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Account
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start px-3 py-2 h-9 text-left">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start px-3 py-2 h-9 text-left">
                    <Sun className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start px-3 py-2 h-9 text-left">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1">
                <TabsContent value="profile" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Manage your public profile information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                          <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">Change Avatar</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input id="display-name" defaultValue={mockUser.username} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" defaultValue="Open source enthusiast and web developer." />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="user@example.com" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="public-profile">Make profile public</Label>
                          <Switch id="public-profile" defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>GitHub Account</CardTitle>
                      <CardDescription>
                        Manage your connected GitHub account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center p-4 border rounded-md bg-muted/50">
                        <Github className="h-8 w-8 mr-4" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Connected to GitHub</h3>
                          <p className="text-sm text-muted-foreground">
                            Your account is connected to GitHub as <strong>{mockUser.username}</strong>
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Disconnect</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">GitHub Permissions</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="read-repos">Read repositories</Label>
                            <Switch id="read-repos" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="public-contributions">Access public contributions</Label>
                            <Switch id="public-contributions" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-access">Access email</Label>
                            <Switch id="email-access" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline" className="text-destructive border-destructive">Delete Account</Button>
                      <Button>Refresh Access</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Configure how and when you receive notifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Notification Methods</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <Label htmlFor="email-notifications">Email Notifications</Label>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="h-4 w-4" />
                              <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                            </div>
                            <Switch id="mobile-notifications" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4" />
                              <Label htmlFor="web-notifications">Web Notifications</Label>
                            </div>
                            <Switch id="web-notifications" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Notification Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="new-recommendations">New issue recommendations</Label>
                            <Switch id="new-recommendations" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="issue-updates">Tracked issue updates</Label>
                            <Switch id="issue-updates" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="contribution-activity">Contribution activity</Label>
                            <Switch id="contribution-activity" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="digest-emails">Weekly digest emails</Label>
                            <Switch id="digest-emails" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>
                        Customize the look and feel of the application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Theme</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant={theme === "light" ? "default" : "outline"} 
                            className="flex flex-col items-center justify-center h-20 gap-1"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="h-6 w-6" />
                            <span>Light</span>
                          </Button>
                          <Button 
                            variant={theme === "dark" ? "default" : "outline"} 
                            className="flex flex-col items-center justify-center h-20 gap-1"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="h-6 w-6" />
                            <span>Dark</span>
                          </Button>
                          <Button 
                            variant={theme === "system" ? "default" : "outline"} 
                            className="flex flex-col items-center justify-center h-20 gap-1"
                            onClick={() => setTheme("system")}
                          >
                            <div className="flex">
                              <Sun className="h-5 w-5" />
                              <Moon className="h-5 w-5" />
                            </div>
                            <span>System</span>
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduce-motion">Reduce motion</Label>
                          <Switch id="reduce-motion" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high-contrast">High contrast</Label>
                          <Switch id="high-contrast" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                      <CardDescription>
                        Manage your privacy settings and security preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="analytics">Usage analytics</Label>
                          <Switch id="analytics" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cookie-consent">Cookie consent</Label>
                          <Switch id="cookie-consent" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="data-sharing">Contribution data sharing</Label>
                          <Switch id="data-sharing" defaultChecked />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Security</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="two-factor">Two-factor authentication</Label>
                              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                            <Switch id="two-factor" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor="password">Change password</Label>
                            <div className="flex gap-2">
                              <Input id="password" type="password" placeholder="••••••••" />
                              <Button variant="outline">Update</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Data Management</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="mr-2 h-4 w-4" />
                            Download your data
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete all data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
