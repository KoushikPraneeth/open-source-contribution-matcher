
import { Helmet } from 'react-helmet-async';
import OnboardingFlow from '@/components/OnboardingFlow';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <>
      <Helmet>
        <title>Welcome to ContribSpark | Set Up Your Profile</title>
        <meta name="description" content="Set up your profile and get personalized open source recommendations." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <OnboardingFlow />
      </div>
    </>
  );
};

export default Onboarding;
