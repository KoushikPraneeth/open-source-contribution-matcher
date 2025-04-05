
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Check, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserPreferences from './UserPreferences';
import { ExperienceLevel } from '@/types';

const OnboardingFlow = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<ExperienceLevel>(
    currentUser?.experienceLevel || ExperienceLevel.Beginner
  );
  const [connectGithub, setConnectGithub] = useState(currentUser?.isGithubConnected || false);
  const totalSteps = 3;
  
  const handleNext = () => {
    if (step === 1) {
      // Save experience level
      if (updateUserProfile && currentUser) {
        updateUserProfile({
          ...currentUser,
          experienceLevel: experience
        });
      }
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
    }
    
    toast({
      title: "Onboarding complete!",
      description: "Your profile is set up. Let's find some open source projects for you."
    });
    
    navigate('/recommendations');
  };
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
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
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">What's your experience with open source?</h2>
              <p className="text-muted-foreground">
                This helps us tailor recommendations to your experience level
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card 
                  className={`cursor-pointer transition-all hover:scale-105 ${
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
                
                <Card 
                  className={`cursor-pointer transition-all hover:scale-105 ${
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
                
                <Card 
                  className={`cursor-pointer transition-all hover:scale-105 ${
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
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Select your skills and interests</h2>
              <p className="text-muted-foreground">
                This helps us match you with projects that fit your expertise
              </p>
              
              <UserPreferences />
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Connect with GitHub</h2>
              <p className="text-muted-foreground">
                Connecting your GitHub account helps us provide better recommendations
                and track your contributions automatically
              </p>
              
              <div className="bg-muted rounded-lg p-6 mt-6 flex flex-col items-center justify-center">
                <Button
                  size="lg"
                  variant={connectGithub ? "default" : "outline"}
                  className="gap-2 w-full md:w-auto"
                  onClick={() => setConnectGithub(!connectGithub)}
                >
                  <Github className="h-5 w-5" />
                  {connectGithub ? "GitHub Connected" : "Connect GitHub Account"}
                </Button>
                
                {connectGithub && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Account will be connected on completion
                  </p>
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
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 pt-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2">
              Complete <Check className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
