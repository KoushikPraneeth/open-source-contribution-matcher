
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthUser, AuthContextType } from './AuthTypes';
import { mapSupabaseUser, initializeAuth } from './AuthHelpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // Initialize auth state
    initializeAuth(user => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          }
        }
      });
      
      if (error) {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
          scopes: 'repo,read:user,user:email',
        },
      });
      
      if (error) {
        toast({
          title: "GitHub Login Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    } catch (error: any) {
      console.error('GitHub login error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate with GitHub",
        variant: "destructive"
      });
    }
  };

  const updateUserProfile = async (userData: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          username: userData.username || currentUser.username,
          skills: userData.skills || currentUser.skills,
          experienceLevel: userData.experienceLevel || currentUser.experienceLevel,
          projectTypes: userData.projectTypes || currentUser.projectTypes,
          contributionGoals: userData.contributionGoals || currentUser.contributionGoals,
          savedRepositories: userData.savedRepositories || currentUser.savedRepositories,
        }
      });
      
      if (error) {
        toast({
          title: "Update Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      setCurrentUser(prev => {
        if (!prev) return userData as AuthUser;
        return { ...prev, ...userData };
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    signUp,
    loginWithGithub,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
