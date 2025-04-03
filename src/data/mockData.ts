
import { 
  User, 
  Skill, 
  SkillLevel, 
  SkillCategory, 
  ExperienceLevel, 
  Repository,
  Issue,
  IssueComplexity,
  Contribution,
  ContributionStatus
} from '../types';

export const mockUser: User = {
  id: '1',
  username: 'developer_alex',
  avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Dev&background=0D8ABC&color=fff',
  githubUrl: 'https://github.com/developer_alex',
  skills: [
    { name: 'JavaScript', level: SkillLevel.Intermediate, category: SkillCategory.Language },
    { name: 'React', level: SkillLevel.Intermediate, category: SkillCategory.Framework },
    { name: 'TypeScript', level: SkillLevel.Beginner, category: SkillCategory.Language },
    { name: 'Git', level: SkillLevel.Intermediate, category: SkillCategory.Tool },
    { name: 'CSS', level: SkillLevel.Intermediate, category: SkillCategory.Language },
    { name: 'Node.js', level: SkillLevel.Beginner, category: SkillCategory.Framework },
  ],
  experienceLevel: ExperienceLevel.Beginner,
  areasOfInterest: ['Web Development', 'UI/UX', 'Open Source'],
};

export const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    url: 'https://github.com/facebook/react',
    stars: 180000,
    forks: 37000,
    language: 'JavaScript',
    lastUpdated: '2023-03-28T15:30:00Z',
    owner: {
      name: 'facebook',
      avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
    },
    topics: ['javascript', 'frontend', 'ui', 'library'],
    maintainerActivity: 95,
  },
  {
    id: '2',
    name: 'vscode',
    description: 'Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.',
    url: 'https://github.com/microsoft/vscode',
    stars: 140000,
    forks: 25000,
    language: 'TypeScript',
    lastUpdated: '2023-03-28T14:22:00Z',
    owner: {
      name: 'microsoft',
      avatarUrl: 'https://avatars.githubusercontent.com/u/6154722?v=4',
    },
    topics: ['editor', 'development', 'tools'],
    maintainerActivity: 98,
  },
  {
    id: '3',
    name: 'node',
    description: 'Node.js JavaScript runtime',
    url: 'https://github.com/nodejs/node',
    stars: 89000,
    forks: 24500,
    language: 'JavaScript',
    lastUpdated: '2023-03-27T21:15:00Z',
    owner: {
      name: 'nodejs',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9950313?v=4',
    },
    topics: ['javascript', 'runtime', 'server'],
    maintainerActivity: 92,
  },
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Fix typo in documentation',
    repositoryName: 'react',
    repositoryUrl: 'https://github.com/facebook/react',
    url: 'https://github.com/facebook/react/issues/123',
    labels: [
      { name: 'good first issue', color: '7057ff' },
      { name: 'documentation', color: 'b60205' },
    ],
    createdAt: '2023-03-20T10:30:00Z',
    requiredSkills: ['JavaScript', 'Documentation'],
    complexity: IssueComplexity.Easy,
    matchScore: 95,
    matchReason: ['Matches your JavaScript skill', 'Good first issue', 'Documentation work (beginner-friendly)'],
  },
  {
    id: '2',
    title: 'Add unit tests for Button component',
    repositoryName: 'react',
    repositoryUrl: 'https://github.com/facebook/react',
    url: 'https://github.com/facebook/react/issues/456',
    labels: [
      { name: 'good first issue', color: '7057ff' },
      { name: 'testing', color: '0e8a16' },
    ],
    createdAt: '2023-03-22T09:15:00Z',
    requiredSkills: ['JavaScript', 'React', 'Jest'],
    complexity: IssueComplexity.Medium,
    matchScore: 85,
    matchReason: ['Matches your JavaScript skill', 'Matches your React skill', 'Good first issue'],
  },
  {
    id: '3',
    title: 'Improve error messages in CLI tool',
    repositoryName: 'node',
    repositoryUrl: 'https://github.com/nodejs/node',
    url: 'https://github.com/nodejs/node/issues/789',
    labels: [
      { name: 'help wanted', color: '008672' },
      { name: 'good first issue', color: '7057ff' },
    ],
    createdAt: '2023-03-25T14:45:00Z',
    requiredSkills: ['JavaScript', 'Node.js'],
    complexity: IssueComplexity.Medium,
    matchScore: 80,
    matchReason: ['Matches your JavaScript skill', 'Matches your Node.js skill', 'Good first issue'],
  },
  {
    id: '4',
    title: 'Fix CSS styling in dark mode',
    repositoryName: 'vscode',
    repositoryUrl: 'https://github.com/microsoft/vscode',
    url: 'https://github.com/microsoft/vscode/issues/101112',
    labels: [
      { name: 'bug', color: 'd73a4a' },
      { name: 'good first issue', color: '7057ff' },
      { name: 'CSS', color: 'fbca04' },
    ],
    createdAt: '2023-03-24T11:20:00Z',
    requiredSkills: ['CSS', 'TypeScript'],
    complexity: IssueComplexity.Medium,
    matchScore: 75,
    matchReason: ['Matches your CSS skill', 'Matches your TypeScript skill', 'Good first issue'],
  },
  {
    id: '5',
    title: 'Update README with new installation instructions',
    repositoryName: 'node',
    repositoryUrl: 'https://github.com/nodejs/node',
    url: 'https://github.com/nodejs/node/issues/131415',
    labels: [
      { name: 'documentation', color: 'b60205' },
      { name: 'good first issue', color: '7057ff' },
    ],
    createdAt: '2023-03-26T16:10:00Z',
    requiredSkills: ['Documentation', 'Markdown'],
    complexity: IssueComplexity.Easy,
    matchScore: 70,
    matchReason: ['Documentation work (beginner-friendly)', 'Good first issue', 'Active maintainers'],
  },
];

export const mockContributions: Contribution[] = [
  {
    id: '1',
    issue: mockIssues[0],
    status: ContributionStatus.Merged,
    dateAdded: '2023-03-21T08:45:00Z',
    notes: 'Fixed typo in React documentation',
    prUrl: 'https://github.com/facebook/react/pull/124',
  },
  {
    id: '2',
    issue: mockIssues[2],
    status: ContributionStatus.InProgress,
    dateAdded: '2023-03-26T09:30:00Z',
    notes: 'Working on improving error messages',
  },
];

// Common skills for auto-suggestion
export const commonSkills: string[] = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift',
  'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GraphQL', 'REST API', 'SQL', 'MongoDB',
  'Jest', 'Cypress', 'Webpack', 'Rollup', 'CSS', 'Sass', 'HTML', 'Markdown', 'Linux', 'Bash'
];

// Common areas of interest for auto-suggestion
export const commonAreasOfInterest: string[] = [
  'Web Development', 'Mobile Development', 'DevOps', 'Data Science', 'Machine Learning',
  'AI', 'Cloud Computing', 'Security', 'UI/UX', 'Blockchain', 'IoT', 'Game Development',
  'Open Source', 'Documentation', 'Testing', 'Performance Optimization', 'Accessibility'
];

export const defaultFilters = {
  complexity: [] as IssueComplexity[],
  skills: [] as string[],
  labels: [] as string[],
};
