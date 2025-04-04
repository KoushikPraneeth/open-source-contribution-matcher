
import { useState, useEffect } from 'react';
import { githubService, GitHubRepository, GitHubIssue } from '@/services/github';
import { useAuth } from '@/contexts/AuthContext';

export function useGitHub() {
  const { currentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userRepositories, setUserRepositories] = useState<GitHubRepository[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.isGithubConnected && !isInitialized) {
      initializeGitHub();
    }
  }, [currentUser]);

  const initializeGitHub = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const initialized = await githubService.initialize();
      setIsInitialized(initialized);
      
      if (initialized) {
        const profile = await githubService.getUserProfile();
        setUserProfile(profile);
        
        const repos = await githubService.getUserRepositories();
        setUserRepositories(repos);
      } else {
        setError("Failed to initialize GitHub API. Please reconnect your GitHub account.");
      }
    } catch (err) {
      console.error("GitHub hook initialization error:", err);
      setError("An error occurred while connecting to GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchRepositories = async (query: string, language?: string, minStars?: number) => {
    setIsLoading(true);
    try {
      const repos = await githubService.searchRepositories(query, language, minStars);
      return repos;
    } catch (err) {
      console.error("Repository search error:", err);
      setError("Failed to search repositories.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getBeginnerFriendlyIssues = async (language?: string) => {
    setIsLoading(true);
    try {
      const issues = await githubService.getBeginnerFriendlyIssues(language);
      return issues;
    } catch (err) {
      console.error("Issues fetch error:", err);
      setError("Failed to fetch beginner-friendly issues.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getUserContributions = async () => {
    setIsLoading(true);
    try {
      const contributions = await githubService.getUserContributions();
      return contributions;
    } catch (err) {
      console.error("Contributions fetch error:", err);
      setError("Failed to fetch your GitHub contributions.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInitialized,
    isLoading,
    error,
    userProfile,
    userRepositories,
    searchRepositories,
    getBeginnerFriendlyIssues,
    getUserContributions,
    refresh: initializeGitHub
  };
}
