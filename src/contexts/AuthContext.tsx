import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Skill, ExperienceLevel, Repository, Contribution, Badge } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isGithubConnected: boolean;
  githubUsername?: string;
  skills?: Skill[];
  experienceLevel?: ExperienceLevel;
  projectTypes?: string[];
  contributionGoals?: string[];
  savedRepositories?: { id: number; date: string; repository?: Repository }[];
  // Add missing properties to match the User type
  githubUrl?: string;
  areasOfInterest?: string[];
  contributions?: Contribution[];
  badges?: Badge[];
  contributionPoints?: number;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<AuthUser>) => Promise<void>;
}

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        if (session?.user) {
          mapSupabaseUser(session.user);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        mapSupabaseUser(session.user);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUser = (user: any) => {
    // Extract GitHub identity if available
    const githubIdentity = user.identities?.find(
      (identity: any) => identity.provider === 'github'
    );

    const mappedUser: AuthUser = {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.user_name || user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      avatarUrl: user.user_metadata?.avatar_url || undefined,
      isGithubConnected: !!githubIdentity,
      githubUsername: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
      // We'll use mock data initially - in a real app, this would come from a database
      skills: user.user_metadata?.skills || [], 
      experienceLevel: user.user_metadata?.experienceLevel || ExperienceLevel.Beginner,
      projectTypes: user.user_metadata?.projectTypes || [],
      contributionGoals: user.user_metadata?.contributionGoals || [],
      savedRepositories: user.user_metadata?.savedRepositories || [],
      githubUrl: user.user_metadata?.githubUrl || '',
      areasOfInterest: user.user_metadata?.areasOfInterest || [],
      contributions: user.user_metadata?.contributions || [],
      badges: user.user_metadata?.badges || [],
      contributionPoints: user.user_metadata?.contributionPoints || 0,
    };

    setCurrentUser(mappedUser);
    setIsLoading(false);
  };

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
          scopes: 'repo,read:user,user:email', // Request needed scopes for repo access and user info
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
      
      // In a real app, update the user data in the database
      // For this demo, we'll update the user metadata in Supabase Auth
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
      
      // Update local state
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
