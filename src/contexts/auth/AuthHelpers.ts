
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from './AuthTypes';

/**
 * Maps the Supabase user object to our internal AuthUser structure
 */
export const mapSupabaseUser = (user: any): AuthUser => {
  // Extract GitHub identity if available
  const githubIdentity = user.identities?.find(
    (identity: any) => identity.provider === 'github'
  );

  return {
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.user_name || user.user_metadata?.username || user.email?.split('@')[0] || 'user',
    avatarUrl: user.user_metadata?.avatar_url || undefined,
    isGithubConnected: !!githubIdentity,
    githubUsername: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
    skills: user.user_metadata?.skills || [], 
    experienceLevel: user.user_metadata?.experienceLevel || undefined,
    projectTypes: user.user_metadata?.projectTypes || [],
    contributionGoals: user.user_metadata?.contributionGoals || [],
    savedRepositories: user.user_metadata?.savedRepositories || [],
    githubUrl: user.user_metadata?.githubUrl || '',
    areasOfInterest: user.user_metadata?.areasOfInterest || [],
    contributions: user.user_metadata?.contributions || [],
    badges: user.user_metadata?.badges || [],
    contributionPoints: user.user_metadata?.contributionPoints || 0,
  };
};

/**
 * Initializes the auth state and handles session retrieval
 */
export const initializeAuth = async (callback: (user: AuthUser | null) => void) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    const mappedUser = mapSupabaseUser(session.user);
    callback(mappedUser);
  } else {
    callback(null);
  }
};
