export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  githubUrl: string;
  skills: Skill[];
  experienceLevel: ExperienceLevel;
  areasOfInterest: string[];
  projectTypes: string[];
  contributionGoals: string[];
  contributions: Contribution[];
  savedRepositories: { id: number; date: string; repository: Repository }[];
  isGithubConnected?: boolean;
  githubUsername?: string;
  email?: string;
  contributionPoints?: number;
  badges?: Badge[];
  notificationPreferences?: NotificationPreferences;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

export enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum SkillCategory {
  Language = "Language",
  Framework = "Framework",
  Tool = "Tool",
  Other = "Other",
}

export enum ExperienceLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface Repository {
  id: string | number; // Allow both string and number to be compatible with GitHubRepository
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  owner: {
    name: string;
    avatarUrl: string;
  };
  topics: string[];
  maintainerActivity: number; // 0-100
  html_url?: string;
  full_name?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
  open_issues_count?: number;
}

export interface Issue {
  id: string;
  title: string;
  repositoryName: string;
  repositoryUrl: string;
  url: string;
  labels: Label[];
  createdAt: string;
  requiredSkills: string[];
  complexity: IssueComplexity;
  matchScore: number; // 0-100
  matchReason: string[];
  html_url?: string;
  number?: number;
  body?: string;
  repository_url?: string;
}

export interface Label {
  name: string;
  color: string;
}

export enum IssueComplexity {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum ContributionStatus {
  Interested = "Interested",
  InProgress = "In Progress",
  PRSubmitted = "PR Submitted",
  Merged = "Merged",
  Closed = "Closed",
}

export interface Contribution {
  id: string;
  issue: Issue;
  status: ContributionStatus;
  dateAdded: string;
  notes?: string;
  prUrl?: string;
  points?: number; // For gamification
}

// User feedback types
export type RepositoryFeedbackType = 'like' | 'dislike' | 'save' | 'hide';

export interface RepositoryFeedback {
  userId: string;
  repositoryId: number;
  feedbackType: RepositoryFeedbackType;
  date: string;
}

// New types for badges and gamification
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  dateEarned: string;
  category: BadgeCategory;
}

export enum BadgeCategory {
  Achievement = "Achievement",
  Contribution = "Contribution",
  Skill = "Skill",
  Community = "Community"
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  issueMatches: boolean;
  contributionUpdates: boolean;
  communityMessages: boolean;
}

// Discussion/forum types
export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  replies: DiscussionReply[];
  likes: number;
  views: number;
}

export interface DiscussionReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
}
