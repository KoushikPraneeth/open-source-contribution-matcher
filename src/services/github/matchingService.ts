
import { Skill } from "@/types";
import { GitHubRepository, GitHubIssue } from "./types";
import { searchRepositories, getBeginnerFriendlyIssues, getRepositoryDetails } from "./repositoryService";
import { getMatchedRepositories as matchRepositoriesToSkills } from "@/utils/repoMatching";

/**
 * Get matched repositories based on user skills and experience level
 */
export async function getMatchedRepositories(
  userSkills: Skill[],
  experienceLevel: string,
  minMatchScore: number = 50,
  maxResults: number = 50
): Promise<GitHubRepository[]> {
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
        const languageRepos = await searchRepositories(`language:${language}`, language, 10);
        allRepos = [...allRepos, ...languageRepos];
      }
    } else {
      // If no language skills, fetch trending repositories
      const trendingRepos = await searchRepositories('stars:>100', undefined, 100);
      allRepos = [...allRepos, ...trendingRepos];
    }
    
    // Add repositories with good first issues
    const beginnerIssues = await getBeginnerFriendlyIssues();
    
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
        const repoDetails = await getRepositoryDetails(owner, repo);
        if (repoDetails) {
          allRepos.push(repoDetails);
        }
      } catch (error) {
        console.error(`Failed to fetch repository details for ${repoFullName}:`, error);
      }
    }
    
    // Remove duplicates
    const uniqueRepos = Array.from(
      new Map(allRepos.map(repo => [repo.id, repo])).values()
    );
    
    // Match repositories to user skills and preferences
    const matchedRepos = matchRepositoriesToSkills(
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
