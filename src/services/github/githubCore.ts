
import { Octokit } from "@octokit/rest";
import { supabase } from "@/integrations/supabase/client";
import { GitHubRepository, GitHubIssue } from "./types";

class GitHubCore {
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
  
  async ensureInitialized(): Promise<boolean> {
    if (!this.octokit) {
      return await this.initialize();
    }
    return true;
  }
  
  getOctokit(): Octokit | null {
    return this.octokit;
  }
  
  // Map GitHub repo data to our interface
  mapRepositoryData(repo: any): GitHubRepository {
    return {
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
    };
  }
}

// Export a singleton instance
export const githubCore = new GitHubCore();
