
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  githubUrl: string;
  skills: Skill[];
  experienceLevel: ExperienceLevel;
  areasOfInterest: string[];
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
  id: string;
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
}
