
import { useEffect } from 'react';
import { TooltipTour, TooltipStep, useTooltipTour } from '@/components/ui/tooltip-tour';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth } from '@/contexts/AuthContext';

export function OnboardingTour() {
  const { currentUser } = useAuth();
  const { startTour, hasCompleted } = useTooltipTour('dashboard-tour');
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage('first-dashboard-visit', true);
  
  useEffect(() => {
    // Start tour automatically on first visit if user is logged in
    if (isFirstVisit && currentUser && !hasCompleted) {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => {
        startTour();
        setIsFirstVisit(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, isFirstVisit, hasCompleted, startTour, setIsFirstVisit]);
  
  const tourSteps: TooltipStep[] = [
    {
      targetId: 'dashboard-header',
      title: 'Welcome to ContribSpark!',
      content: 'This is your personal dashboard where you can track your open source journey.',
      position: 'bottom'
    },
    {
      targetId: 'user-stats',
      title: 'Your Contribution Stats',
      content: 'See your contribution metrics and track your progress over time.',
      position: 'bottom'
    },
    {
      targetId: 'skills-section',
      title: 'Your Skills',
      content: 'These are the skills you\'ve added. You can update them anytime in your profile.',
      position: 'left'
    },
    {
      targetId: 'recent-activity',
      title: 'Recent Activity',
      content: 'Keep track of your latest contributions and engagement with projects.',
      position: 'top'
    },
    {
      targetId: 'github-connect',
      title: 'Connect with GitHub',
      content: 'Link your GitHub account to see personalized recommendations and track contributions automatically.',
      position: 'bottom'
    },
    {
      targetId: 'navigation-sidebar',
      title: 'Navigation',
      content: 'Access all features of ContribSpark from this sidebar navigation.',
      position: 'right'
    }
  ];
  
  return (
    <TooltipTour 
      steps={tourSteps} 
      tourId="dashboard-tour" 
      startAutomatically={false}
    />
  );
}

export default OnboardingTour;
