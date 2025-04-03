
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isGithubConnected: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('contribspark_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - would be replaced by real auth service
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock successful login after 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: '123456',
        email,
        username: email.split('@')[0],
        avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
        isGithubConnected: false
      };
      
      setCurrentUser(user);
      localStorage.setItem('contribspark_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Mock successful signup after 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: '123456',
        email,
        username,
        isGithubConnected: false
      };
      
      setCurrentUser(user);
      localStorage.setItem('contribspark_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      // Mock successful GitHub login after 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: '789012',
        email: 'github-user@example.com',
        username: 'github-user',
        avatarUrl: 'https://avatars.githubusercontent.com/u/87654321',
        isGithubConnected: true
      };
      
      setCurrentUser(user);
      localStorage.setItem('contribspark_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('contribspark_user');
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
