
import { githubCore } from './githubCore';
import { getUserProfile, getUserRepositories, getUserContributions } from './profileService';
import { searchRepositories, getBeginnerFriendlyIssues } from './repositoryService';
import { getMatchedRepositories } from './matchingService';
export { GitHubRepository, GitHubIssue } from './types';

class GitHubService {
  initialize = githubCore.initialize.bind(githubCore);
  getUserProfile = getUserProfile;
  getUserRepositories = getUserRepositories;
  searchRepositories = searchRepositories;
  getBeginnerFriendlyIssues = getBeginnerFriendlyIssues;
  getUserContributions = getUserContributions;
  getMatchedRepositories = getMatchedRepositories;
}

// Export a singleton instance for backwards compatibility
export const githubService = new GitHubService();
