import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isGithubConnected: boolean;
  githubUsername?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
