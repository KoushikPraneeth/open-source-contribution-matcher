
import { githubCore } from "./githubCore";
import { GitHubRepository } from "./types";

export async function getUserProfile() {
  if (!await githubCore.ensureInitialized()) return null;
  
  try {
    const octokit = githubCore.getOctokit();
    if (!octokit) return null;
    
    const { data } = await octokit.users.getAuthenticated();
    return data;
  } catch (error) {
    console.error("Failed to fetch GitHub user profile:", error);
    return null;
  }
}

export async function getUserRepositories(): Promise<GitHubRepository[]> {
  if (!await githubCore.ensureInitialized()) return [];
  
  try {
    const octokit = githubCore.getOctokit();
    if (!octokit) return [];
    
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    // Map API response to our interface
    return data.map(repo => githubCore.mapRepositoryData(repo));
  } catch (error) {
    console.error("Failed to fetch user repositories:", error);
    return [];
  }
}

export async function getUserContributions() {
  if (!await githubCore.ensureInitialized()) return null;
  
  try {
    const userProfile = await getUserProfile();
    if (!userProfile) return null;
    
    const octokit = githubCore.getOctokit();
    if (!octokit) return null;
    
    // Get user pull requests
    const { data: pullRequests } = await octokit.search.issuesAndPullRequests({
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
