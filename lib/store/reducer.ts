import { AppState, Action, Status } from '../types';
import { PREDEFINED_ROADMAPS } from '@/data/data';
import { sortRoadmaps } from '../roadmap-utils';

function getInitialState(): AppState {
  return {
    roadmaps: PREDEFINED_ROADMAPS,
    theme: 'dark',
    accentPalette: 'electric',
    lastUpdated: new Date().toISOString(),
  };
}

function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload, accentPalette: action.payload.accentPalette ?? 'electric' };

    case 'SET_THEME':
      return { ...state, theme: action.payload, lastUpdated: now };

    case 'SET_ACCENT_PALETTE':
      return { ...state, accentPalette: action.payload, lastUpdated: now };

    case 'ADD_ROADMAP':
      return {
        ...state,
        roadmaps: [
          ...state.roadmaps,
          {
            ...action.payload,
            isPinned: false,
            sortOrder: state.roadmaps.reduce(
              (max, roadmap, index) => Math.max(max, roadmap.sortOrder ?? index),
              -1
            ) + 1,
          },
        ],
        lastUpdated: now,
      };

    case 'DELETE_ROADMAP':
      return { ...state, roadmaps: state.roadmaps.filter(r => r.id !== action.payload), lastUpdated: now };

    case 'TOGGLE_ROADMAP_PIN':
      return {
        ...state,
        roadmaps: state.roadmaps.map(roadmap =>
          roadmap.id === action.payload
            ? { ...roadmap, isPinned: !roadmap.isPinned }
            : roadmap
        ),
        lastUpdated: now,
      };

    case 'MOVE_ROADMAP': {
      const ordered = sortRoadmaps(state.roadmaps);
      const currentIndex = ordered.findIndex(roadmap => roadmap.id === action.payload.id);
      const targetIndex = currentIndex + (action.payload.direction === 'up' ? -1 : 1);
      const currentIsPinned = ordered[currentIndex]?.isPinned === true;
      const targetIsPinned = ordered[targetIndex]?.isPinned === true;
      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= ordered.length ||
        currentIsPinned !== targetIsPinned
      ) {
        return state;
      }

      [ordered[currentIndex], ordered[targetIndex]] = [ordered[targetIndex], ordered[currentIndex]];
      return {
        ...state,
        roadmaps: ordered.map((roadmap, sortOrder) => ({ ...roadmap, sortOrder })),
        lastUpdated: now,
      };
    }

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
