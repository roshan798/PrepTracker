export type Status = 'not-started' | 'in-progress' | 'completed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProblemCodeLanguage = 'plaintext' | 'javascript' | 'python' | 'java' | 'cpp';
export type Theme = 'dark' | 'light';
export type AccentPalette =
  | 'electric'
  | 'sunrise'
  | 'aurora'
  | 'ocean'
  | 'citrus'
  | 'berry'
  | 'forest'
  | 'ember'
  | 'midnight'
  | 'blossom';

export interface Problem {
  id: string;
  name: string;
  difficulty: Difficulty;
  status: Status;
  notes: string;
  url?: string;
  leetcodeNumber?: number;
  reviewDueAt?: string;
  reviewIntervalDays?: number;
  reviewCount?: number;
  lastReviewedAt?: string;
  solutionCode?: string;
  solutionLanguage?: ProblemCodeLanguage;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Subtopic {
  id: string;
  name: string;
  status: Status;
  notes: string;
  problems: Problem[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  status: Status;
  notes: string;
  subtopics: Subtopic[];
  week?: number;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'predefined' | 'custom';
  duration?: string;
  color: string;
  isPinned?: boolean;
  sortOrder?: number;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyReference {
  roadmapId: string;
  topicId?: string;
  subtopicId?: string;
  problemId?: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  reference?: StudyReference;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  roadmaps: Roadmap[];
  quickNotes: QuickNote[];
  theme: Theme;
  accentPalette: AccentPalette;
  lastUpdated: string;
}

export type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_ACCENT_PALETTE'; payload: AccentPalette }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_QUICK_NOTE'; payload: QuickNote }
  | { type: 'UPDATE_QUICK_NOTE'; payload: QuickNote }
  | { type: 'DELETE_QUICK_NOTE'; payload: string }
  | { type: 'ADD_ROADMAP'; payload: Roadmap }
  | { type: 'DELETE_ROADMAP'; payload: string }
  | { type: 'TOGGLE_ROADMAP_PIN'; payload: string }
  | { type: 'MOVE_ROADMAP'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'UPDATE_ROADMAP_META'; payload: { id: string; name: string; description: string } }
  | { type: 'ADD_TOPIC'; payload: { roadmapId: string; topic: Topic } }
  | { type: 'UPDATE_TOPIC'; payload: { roadmapId: string; topicId: string; updates: Partial<Topic> } }
  | { type: 'DELETE_TOPIC'; payload: { roadmapId: string; topicId: string } }
  | { type: 'ADD_SUBTOPIC'; payload: { roadmapId: string; topicId: string; subtopic: Subtopic } }
  | { type: 'UPDATE_SUBTOPIC'; payload: { roadmapId: string; topicId: string; subtopicId: string; updates: Partial<Subtopic> } }
  | { type: 'DELETE_SUBTOPIC'; payload: { roadmapId: string; topicId: string; subtopicId: string } }
  | { type: 'UPDATE_PROBLEM'; payload: { roadmapId: string; topicId: string; subtopicId: string; problemId: string; updates: Partial<Problem> } }
  | { type: 'ADD_PROBLEM'; payload: { roadmapId: string; topicId: string; subtopicId: string; problem: Problem } }
  | { type: 'DELETE_PROBLEM'; payload: { roadmapId: string; topicId: string; subtopicId: string; problemId: string } };

export interface RoadmapStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percentage: number;
  problemsTotal: number;
  problemsCompleted: number;
}
