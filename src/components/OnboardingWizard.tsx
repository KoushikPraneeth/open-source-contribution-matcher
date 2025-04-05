
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ExperienceLevel, Skill, SkillLevel, SkillCategory } from '@/types';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import UserPreferences from './UserPreferences';

export default function OnboardingWizard() {
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<ExperienceLevel>(
    currentUser?.experienceLevel || ExperienceLevel.Beginner
  );
  const [skillsAdded, setSkillsAdded] = useState<boolean>(
    currentUser?.skills && currentUser.skills.length > 0
  );
  
  const totalSteps = 3;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    toast({
      title: "Onboarding Complete!",
      description: "Your profile is now set up. Let's find some great open source projects for you to contribute to!"
    });
    
    // Redirect to recommendations
    window.location.href = '/recommendations';
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Open Source Matcher</CardTitle>
        <CardDescription>
          Let's set up your profile to find the perfect open source projects for you.
        </CardDescription>
        <Progress value={(step / totalSteps) * 100} className="mt-4" />
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">What's your experience with open source?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer hover:border-primary ${experience === ExperienceLevel.Beginner ? 'border-primary bg-muted' : ''}`}
                onClick={() => setExperience(ExperienceLevel.Beginner)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Beginner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    I'm new to open source and looking for my first contributions.
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer hover:border-primary ${experience === ExperienceLevel.Intermediate ? 'border-primary bg-muted' : ''}`}
                onClick={() => setExperience(ExperienceLevel.Intermediate)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Intermediate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    I've made a few contributions and am comfortable with the basics.
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer hover:border-primary ${experience === ExperienceLevel.Advanced ? 'border-primary bg-muted' : ''}`}
                onClick={() => setExperience(ExperienceLevel.Advanced)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Advanced</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    I'm an experienced contributor looking for new challenges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">Add your skills and interests</h2>
            <UserPreferences />
            <div className="text-center mt-4">
              <Button 
                onClick={() => {
                  setSkillsAdded(true);
                  toast({
                    title: "Skills Saved",
                    description: "Your skills have been saved successfully."
                  });
                }}
                variant="outline"
              >
                Save Skills
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">Connect with GitHub (Optional)</h2>
            <p className="text-muted-foreground">
              Connecting your GitHub account helps us provide better project recommendations
              and lets you contribute more easily.
            </p>
            
            <div className="flex justify-center py-6">
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                onClick={() => {
                  if (currentUser?.isGithubConnected) {
                    toast({
                      title: "Already Connected",
                      description: "Your GitHub account is already connected."
                    });
                  } else if (updateUserProfile) {
                    updateUserProfile({
                      ...currentUser,
                      isGithubConnected: true,
                      githubUsername: currentUser?.username || "user"
                    });
                    
                    toast({
                      title: "GitHub Connected",
                      description: "Your GitHub account has been connected successfully."
                    });
                  }
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {currentUser?.isGithubConnected ? 'GitHub Connected' : 'Connect GitHub'}
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Why connect GitHub?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Get personalized repository recommendations</li>
                <li>Track your contributions automatically</li>
                <li>Fork and clone repositories with one click</li>
                <li>Submit pull requests directly from the app</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {step < totalSteps ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            Complete
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
