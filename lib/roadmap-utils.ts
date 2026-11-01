import { Roadmap } from './types';

export function sortRoadmaps(roadmaps: Roadmap[]): Roadmap[] {
  return roadmaps
    .map((roadmap, index) => ({ roadmap, index }))
    .sort((a, b) => {
      const pinOrder = Number(b.roadmap.isPinned === true) - Number(a.roadmap.isPinned === true);
      if (pinOrder !== 0) return pinOrder;

      const aOrder = typeof a.roadmap.sortOrder === 'number' && Number.isFinite(a.roadmap.sortOrder)
        ? a.roadmap.sortOrder
        : a.index;
      const bOrder = typeof b.roadmap.sortOrder === 'number' && Number.isFinite(b.roadmap.sortOrder)
        ? b.roadmap.sortOrder
        : b.index;
      return aOrder - bOrder || a.index - b.index;
    })
    .map(({ roadmap }) => roadmap);
}
