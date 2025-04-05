
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Award, Code, BookOpen, Users, ArrowRight, Menu } from 'lucide-react';
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
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600">
        {/* Hero Header */}
        <header className="bg-transparent backdrop-blur-sm px-4 py-5 flex items-center justify-between">
          <div className="text-white font-bold text-xl">
            Contrib<span className="text-white/90">Spark</span>
          </div>
          
          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="text-white hover:bg-white/10">
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
                <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="text-white border-white hover:bg-white/10">Get Started</Button>
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
          {/* Wave overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZjA4Ij48cGF0aCBkPSJNMTI4MCAxNDBWMFM5OTMuNDYgMTQwIDY0MCAxMzkgMCAwIDAgMHYxNDB6Ii8+PC9nPjwvc3ZnPg==')] bg-center bg-no-repeat bg-cover opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Find Your Perfect Open Source Contribution
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
              Stop searching, start contributing. ContribSpark matches your skills to beginner-friendly issues in active projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto bg-white text-blue-600 hover:bg-white/90">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto text-white border-white hover:bg-white/10">
                  <Github className="h-4 w-4" /> Sign In with GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How ContribSpark Works</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Github className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Connect GitHub</h3>
                <p className="text-gray-600">Link your GitHub account to get personalized recommendations</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <Code className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Add Your Skills</h3>
                <p className="text-gray-600">Tell us your programming languages, frameworks, and interests</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Get Matched</h3>
                <p className="text-gray-600">Receive personalized suggestions for beginner-friendly issues</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-pink-100 p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Track Progress</h3>
                <p className="text-gray-600">Monitor your contributions and see your skills grow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-100 to-indigo-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Join a Thriving Community</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with other contributors, share your journey, and find mentorship opportunities.
            </p>
            <div className="flex items-center justify-center mb-8">
              <Users className="h-16 w-16 text-blue-600" />
            </div>
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">Join ContribSpark Today</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white px-4 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-white font-bold text-xl mb-4 md:mb-0">
              Contrib<span className="text-blue-400">Spark</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/signin" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-gray-400 text-sm">
              © 2025 ContribSpark. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
