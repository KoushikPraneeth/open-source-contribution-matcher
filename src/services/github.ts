import { Octokit } from "@octokit/rest";
import { supabase } from "@/integrations/supabase/client";
import { Skill } from "@/types";
import { getMatchedRepositories } from "@/utils/repoMatching";

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
  matchScore?: number;
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
  comments?: number; // Add this missing property
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
  
  /**
   * Get matched repositories based on user skills and experience level
   */
  async getMatchedRepositories(
    userSkills: Skill[],
    experienceLevel: string,
    minMatchScore: number = 50,
    maxResults: number = 50
  ): Promise<GitHubRepository[]> {
    if (!await this.ensureInitialized()) return [];
    
    try {
      // First, fetch trending repositories in languages that match user skills
      const languageSkills = userSkills
        .filter(skill => skill.category === 'Language')
        .map(skill => skill.name);
      
      let allRepos: GitHubRepository[] = [];
      
      // If user has language skills, search for each language
      if (languageSkills.length > 0) {
        // Limit to 3 languages to avoid rate limiting
        const topLanguages = languageSkills.slice(0, 3);
        
        for (const language of topLanguages) {
          const languageRepos = await this.searchRepositories(`language:${language}`, language, 10);
          allRepos = [...allRepos, ...languageRepos];
        }
      } else {
        // If no language skills, fetch trending repositories
        const trendingRepos = await this.searchRepositories('stars:>100', undefined, 100);
        allRepos = [...allRepos, ...trendingRepos];
      }
      
      // Add repositories with good first issues
      const beginnerIssues = await this.getBeginnerFriendlyIssues();
      
      // Extract unique repository URLs from issues
      const repoUrls = [...new Set(beginnerIssues.map(issue => {
        // Extract repo name from repository_url
        // Format: https://api.github.com/repos/owner/repo
        const parts = issue.repository_url.split('/');
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      }))];
      
      // Fetch repositories with good first issues
      for (const repoFullName of repoUrls.slice(0, 10)) {
        try {
          const [owner, repo] = repoFullName.split('/');
          const { data } = await this.octokit!.repos.get({ owner, repo });
          
          // Map to our interface
          allRepos.push({
            id: data.id,
            name: data.name,
            full_name: data.full_name,
            description: data.description,
            html_url: data.html_url,
            stargazers_count: data.stargazers_count,
            forks_count: data.forks_count,
            language: data.language,
            updated_at: data.updated_at,
            topics: data.topics || [],
            open_issues_count: data.open_issues_count,
            owner: {
              login: data.owner.login,
              avatar_url: data.owner.avatar_url
            }
          });
        } catch (error) {
          console.error(`Failed to fetch repository details for ${repoFullName}:`, error);
        }
      }
      
      // Remove duplicates
      const uniqueRepos = Array.from(
        new Map(allRepos.map(repo => [repo.id, repo])).values()
      );
      
      // Match repositories to user skills and preferences
      const matchedRepos = getMatchedRepositories(
        uniqueRepos, 
        userSkills, 
        experienceLevel, 
        minMatchScore
      );
      
      // Return top results
      return matchedRepos.slice(0, maxResults);
    } catch (error) {
      console.error("Failed to fetch matched repositories:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const githubService = new GitHubService();
