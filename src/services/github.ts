
import { Octokit } from "@octokit/rest";
import { supabase } from "@/integrations/supabase/client";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  body: string | null;
  repository_url: string;
}

class GitHubService {
  private octokit: Octokit | null = null;
  
  async initialize(): Promise<boolean> {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session?.provider_token) {
      console.log("No GitHub provider token available");
      return false;
    }
    
    try {
      this.octokit = new Octokit({
        auth: session.session.provider_token
      });
      return true;
    } catch (error) {
      console.error("Failed to initialize GitHub API client:", error);
      return false;
    }
  }
  
  private async ensureInitialized(): Promise<boolean> {
    if (!this.octokit) {
      return await this.initialize();
    }
    return true;
  }
  
  async getUserProfile() {
    if (!await this.ensureInitialized()) return null;
    
    try {
      const { data } = await this.octokit!.users.getAuthenticated();
      return data;
    } catch (error) {
      console.error("Failed to fetch GitHub user profile:", error);
      return null;
    }
  }
  
  async getUserRepositories(): Promise<GitHubRepository[]> {
    if (!await this.ensureInitialized()) return [];
    
    try {
      const { data } = await this.octokit!.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });
      
      // Map API response to our interface
      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        open_issues_count: repo.open_issues_count,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url
        }
      }));
    } catch (error) {
      console.error("Failed to fetch user repositories:", error);
      return [];
    }
  }
  
  async searchRepositories(query: string, language?: string, minStars?: number): Promise<GitHubRepository[]> {
    if (!await this.ensureInitialized()) return [];
    
    let q = query;
    if (language) q += ` language:${language}`;
    if (minStars) q += ` stars:>=${minStars}`;
    
    try {
      const { data } = await this.octokit!.search.repos({
        q,
        sort: 'stars',
        order: 'desc',
        per_page: 50
      });
      
      // Map API response to our interface
      return data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        open_issues_count: repo.open_issues_count,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url
        }
      }));
    } catch (error) {
      console.error("Failed to search repositories:", error);
      return [];
    }
  }
  
  async getBeginnerFriendlyIssues(language?: string): Promise<GitHubIssue[]> {
    if (!await this.ensureInitialized()) return [];
    
    let q = 'is:issue is:open label:"good first issue"';
    if (language) q += ` language:${language}`;
    
    try {
      const { data } = await this.octokit!.search.issuesAndPullRequests({
        q,
        sort: 'created',
        order: 'desc',
        per_page: 50
      });
      
      // Map API response to our interface
      return data.items.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        labels: issue.labels.map((label: any) => ({
          name: label.name || '',
          color: label.color || ''
        })),
        body: issue.body,
        repository_url: issue.repository_url
      }));
    } catch (error) {
      console.error("Failed to fetch beginner-friendly issues:", error);
      return [];
    }
  }
  
  async getUserContributions() {
    if (!await this.ensureInitialized()) return null;
    
    try {
      const userProfile = await this.getUserProfile();
      if (!userProfile) return null;
      
      // Get user pull requests
      const { data: pullRequests } = await this.octokit!.search.issuesAndPullRequests({
        q: `author:${userProfile.login} is:pr`,
        per_page: 100
      });
      
      return {
        profile: userProfile,
        pullRequests: pullRequests.items
      };
    } catch (error) {
      console.error("Failed to fetch user contributions:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const githubService = new GitHubService();
