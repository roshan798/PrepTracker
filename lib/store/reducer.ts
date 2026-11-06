import { AppState, Action, Status } from '../types';
import { PREDEFINED_ROADMAPS } from '@/data/data';
import { sortRoadmaps } from '../roadmap-utils';

function aggregateStatus(children: readonly { status: Status }[], emptyStatus: Status = 'not-started'): Status {
  if (children.length === 0) return emptyStatus;
  const completed = children.filter(child => child.status === 'completed').length;
  const inProgress = children.filter(child => child.status === 'in-progress').length;
  return completed === children.length
    ? 'completed'
    : completed > 0 || inProgress > 0
      ? 'in-progress'
      : 'not-started';
}

function normalizeProgress(roadmaps: AppState['roadmaps']): AppState['roadmaps'] {
  return roadmaps.map(roadmap => ({
    ...roadmap,
    topics: roadmap.topics.map(topic => {
      const subtopics = topic.subtopics.map(subtopic => ({
        ...subtopic,
        status: aggregateStatus(subtopic.problems, subtopic.status),
      }));
      return {
        ...topic,
        subtopics,
        status: aggregateStatus(subtopics, topic.status),
      };
    }),
  }));
}

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
      return {
        ...action.payload,
        roadmaps: normalizeProgress(action.payload.roadmaps),
        accentPalette: action.payload.accentPalette ?? 'electric',
      };

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
                t.id === action.payload.topicId
                  ? {
                    ...t,
                    ...action.payload.updates,
                    status: aggregateStatus(
                      t.subtopics,
                      action.payload.updates.status ?? t.status
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
                  ? {
                    ...t,
                    subtopics: [...t.subtopics, action.payload.subtopic],
                    status: aggregateStatus([...t.subtopics, action.payload.subtopic]),
                  }
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
                  s.id === action.payload.subtopicId
                    ? {
                      ...s,
                      ...action.payload.updates,
                      status: aggregateStatus(
                        s.problems,
                        action.payload.updates.status ?? s.status
                      ),
                    }
                    : s
                );
                const topicStatus = aggregateStatus(updatedSubtopics, t.status);
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
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;
                const subtopics = t.subtopics.filter(s => s.id !== action.payload.subtopicId);
                return {
                  ...t,
                  subtopics,
                  status: aggregateStatus(subtopics, t.status),
                };
              }),
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
                  const subtopicStatus = aggregateStatus(updatedProblems, s.status);
                  return { ...s, problems: updatedProblems, status: subtopicStatus };
                });
                const topicStatus = aggregateStatus(updatedSubtopics, t.status);
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
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;
                const subtopics = t.subtopics.map(s => {
                  if (s.id !== action.payload.subtopicId) return s;
                  const problems = [...s.problems, action.payload.problem];
                  return { ...s, problems, status: aggregateStatus(problems) };
                });
                return { ...t, subtopics, status: aggregateStatus(subtopics, t.status) };
              }),
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
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;
                const subtopics = t.subtopics.map(s => {
                  if (s.id !== action.payload.subtopicId) return s;
                  const problems = s.problems.filter(p => p.id !== action.payload.problemId);
                  return { ...s, problems, status: aggregateStatus(problems, s.status) };
                });
                return { ...t, subtopics, status: aggregateStatus(subtopics, t.status) };
              }),
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
