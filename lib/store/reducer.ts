import { AppState, Action, Status } from '../types';
import { PREDEFINED_ROADMAPS } from '@/data/data';

function getInitialState(): AppState {
  return {
    roadmaps: PREDEFINED_ROADMAPS,
    theme: 'dark',
    lastUpdated: new Date().toISOString(),
  };
}

function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'SET_THEME':
      return { ...state, theme: action.payload, lastUpdated: now };

    case 'ADD_ROADMAP':
      return { ...state, roadmaps: [...state.roadmaps, action.payload], lastUpdated: now };

    case 'DELETE_ROADMAP':
      return { ...state, roadmaps: state.roadmaps.filter(r => r.id !== action.payload), lastUpdated: now };

    case 'UPDATE_ROADMAP_META':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.id
            ? { ...r, name: action.payload.name, description: action.payload.description, updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? { ...r, topics: [...r.topics, action.payload.topic], updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId ? { ...t, ...action.payload.updates } : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? { ...r, topics: r.topics.filter(t => t.id !== action.payload.topicId), updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? { ...t, subtopics: [...t.subtopics, action.payload.subtopic] }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;
                const updatedSubtopics = t.subtopics.map(s =>
                  s.id === action.payload.subtopicId ? { ...s, ...action.payload.updates } : s
                );
                const totalS = updatedSubtopics.length;
                const completedS = updatedSubtopics.filter(s => s.status === 'completed').length;
                const inProgressS = updatedSubtopics.filter(s => s.status === 'in-progress').length;
                const topicStatus: Status =
                  totalS > 0 && completedS === totalS ? 'completed'
                    : completedS > 0 || inProgressS > 0 ? 'in-progress'
                      : 'not-started';
                return { ...t, subtopics: updatedSubtopics, status: topicStatus };
              }),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? { ...t, subtopics: t.subtopics.filter(s => s.id !== action.payload.subtopicId) }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;
                const updatedSubtopics = t.subtopics.map(s => {
                  if (s.id !== action.payload.subtopicId) return s;
                  const updatedProblems = s.problems.map(p =>
                    p.id === action.payload.problemId ? { ...p, ...action.payload.updates } : p
                  );
                  const total = updatedProblems.length;
                  const completed = updatedProblems.filter(p => p.status === 'completed').length;
                  const inProgress = updatedProblems.filter(p => p.status === 'in-progress').length;
                  const subtopicStatus: Status =
                    total > 0 && completed === total ? 'completed'
                      : completed > 0 || inProgress > 0 ? 'in-progress'
                        : 'not-started';
                  return { ...s, problems: updatedProblems, status: subtopicStatus };
                });
                const totalS = updatedSubtopics.length;
                const completedS = updatedSubtopics.filter(s => s.status === 'completed').length;
                const inProgressS = updatedSubtopics.filter(s => s.status === 'in-progress').length;
                const topicStatus: Status =
                  totalS > 0 && completedS === totalS ? 'completed'
                    : completedS > 0 || inProgressS > 0 ? 'in-progress'
                      : 'not-started';
                return { ...t, subtopics: updatedSubtopics, status: topicStatus };
              }),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? {
                    ...t,
                    subtopics: t.subtopics.map(s =>
                      s.id === action.payload.subtopicId
                        ? { ...s, problems: [...s.problems, action.payload.problem] }
                        : s
                    ),
                  }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? {
                    ...t,
                    subtopics: t.subtopics.map(s =>
                      s.id === action.payload.subtopicId
                        ? { ...s, problems: s.problems.filter(p => p.id !== action.payload.problemId) }
                        : s
                    ),
                  }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    default:
      return state;
  }
}

export { getInitialState, reducer };
