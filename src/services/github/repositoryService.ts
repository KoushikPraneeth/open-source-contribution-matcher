
import { githubCore } from "./githubCore";
import { GitHubRepository, GitHubIssue } from "./types";
import { getMatchedRepositories as matchRepositories } from "@/utils/repoMatching";
import { Skill } from "@/types";

export async function searchRepositories(
  query: string, 
  language?: string, 
  minStars?: number
): Promise<GitHubRepository[]> {
  if (!await githubCore.ensureInitialized()) return [];
  
  let q = query;
  if (language) q += ` language:${language}`;
  if (minStars) q += ` stars:>=${minStars}`;
  
  try {
    const octokit = githubCore.getOctokit();
    if (!octokit) return [];
    
    const { data } = await octokit.search.repos({
      q,
      sort: 'stars',
      order: 'desc',
      per_page: 50
    });
    
    // Map API response to our interface
    return data.items.map(repo => githubCore.mapRepositoryData(repo));
  } catch (error) {
    console.error("Failed to search repositories:", error);
    return [];
  }
}

export async function getBeginnerFriendlyIssues(language?: string): Promise<GitHubIssue[]> {
  if (!await githubCore.ensureInitialized()) return [];
  
  let q = 'is:issue is:open label:"good first issue"';
  if (language) q += ` language:${language}`;
  
  try {
    const octokit = githubCore.getOctokit();
    if (!octokit) return [];
    
    const { data } = await octokit.search.issuesAndPullRequests({
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
      repository_url: issue.repository_url,
      comments: issue.comments
    }));
  } catch (error) {
    console.error("Failed to fetch beginner-friendly issues:", error);
    return [];
  }
}

export async function getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository | null> {
  if (!await githubCore.ensureInitialized()) return null;
  
  try {
    const octokit = githubCore.getOctokit();
    if (!octokit) return null;
    
    const { data } = await octokit.repos.get({ owner, repo });
    return githubCore.mapRepositoryData(data);
  } catch (error) {
    console.error(`Failed to fetch repository details for ${owner}/${repo}:`, error);
    return null;
  }
}
