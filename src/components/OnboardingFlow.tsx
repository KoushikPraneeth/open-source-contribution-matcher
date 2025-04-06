
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Check, Github, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserPreferences from './UserPreferences';
import { ExperienceLevel } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

const OnboardingFlow = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use localStorage to persist onboarding state between sessions
  const [onboardingState, setOnboardingState] = useLocalStorage('onboarding-state', {
    step: 1,
    experience: currentUser?.experienceLevel || ExperienceLevel.Beginner,
    connectGithub: currentUser?.isGithubConnected || false,
    skillSearchQuery: '',
  });
  
  const [step, setStep] = useState(onboardingState.step);
  const [experience, setExperience] = useState<ExperienceLevel>(onboardingState.experience);
  const [connectGithub, setConnectGithub] = useState(onboardingState.connectGithub);
  const [skillSearchQuery, setSkillSearchQuery] = useState(onboardingState.skillSearchQuery);
  const totalSteps = 3;
  
  // Reference for touch gestures
  const flowRef = useRef<HTMLDivElement>(null);
  
  // Use touch gestures for swiping between steps
  useTouchGestures(flowRef, {
    onSwipeLeft: () => {
      if (step < totalSteps) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      if (step > 1) {
        handleBack();
      }
    },
    threshold: 70
  });
  
  // Update localStorage whenever state changes
  useEffect(() => {
    setOnboardingState({
      step,
      experience,
      connectGithub,
      skillSearchQuery
    });
  }, [step, experience, connectGithub, skillSearchQuery, setOnboardingState]);
  
  // Load state from localStorage if page is refreshed
  useEffect(() => {
    const savedState = localStorage.getItem('onboarding-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setStep(parsedState.step || 1);
        setExperience(parsedState.experience || ExperienceLevel.Beginner);
        setConnectGithub(parsedState.connectGithub || false);
        setSkillSearchQuery(parsedState.skillSearchQuery || '');
      } catch (e) {
        console.error('Error parsing saved onboarding state', e);
      }
    }
  }, []);
  
  const handleNext = () => {
    if (step === 1) {
      // Save experience level
      if (updateUserProfile && currentUser) {
        updateUserProfile({
          ...currentUser,
          experienceLevel: experience
        });
      }
      
      // Save to localStorage for offline access
      localStorage.setItem('user-experience-level', experience);
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = () => {
    // Connect Github if selected
    if (connectGithub && updateUserProfile && currentUser) {
      updateUserProfile({
        ...currentUser,
        isGithubConnected: true,
        githubUsername: currentUser.username || 'user'
      });
      
      // Save to localStorage
      localStorage.setItem('github-connected', 'true');
    }
    
    toast({
      title: "Onboarding complete!",
      description: "Your profile is set up. Let's find some open source projects for you."
    });
    
    // Clear onboarding state from localStorage after completion
    localStorage.removeItem('onboarding-state');
    
    navigate('/recommendations');
  };
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  
  return (
    <div className="container max-w-4xl mx-auto p-4" ref={flowRef}>
      <Card className="shadow-lg border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Set Up Your Profile
            </CardTitle>
            <Badge variant="outline">
              Step {step} of {totalSteps}
            </Badge>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2 mt-2" />
        </CardHeader>
        
        <CardContent className="px-4 py-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-xl font-medium">What's your experience with open source?</h2>
                <p className="text-muted-foreground">
                  This helps us tailor recommendations to your experience level
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Card 
                      className={`cursor-pointer transition-all ${
                        experience === ExperienceLevel.Beginner 
                          ? 'border-primary shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExperience(ExperienceLevel.Beginner)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Beginner</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          I'm new to open source and looking for my first contributions
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Card 
                      className={`cursor-pointer transition-all ${
                        experience === ExperienceLevel.Intermediate 
                          ? 'border-primary shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExperience(ExperienceLevel.Intermediate)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Intermediate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          I've made a few contributions and understand the basics
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Card 
                      className={`cursor-pointer transition-all ${
                        experience === ExperienceLevel.Advanced 
                          ? 'border-primary shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExperience(ExperienceLevel.Advanced)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Advanced</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          I'm an experienced contributor looking for new challenges
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                key="step2"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-xl font-medium">Select your skills and interests</h2>
                <p className="text-muted-foreground">
                  This helps us match you with projects that fit your expertise
                </p>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for skills..."
                    className="pl-10"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                  />
                </div>
                
                <UserPreferences searchQuery={skillSearchQuery} />
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                key="step3"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-6"
              >
                <h2 className="text-xl font-medium">Connect with GitHub</h2>
                <p className="text-muted-foreground">
                  Connecting your GitHub account helps us provide better recommendations
                  and track your contributions automatically
                </p>
                
                <div className="bg-muted rounded-lg p-6 mt-6 flex flex-col items-center justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant={connectGithub ? "default" : "outline"}
                      className="gap-2 w-full md:w-auto touch-manipulation"
                      onClick={() => setConnectGithub(!connectGithub)}
                    >
                      <Github className="h-5 w-5" />
                      {connectGithub ? "GitHub Connected" : "Connect GitHub Account"}
                    </Button>
                  </motion.div>
                  
                  {connectGithub && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-2 flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" /> Account will be connected on completion
                    </motion.p>
                  )}
                  
                  <div className="mt-6 text-sm text-muted-foreground">
                    <h3 className="font-medium">Benefits of connecting:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>See projects that match your GitHub activity</li>
                      <li>Track your contributions automatically</li>
                      <li>Receive personalized project recommendations</li>
                      <li>One-click fork and clone repositories</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 pt-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </motion.div>
          
          {step < totalSteps ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleNext} className="gap-2 touch-manipulation">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleComplete} className="gap-2 touch-manipulation">
                Complete <Check className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
