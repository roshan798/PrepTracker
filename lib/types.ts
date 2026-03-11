export type Status = 'not-started' | 'in-progress' | 'completed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'dark' | 'light';

export interface Problem {
  id: string;
  name: string;
  difficulty: Difficulty;
  status: Status;
  notes: string;
  url?: string;
  leetcodeNumber?: number;
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
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  roadmaps: Roadmap[];
  theme: Theme;
  lastUpdated: string;
}

export type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_ROADMAP'; payload: Roadmap }
  | { type: 'DELETE_ROADMAP'; payload: string }
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
