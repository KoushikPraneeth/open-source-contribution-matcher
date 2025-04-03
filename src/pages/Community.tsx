
import SideNavigation from "@/components/SideNavigation";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, BookOpen, ExternalLink, MessageSquare, Search, Share2, Star, Users } from "lucide-react";

const Community = () => {
  // Mock community data
  const contributors = [
    { id: 1, name: "Alice Chen", username: "alicechen", avatar: "https://lovable.dev/opengraph-image-p98pqg.png", contributions: 87, skills: ["React", "TypeScript", "CSS"] },
    { id: 2, name: "Bob Smith", username: "bobsmith", avatar: "https://lovable.dev/opengraph-image-p98pqg.png", contributions: 65, skills: ["Python", "Django", "AWS"] },
    { id: 3, name: "Carol Wright", username: "carolw", avatar: "https://lovable.dev/opengraph-image-p98pqg.png", contributions: 54, skills: ["Vue", "JavaScript", "Node.js"] },
    { id: 4, name: "David Kim", username: "davidk", avatar: "https://lovable.dev/opengraph-image-p98pqg.png", contributions: 42, skills: ["Golang", "Docker", "Kubernetes"] },
    { id: 5, name: "Eva Patel", username: "evap", avatar: "https://lovable.dev/opengraph-image-p98pqg.png", contributions: 38, skills: ["Java", "Spring", "SQL"] },
  ];
  
  const discussions = [
    { id: 1, title: "How to approach your first open source contribution", author: "Alice Chen", comments: 24, likes: 46, date: "2 days ago" },
    { id: 2, title: "Best practices for writing good PR descriptions", author: "Bob Smith", comments: 18, likes: 32, date: "3 days ago" },
    { id: 3, title: "Finding beginner-friendly React projects to contribute to", author: "Carol Wright", comments: 15, likes: 28, date: "5 days ago" },
    { id: 4, title: "How to get your PR noticed by maintainers", author: "David Kim", comments: 12, likes: 22, date: "1 week ago" },
  ];
  
  const events = [
    { id: 1, title: "Hacktoberfest Kickoff", date: "October 1, 2025", attendees: 128, virtual: true },
    { id: 2, title: "Open Source Summit", date: "November 15, 2025", attendees: 256, virtual: false },
    { id: 3, title: "ContribSpark Community Meetup", date: "December 5, 2025", attendees: 64, virtual: true },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation />
      <div className="flex-1">
        <Header title="Community" />
        <main className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Community</h1>
            <p className="text-muted-foreground">
              Connect with other open source contributors, share experiences, and learn together.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search community discussions, members, or events..." className="pl-10" />
            </div>
            <Button className="md:w-auto">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Discussion
            </Button>
          </div>
          
          <Tabs defaultValue="discussions">
            <TabsList className="mb-6">
              <TabsTrigger value="discussions" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="contributors" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Contributors
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussions">
              <div className="grid gap-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{discussion.title}</CardTitle>
                      <CardDescription>Posted by {discussion.author} · {discussion.date}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{discussion.comments} comments</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{discussion.likes} likes</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-1 h-4 w-4" />
                          Share
                        </Button>
                        <Button size="sm">
                          View Thread
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contributors">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contributors.map((contributor) => (
                  <Card key={contributor.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contributor.avatar} alt={contributor.name} />
                          <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{contributor.name}</CardTitle>
                          <CardDescription>@{contributor.username}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contributor.contributions} contributions</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {contributor.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{event.title}</CardTitle>
                        <Badge variant={event.virtual ? "outline" : "default"}>
                          {event.virtual ? "Virtual" : "In Person"}
                        </Badge>
                      </div>
                      <CardDescription>{event.date} · {event.attendees} attending</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Learn More
                      </Button>
                      <Button>
                        RSVP
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Community;
