
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
  githubUrl?: string;
  areasOfInterest?: string[];
  contributions?: Contribution[];
  badges?: Badge[];
  contributionPoints?: number;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<AuthUser>) => Promise<void>;
}
