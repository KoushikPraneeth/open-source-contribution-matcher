
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Award, Code, BookOpen, Users, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="text-apple-blue font-bold text-xl">
          Contrib<span className="text-foreground">Spark</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Find Your Perfect Open Source Contribution
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop searching, start contributing. ContribSpark matches your skills to beginner-friendly issues in active projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="gap-2">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <Button size="lg">Join ContribSpark Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card px-4 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-apple-blue font-bold text-xl mb-4 md:mb-0">
            Contrib<span className="text-foreground">Spark</span>
          </div>
          <div className="flex gap-8">
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
  );
};

export default Landing;
