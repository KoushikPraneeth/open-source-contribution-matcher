import { useState } from "react";
import SideNavigation from "@/components/SideNavigation";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { mockUser } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { CalendarIcon, MessageSquare, ThumbsUp, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const Community = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header>Community</Header>
        <main className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Community</h1>
            <p className="text-muted-foreground">
              Connect with other open source enthusiasts and stay updated on community events.
            </p>
          </div>

          <Tabs defaultValue="feed">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 space-y-2">
                <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 space-y-1">
                  <TabsTrigger value="feed" className="justify-start px-3 py-2 h-9 text-left">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Feed
                  </TabsTrigger>
                  <TabsTrigger value="events" className="justify-start px-3 py-2 h-9 text-left">
                    <Users className="h-4 w-4 mr-2" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="justify-start px-3 py-2 h-9 text-left">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Leaderboard
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1">
                <TabsContent value="feed" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Feed</CardTitle>
                      <CardDescription>
                        Stay up-to-date with the latest discussions and activities.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                            <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{mockUser.username}</p>
                            <p className="text-sm text-muted-foreground">
                              Shared a new contribution opportunity: <a href="#" className="text-apple-blue hover:underline">Help improve documentation for React</a>
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <time dateTime="2023-10-23T16:30:00Z">October 23, 2023</time>
                              <span>•</span>
                              <Button variant="link" size="sm">Reply</Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                            <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{mockUser.username}</p>
                            <p className="text-sm text-muted-foreground">
                              Just merged a pull request! <a href="#" className="text-apple-blue hover:underline">Fixed a bug in the authentication module</a>
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <time dateTime="2023-10-22T09:15:00Z">October 22, 2023</time>
                              <span>•</span>
                              <Button variant="link" size="sm">Reply</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Join community events and workshops.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Badge>Workshop</Badge>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">React Best Practices</p>
                            <p className="text-sm text-muted-foreground">
                              Learn the best practices for building React applications.
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <time dateTime="2023-11-15T18:00:00Z">November 15, 2023</time>
                              <span>•</span>
                              <span>Online</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Badge>Meetup</Badge>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Open Source Contributors Meetup</p>
                            <p className="text-sm text-muted-foreground">
                              Connect with fellow open source contributors in your city.
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <time dateTime="2023-12-01T19:00:00Z">December 1, 2023</time>
                              <span>•</span>
                              <span>New York, NY</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leaderboard" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Leaderboard</CardTitle>
                      <CardDescription>
                        Top contributors in the community.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                              <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">{mockUser.username}</p>
                              <p className="text-sm text-muted-foreground">Top Contributor</p>
                            </div>
                          </div>
                          <Badge variant="secondary">1st</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                              <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">{mockUser.username}</p>
                              <p className="text-sm text-muted-foreground">Active Contributor</p>
                            </div>
                          </div>
                          <Badge variant="secondary">2nd</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                              <AvatarFallback>{mockUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">{mockUser.username}</p>
                              <p className="text-sm text-muted-foreground">Regular Contributor</p>
                            </div>
                          </div>
                          <Badge variant="secondary">3rd</Badge>
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

export default Community;
