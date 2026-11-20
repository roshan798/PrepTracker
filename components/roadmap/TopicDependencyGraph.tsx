'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { ArrowDown, Check, ChevronDown, Circle, LockKeyhole } from 'lucide-react';
import type { Roadmap, Topic } from '@/lib/types';

type DependencyEdge = readonly [string, string];

const DEPENDENCIES: Record<string, readonly DependencyEdge[]> = {
  'system-design': [
    ['sd-w1', 'sd-w2'],
    ['sd-w1', 'sd-w4'],
    ['sd-w2', 'sd-w3'],
    ['sd-w2', 'sd-w5'],
    ['sd-w3', 'sd-w5'],
    ['sd-w4', 'sd-w5'],
    ['sd-w5', 'sd-w7'],
    ['sd-w7', 'sd-w8'],
  ],
  'system-design-masterclass': [
    ['sd-foundations', 'sd-databases'],
    ['sd-foundations', 'sd-distributed'],
    ['sd-databases', 'sd-storage'],
    ['sd-databases', 'sd-tinyurl'],
    ['sd-distributed', 'sd-storage'],
    ['sd-distributed', 'sd-rate-limiter'],
    ['sd-distributed', 'sd-search-systems'],
    ['sd-distributed', 'sd-distributed-logging'],
    ['sd-storage', 'sd-tinyurl'],
    ['sd-storage', 'sd-instagram'],
    ['sd-storage', 'sd-youtube'],
    ['sd-storage', 'sd-whatsapp'],
    ['sd-storage', 'sd-airbnb'],
    ['sd-storage', 'sd-notifications'],
    ['sd-storage', 'sd-distributed-logging'],
    ['sd-rate-limiter', 'sd-instagram'],
    ['sd-rate-limiter', 'sd-youtube'],
    ['sd-rate-limiter', 'sd-airbnb'],
    ['sd-rate-limiter', 'sd-notifications'],
  ],
  'genai-agentic-ai': [
    ['genai-m01', 'genai-m02'],
    ['genai-m01', 'genai-m03'],
    ['genai-m01', 'genai-m07'],
    ['genai-m02', 'genai-m04'],
    ['genai-m03', 'genai-m04'],
    ['genai-m03', 'genai-m05'],
    ['genai-m03', 'genai-m07'],
    ['genai-m04', 'genai-m18'],
    ['genai-m05', 'genai-m06'],
    ['genai-m05', 'genai-m13'],
    ['genai-m06', 'genai-m14'],
    ['genai-m07', 'genai-m08'],
    ['genai-m07', 'genai-m09'],
    ['genai-m07', 'genai-m15'],
    ['genai-m08', 'genai-m09'],
    ['genai-m08', 'genai-m10'],
    ['genai-m09', 'genai-m10'],
    ['genai-m10', 'genai-m11'],
    ['genai-m10', 'genai-m12'],
    ['genai-m10', 'genai-m15'],
    ['genai-m12', 'genai-m22'],
    ['genai-m13', 'genai-m14'],
    ['genai-m14', 'genai-m18'],
    ['genai-m15', 'genai-m16'],
    ['genai-m16', 'genai-m17'],
    ['genai-m17', 'genai-m21'],
    ['genai-m17', 'genai-m22'],
    ['genai-m18', 'genai-m20'],
    ['genai-m18', 'genai-m21'],
    ['genai-m19', 'genai-m22'],
    ['genai-m20', 'genai-m22'],
    ['genai-m21', 'genai-m22'],
  ],
};

const NODE_WIDTH = 218;
const NODE_HEIGHT = 92;
const LEVEL_GAP = 52;
const ROW_GAP = 28;
const PADDING = 32;
const GRAPH_LAYOUT_QUERY = '(max-width: 640px)';

