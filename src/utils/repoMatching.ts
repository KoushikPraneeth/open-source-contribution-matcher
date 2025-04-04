
/**
 * Utility functions for matching repositories to user skills and preferences
 */
import { GitHubRepository } from "@/services/github";
import { Skill, SkillLevel } from "@/types";

// Repository health score calculation
export const calculateRepoHealthScore = (repo: GitHubRepository): number => {
  // Base score starts at 50
  let score = 50;
  
  // Activity: More recent updates increase score
  const lastUpdated = new Date(repo.updated_at);
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate < 7) {
    score += 20; // Very recent activity
  } else if (daysSinceUpdate < 30) {
    score += 15; // Recent activity
  } else if (daysSinceUpdate < 90) {
    score += 5; // Somewhat recent activity
  } else if (daysSinceUpdate > 365) {
    score -= 20; // Stale repository
  }
  
  // Stars indicate popularity and stability
  if (repo.stargazers_count > 5000) {
    score += 15;
  } else if (repo.stargazers_count > 1000) {
    score += 10;
  } else if (repo.stargazers_count > 100) {
    score += 5;
  }
  
  // Issues indicate activity and opportunities to contribute
  if (repo.open_issues_count > 0 && repo.open_issues_count < 100) {
    score += 10; // Has issues but not overwhelming
  } else if (repo.open_issues_count >= 100) {
    score += 5; // Many issues, might be harder to get attention
  }
  
  // Topics indicate organization and documentation
  if (repo.topics.length > 5) {
    score += 10;
  } else if (repo.topics.length > 2) {
    score += 5;
  }
  
  // Check for beginner-friendly indicators in topics
  const beginnerFriendlyTerms = ['beginner', 'first-timers', 'good-first-issue', 'help-wanted'];
  if (repo.topics.some(topic => beginnerFriendlyTerms.includes(topic.toLowerCase()))) {
    score += 15;
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

// Repository matching score calculation
export const calculateMatchScore = (
  repo: GitHubRepository, 
  userSkills: Skill[], 
  experienceLevel: string
): number => {
  // Base match score starts at health score
  let score = calculateRepoHealthScore(repo);
  
  // Language matching
  const userLanguages = userSkills
    .filter(skill => skill.category === 'Language')
    .map(skill => skill.name.toLowerCase());
  
  if (repo.language && userLanguages.includes(repo.language.toLowerCase())) {
    // Bonus for matching primary language
    score += 20;
    
    // Extra bonus for skill level
    const matchingSkill = userSkills.find(
      skill => skill.name.toLowerCase() === repo.language?.toLowerCase()
    );
    
    if (matchingSkill) {
      if (matchingSkill.level === 'Advanced') {
        score += 5;
      } else if (matchingSkill.level === 'Intermediate') {
        score += 10; // Intermediate is ideal for contributions
      } else {
        score += 15; // Beginners get highest boost for matching languages
      }
    }
  }
  
  // Topic matching with user skills
  const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
  
  const matchingTopics = repo.topics.filter(topic => 
    userSkillNames.includes(topic.toLowerCase())
  );
  
  // Add points for each matching topic
  score += matchingTopics.length * 5;
  
  // Adjust based on user experience level
  if (experienceLevel === 'Beginner') {
    // Beginners prefer repos with more stars (stability)
    if (repo.stargazers_count > 1000) {
      score += 10;
    }
    
    // Beginners prefer repos with fewer open issues
    if (repo.open_issues_count > 0 && repo.open_issues_count < 50) {
      score += 10;
    }
  } else if (experienceLevel === 'Intermediate') {
    // Intermediate devs prefer balanced repos
    if (repo.stargazers_count > 100 && repo.stargazers_count < 5000) {
      score += 10;
    }
    
    if (repo.open_issues_count > 10 && repo.open_issues_count < 200) {
      score += 10;
    }
  } else if (experienceLevel === 'Advanced') {
    // Advanced devs can handle complex projects
    if (repo.open_issues_count > 50) {
      score += 5;
    }
    
    // Advanced devs may prefer newer projects with growth potential
    if (repo.stargazers_count < 1000 && repo.stargazers_count > 10) {
      score += 5;
    }
  }
  
  // Ensure final score is between 0-100
  return Math.max(0, Math.min(100, score));
};

/**
 * Sorts and filters repositories based on user skills and preferences
 */
export const getMatchedRepositories = (
  repositories: GitHubRepository[],
  userSkills: Skill[],
  experienceLevel: string,
  minMatchScore: number = 50
): GitHubRepository[] => {
  // Calculate match scores for all repositories
  const reposWithScores = repositories.map(repo => ({
    ...repo,
    matchScore: calculateMatchScore(repo, userSkills, experienceLevel)
  }));
  
  // Filter by minimum match score
  const matchedRepos = reposWithScores.filter(repo => repo.matchScore >= minMatchScore);
  
  // Sort by match score (highest first)
  return matchedRepos.sort((a, b) => b.matchScore - a.matchScore);
};
