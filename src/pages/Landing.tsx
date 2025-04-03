
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Award, Code, BookOpen, Users, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>ContribSpark - Find Your Perfect Open Source Contribution</title>
        <meta name="description" content="Find open source projects that match your skills and interests. ContribSpark helps you discover, track, and contribute to open source." />
        <meta name="keywords" content="open source, github, contributions, beginner friendly, programming, coding, developer" />
        <meta property="og:title" content="ContribSpark - Find Your Perfect Open Source Contribution" />
        <meta property="og:description" content="Find open source projects that match your skills and interests. ContribSpark helps you discover, track, and contribute to open source." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ContribSpark - Find Your Perfect Open Source Contribution" />
        <meta name="twitter:description" content="Find open source projects that match your skills and interests. ContribSpark helps you discover, track, and contribute to open source." />
        <link rel="canonical" href="https://contribspark.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        {/* Hero Header */}
        <header className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="text-apple-blue font-bold text-xl">
            Contrib<span className="text-foreground">Spark</span>
          </div>
          
          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Your Perfect Open Source Contribution
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop searching, start contributing. ContribSpark matches your skills to beginner-friendly issues in active projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Github className="h-4 w-4" /> Sign In with GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How ContribSpark Works</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Github className="h-8 w-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect GitHub</h3>
                <p className="text-muted-foreground">Link your GitHub account to get personalized recommendations</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Code className="h-8 w-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Your Skills</h3>
                <p className="text-muted-foreground">Tell us your programming languages, frameworks, and interests</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">Receive personalized suggestions for beginner-friendly issues</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">Monitor your contributions and see your skills grow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join a Thriving Community</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with other contributors, share your journey, and find mentorship opportunities.
            </p>
            <div className="flex items-center justify-center mb-8">
              <Users className="h-16 w-16 text-apple-blue" />
            </div>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Join ContribSpark Today</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card px-4 py-8 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-apple-blue font-bold text-xl mb-4 md:mb-0">
              Contrib<span className="text-foreground">Spark</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/signin" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
              © 2025 ContribSpark. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