function subscribeToGraphLayout(onChange: () => void) {
  const mediaQuery = window.matchMedia(GRAPH_LAYOUT_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getGraphNodesPerRow() {
  return window.matchMedia(GRAPH_LAYOUT_QUERY).matches ? 1 : 2;
}

function getServerGraphNodesPerRow() {
  return 2;
}

interface PositionedTopic {
  topic: Topic;
  x: number;
  y: number;
}

function getGraphLayout(topics: Topic[], roadmapId: string, nodesPerRow: number) {
  const topicIds = new Set(topics.map(topic => topic.id));
  const edges = (DEPENDENCIES[roadmapId] ?? []).filter(
    ([from, to]) => topicIds.has(from) && topicIds.has(to) && from !== to
  );
  const outgoing = new Map(topics.map(topic => [topic.id, [] as string[]]));
  const incoming = new Map(topics.map(topic => [topic.id, [] as string[]]));

  edges.forEach(([from, to]) => {
    outgoing.get(from)?.push(to);
    incoming.get(to)?.push(from);
  });

  const remainingDependencies = new Map(
    topics.map(topic => [topic.id, incoming.get(topic.id)?.length ?? 0])
  );
  const ranks = new Map(topics.map(topic => [topic.id, 0]));
  const queue = topics
    .filter(topic => remainingDependencies.get(topic.id) === 0)
    .map(topic => topic.id);

  for (let index = 0; index < queue.length; index++) {
    const topicId = queue[index];
    for (const nextId of outgoing.get(topicId) ?? []) {
      ranks.set(nextId, Math.max(ranks.get(nextId) ?? 0, (ranks.get(topicId) ?? 0) + 1));
      const remaining = (remainingDependencies.get(nextId) ?? 1) - 1;
      remainingDependencies.set(nextId, remaining);
      if (remaining === 0) queue.push(nextId);
    }
  }

  const levels = new Map<number, Topic[]>();
  topics.forEach(topic => {
    const rank = ranks.get(topic.id) ?? 0;
    levels.set(rank, [...(levels.get(rank) ?? []), topic]);
  });

  const width = PADDING * 2 + nodesPerRow * NODE_WIDTH + (nodesPerRow - 1) * ROW_GAP;
  const height = PADDING * 2 + Array.from(levels.values()).reduce(
    (total, levelTopics) => {
      const rows = Math.ceil(levelTopics.length / nodesPerRow);
      return total + rows * NODE_HEIGHT + (rows - 1) * ROW_GAP + LEVEL_GAP;
    },
    -LEVEL_GAP
  );
  const positions = new Map<string, PositionedTopic>();
  let levelTop = PADDING;

  Array.from(levels.keys()).sort((a, b) => a - b).forEach(rank => {
    const levelTopics = levels.get(rank) ?? [];
    const rows = Math.ceil(levelTopics.length / nodesPerRow);
    levelTopics.forEach((topic, index) => {
      const row = Math.floor(index / nodesPerRow);
      const column = index % nodesPerRow;
      positions.set(topic.id, {
        topic,
        x: PADDING + column * (NODE_WIDTH + ROW_GAP),
        y: levelTop + row * (NODE_HEIGHT + ROW_GAP),
      });
    });
    levelTop += rows * NODE_HEIGHT + (rows - 1) * ROW_GAP + LEVEL_GAP;
  });

  return { edges, incoming, positions, width, height };
}

function statusLabel(status: Topic['status']) {
  if (status === 'completed') return 'Completed';
  if (status === 'in-progress') return 'In progress';
  return 'Not started';
}

export default function TopicDependencyGraph({
  roadmap,
  onOpenTopic,
}: {
  roadmap: Roadmap;
  onOpenTopic: (topicId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const nodesPerRow = useSyncExternalStore(
    subscribeToGraphLayout,
    getGraphNodesPerRow,
    getServerGraphNodesPerRow
  );
  const layout = useMemo(
    () => getGraphLayout(roadmap.topics, roadmap.id, nodesPerRow),
    [nodesPerRow, roadmap.id, roadmap.topics]
  );
  const positionedTopics = Array.from(layout.positions.values());
  const selectedTopic = positionedTopics.find(node => node.topic.id === selectedTopicId)
    ?? positionedTopics.find(node =>
      node.topic.status !== 'completed' &&
      (layout.incoming.get(node.topic.id) ?? []).every(
        prerequisiteId => roadmap.topics.find(topic => topic.id === prerequisiteId)?.status === 'completed'
      )
    )
    ?? positionedTopics[0];
  const selectedPrerequisites = selectedTopic
    ? (layout.incoming.get(selectedTopic.topic.id) ?? [])
      .map(id => roadmap.topics.find(topic => topic.id === id))
      .filter((topic): topic is Topic => Boolean(topic))
    : [];
  const readyCount = positionedTopics.filter(({ topic }) =>
    topic.status !== 'completed' &&
    (layout.incoming.get(topic.id) ?? []).every(
      prerequisiteId => roadmap.topics.find(item => item.id === prerequisiteId)?.status === 'completed'
    )
  ).length;
  const completedCount = positionedTopics.filter(({ topic }) => topic.status === 'completed').length;
  const allPrerequisitesComplete = selectedPrerequisites.every(topic => topic.status === 'completed');

  return (
    <section className="topic-dependency-card surface-card mb-6 rounded-2xl">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="page-kicker mb-1">Learn in context</div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Topic dependency graph
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Follow prerequisites, spot what is ready, and jump straight to a module.
          </p>
        </div>
        <button
          type="button"
          className="dependency-graph-toggle"
          aria-expanded={expanded}
          aria-controls="topic-dependency-graph-content"
          onClick={() => setExpanded(open => !open)}>
          {expanded ? 'Hide graph' : 'Explore graph'}
          <ChevronDown size={15} className={expanded ? 'rotate-180' : ''} />
        </button>
      </div>

      {expanded && (
        <div id="topic-dependency-graph-content" className="border-t p-4 sm:p-5" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {completedCount} of {positionedTopics.length} modules complete · {readyCount} ready to start
            </p>
            <div className="dependency-graph-legend" aria-label="Module status legend">
              <span><i className="is-completed" />Completed</span>
              <span><i className="is-in-progress" />In progress</span>
              <span><i className="is-not-started" />Not started</span>
            </div>
          </div>

          <p className="mb-2 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            <ArrowDown size={14} /> Arrows point from prerequisite to the module it unlocks.
          </p>

          {positionedTopics.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              There are no modules to display in this roadmap yet.
            </p>
          ) : (
            <div className="dependency-graph-viewport" aria-label="Scrollable topic dependency map">
              <div
                className="dependency-graph-canvas"
                style={{ width: layout.width, height: layout.height }}>
                <svg
                  className="dependency-graph-edges"
                  width={layout.width}
                  height={layout.height}
                  aria-hidden="true">
                  {layout.edges.map(([from, to]) => {
                    const source = layout.positions.get(from);
                    const target = layout.positions.get(to);
                    if (!source || !target) return null;
                    const x1 = source.x + NODE_WIDTH / 2;
                    const y1 = source.y + NODE_HEIGHT;
                    const x2 = target.x + NODE_WIDTH / 2;
                    const y2 = target.y;
                    const controlY = y1 + (y2 - y1) / 2;
                    const complete = source.topic.status === 'completed';

                    return (
                      <path
                        key={`${from}-${to}`}
                        d={`M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${controlY}, ${x2} ${y2}`}
                        className={complete ? 'dependency-edge is-complete' : 'dependency-edge'}
                      />
                    );
                  })}
                </svg>

                {positionedTopics.map(({ topic, x, y }, index) => {
                  const unmetPrerequisites = (layout.incoming.get(topic.id) ?? []).filter(
                    prerequisiteId =>
                      roadmap.topics.find(item => item.id === prerequisiteId)?.status !== 'completed'
                  );
                  const isSelected = selectedTopic?.topic.id === topic.id;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`dependency-node is-${topic.status} ${isSelected ? 'is-selected' : ''}`}
                      style={{ left: x, top: y, width: NODE_WIDTH, height: NODE_HEIGHT }}
                      aria-pressed={isSelected}
                      aria-label={`${topic.name}. ${statusLabel(topic.status)}. ${
                        topic.status === 'completed'
                          ? 'Completed.'
                          : unmetPrerequisites.length
                            ? `${unmetPrerequisites.length} prerequisites remaining.`
                            : 'Ready to start.'
                      }`}
                      onClick={() => setSelectedTopicId(topic.id)}>
                      <span className="dependency-node-topline">
                        <span className="dependency-node-number">
                          {topic.week ? `W${topic.week}` : String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`dependency-node-status is-${topic.status}`}>
                          {topic.status === 'completed'
                            ? <Check size={12} />
                            : topic.status === 'in-progress'
                              ? <Circle size={10} />
                              : <Circle size={10} />}
                          {statusLabel(topic.status)}
                        </span>
                      </span>
                      <span className="dependency-node-name">{topic.name}</span>
                      <span className="dependency-node-prerequisite">
                        {topic.status === 'completed'
                          ? 'Prerequisites satisfied'
                          : unmetPrerequisites.length > 0
                            ? <><LockKeyhole size={11} /> {unmetPrerequisites.length} prerequisite{unmetPrerequisites.length === 1 ? '' : 's'} remaining</>
                            : 'Ready to start'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTopic && (
            <div className="dependency-topic-detail">
              <div className="min-w-0">
                <div className="mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Selected module · {statusLabel(selectedTopic.topic.status)}
                </div>
                <h3 className="mt-1 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedTopic.topic.name}
                </h3>
                {selectedPrerequisites.length > 0 ? (
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Prerequisites: {selectedPrerequisites.map(topic => topic.name).join(' · ')}
                    {!allPrerequisitesComplete && ' — finish these first.'}
                  </p>
                ) : (
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    This module has no mapped prerequisites.
                  </p>
                )}
              </div>
              <button
                type="button"
                className="dependency-open-topic"
                onClick={() => onOpenTopic(selectedTopic.topic.id)}>
                Open module
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
