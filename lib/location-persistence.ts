export const LOCATION_STORAGE_KEY = 'prepTrackerLastLocation';

export interface ActiveProblemLocation {
  roadmapId: string;
  topicId: string;
  subtopicId: string;
  problemId: string;
}

export interface SavedLocation {
  pathname: string;
  scrollTop: number;
  activeProblem?: ActiveProblemLocation;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readSavedLocation(): SavedLocation | null {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (
      !isRecord(parsed) ||
      typeof parsed.pathname !== 'string' ||
      !parsed.pathname.startsWith('/') ||
      parsed.pathname.startsWith('//') ||
      typeof parsed.scrollTop !== 'number' ||
      !Number.isFinite(parsed.scrollTop)
    ) {
      throw new Error('Saved location has an invalid format');
    }

    let activeProblem: ActiveProblemLocation | undefined;
    if (parsed.activeProblem !== undefined) {
      const value = parsed.activeProblem;
      if (
        !isRecord(value) ||
        typeof value.roadmapId !== 'string' ||
        typeof value.topicId !== 'string' ||
        typeof value.subtopicId !== 'string' ||
        typeof value.problemId !== 'string'
      ) {
        throw new Error('Saved active problem has an invalid format');
      }
      activeProblem = {
        roadmapId: value.roadmapId,
        topicId: value.topicId,
        subtopicId: value.subtopicId,
        problemId: value.problemId,
      };
    }

    return { pathname: parsed.pathname, scrollTop: parsed.scrollTop, activeProblem };
  } catch (error) {
    console.error('Failed to read saved location:', error);
    return null;
  }
}

export function saveLocation(location: SavedLocation): void {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save location:', error);
  }
}

export function getVisibleProblemLocation(container: HTMLElement): ActiveProblemLocation | undefined {
  const containerBounds = container.getBoundingClientRect();
  const viewportCenter = containerBounds.top + containerBounds.height / 2;
  let closest: { location: ActiveProblemLocation; distance: number } | undefined;

  container.querySelectorAll<HTMLElement>('[data-resume-problem]').forEach(element => {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom <= containerBounds.top || bounds.top >= containerBounds.bottom) return;

    const { roadmapId, topicId, subtopicId, resumeProblem } = element.dataset;
    if (!roadmapId || !topicId || !subtopicId || !resumeProblem) return;

    const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter);
    if (!closest || distance < closest.distance) {
      closest = {
        location: { roadmapId, topicId, subtopicId, problemId: resumeProblem },
        distance,
      };
    }
  });

  return closest?.location;
}
