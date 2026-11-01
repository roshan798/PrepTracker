import { Problem, Status, Subtopic, Topic } from './types';

export type RoadmapStatusFilter = Status | 'all';

function matchesQuery(values: Array<string | number | undefined>, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return !normalizedQuery || values.some(value =>
    String(value ?? '').toLocaleLowerCase().includes(normalizedQuery)
  );
}

function matchesStatus(status: Status, filter: RoadmapStatusFilter): boolean {
  return filter === 'all' || status === filter;
}

export function topicMatchesFilter(
  topic: Topic,
  query: string,
  statusFilter: RoadmapStatusFilter
): boolean {
  return topicMatchesSelf(topic, query, statusFilter) ||
    topic.subtopics.some(subtopic => subtopicMatchesFilter(subtopic, query, statusFilter));
}

export function topicMatchesSelf(
  topic: Topic,
  query: string,
  statusFilter: RoadmapStatusFilter
): boolean {
  return matchesStatus(topic.status, statusFilter) &&
    matchesQuery([topic.name, topic.description, topic.week], query);
}

export function subtopicMatchesFilter(
  subtopic: Subtopic,
  query: string,
  statusFilter: RoadmapStatusFilter
): boolean {
  return subtopicMatchesSelf(subtopic, query, statusFilter) ||
    subtopic.problems.some(problem => problemMatchesFilter(problem, query, statusFilter));
}

export function subtopicMatchesSelf(
  subtopic: Subtopic,
  query: string,
  statusFilter: RoadmapStatusFilter
): boolean {
  return matchesStatus(subtopic.status, statusFilter) &&
    matchesQuery([subtopic.name], query);
}

export function problemMatchesFilter(
  problem: Problem,
  query: string,
  statusFilter: RoadmapStatusFilter
): boolean {
  return matchesStatus(problem.status, statusFilter) &&
    matchesQuery([problem.name, problem.leetcodeNumber], query);
}
