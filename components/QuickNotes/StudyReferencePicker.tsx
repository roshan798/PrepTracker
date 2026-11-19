'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Roadmap, StudyReference } from '@/lib/types';

export interface StudyReferenceOption {
  key: string;
  label: string;
}

interface StudyReferencePickerProps {
  roadmaps: Roadmap[];
  recentOptions: StudyReferenceOption[];
  value: string;
  valueLabel?: string;
  onChange: (value: string) => void;
}

interface MenuPosition {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

interface PickerItem {
  key: string;
  label: string;
  hasChildren: boolean;
}

const PAGE_SIZE = 50;

function referenceKey(reference: StudyReference): string {
  return [reference.roadmapId, reference.topicId, reference.subtopicId, reference.problemId]
    .filter(Boolean)
    .join('|');
}

export default function StudyReferencePicker({
  roadmaps,
  recentOptions,
  value,
  valueLabel,
  onChange,
}: StudyReferencePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [subtopicId, setSubtopicId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const selectedRoadmap = roadmaps.find(roadmap => roadmap.id === roadmapId);
  const selectedTopic = selectedRoadmap?.topics.find(topic => topic.id === topicId);
  const selectedSubtopic = selectedTopic?.subtopics.find(subtopic => subtopic.id === subtopicId);
  const currentLabel = selectedSubtopic
    ? `${selectedRoadmap?.name} / ${selectedTopic?.name} / ${selectedSubtopic.name}`
    : selectedTopic
      ? `${selectedRoadmap?.name} / ${selectedTopic.name}`
      : selectedRoadmap?.name;

  let items: PickerItem[] = [];
  if (selectedSubtopic && selectedRoadmap && selectedTopic) {
    items = selectedSubtopic.problems.map(problem => ({
      key: referenceKey({
        roadmapId: selectedRoadmap.id,
        topicId: selectedTopic.id,
        subtopicId: selectedSubtopic.id,
        problemId: problem.id,
      }),
      label: problem.name,
      hasChildren: false,
    }));
  } else if (selectedTopic && selectedRoadmap) {
    items = selectedTopic.subtopics.map(subtopic => ({
      key: referenceKey({
        roadmapId: selectedRoadmap.id,
        topicId: selectedTopic.id,
        subtopicId: subtopic.id,
      }),
      label: subtopic.name,
      hasChildren: subtopic.problems.length > 0,
    }));
  } else if (selectedRoadmap) {
    items = selectedRoadmap.topics.map(topic => ({
      key: referenceKey({ roadmapId: selectedRoadmap.id, topicId: topic.id }),
      label: topic.name,
      hasChildren: topic.subtopics.length > 0,
    }));
  } else {
    items = roadmaps.map(roadmap => ({
      key: referenceKey({ roadmapId: roadmap.id }),
      label: `${roadmap.emoji} ${roadmap.name}`,
      hasChildren: roadmap.topics.length > 0,
    }));
  }

  const filteredItems = items.filter(item => item.label.toLocaleLowerCase().includes(normalizedQuery));
  const visibleItems = filteredItems.slice(0, visibleCount);
  const filteredRecent = recentOptions.filter(option => option.label.toLocaleLowerCase().includes(normalizedQuery));
  const isAtRoadmapList = !selectedRoadmap;
  const hasMoreItems = visibleItems.length < filteredItems.length;

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const viewportPadding = 12;
      const width = Math.max(100, Math.min(rect.width, window.innerWidth - viewportPadding * 2));
      const left = Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - width - viewportPadding));
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openBelow = spaceBelow >= spaceAbove;
      const availableHeight = Math.max(spaceBelow, spaceAbove);
      const maxHeight = Math.max(80, Math.min(320, availableHeight - 16));
      setPosition({
        left,
        width,
        maxHeight,
        ...(openBelow
          ? { top: Math.min(rect.bottom + 8, window.innerHeight - maxHeight - viewportPadding) }
          : { bottom: Math.min(window.innerHeight - rect.top + 8, window.innerHeight - viewportPadding) }),
      });
    };

    updatePosition();
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectReference = (key: string) => {
    onChange(key);
    setIsOpen(false);
    setQuery('');
  };

  const browseItem = (key: string) => {
    const parts = key.split('|');
    if (parts.length === 1) {
      setRoadmapId(parts[0]);
      setTopicId(null);
      setSubtopicId(null);
    } else if (parts.length === 2) {
      setTopicId(parts[1]);
      setSubtopicId(null);
    } else if (parts.length === 3) {
      setSubtopicId(parts[2]);
    }
    setQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  const goBack = () => {
    if (subtopicId) setSubtopicId(null);
    else if (topicId) setTopicId(null);
    else setRoadmapId(null);
    setQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  const menu = isOpen && position && typeof document !== 'undefined' ? createPortal(
    <div
      ref={menuRef}
      id="study-reference-options"
      role="dialog"
      aria-label="Link to study item"
      className="fixed z-[80] flex flex-col overflow-hidden rounded-xl border p-2 shadow-2xl"
      style={{
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
        top: position.top,
        bottom: position.bottom,
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}>
      <label className="relative mb-2 block shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          ref={searchRef}
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={selectedRoadmap ? `Search ${currentLabel}...` : 'Search recent items or roadmaps...'}
          aria-label="Search current study items"
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-cyan-500/30"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
      </label>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <button
          type="button"
          onClick={() => selectReference('')}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-cyan-500/10">
          <span className="flex-1">No link</span>
          {!value && <Check size={14} className="text-cyan-500" />}
        </button>

        {isAtRoadmapList && filteredRecent.length > 0 && (
          <section className="mt-2 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
            <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Recently linked</p>
            {filteredRecent.map(option => (
              <button
                key={option.key}
                type="button"
                title={option.label}
                onClick={() => selectReference(option.key)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-cyan-500/10">
                <BookOpen size={13} className="shrink-0 opacity-60" />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {value === option.key && <Check size={14} className="shrink-0 text-cyan-500" />}
              </button>
            ))}
          </section>
        )}

        <section className="mt-2 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-1 flex items-center gap-1">
            {!isAtRoadmapList && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Back to parent study items"
                className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5">
                <ChevronLeft size={15} />
              </button>
            )}
            <p className="min-w-0 flex-1 truncate px-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {isAtRoadmapList ? 'Browse by roadmap' : currentLabel}
            </p>
          </div>
          {visibleItems.map(item => (
            <div key={item.key} className="flex items-center rounded-lg hover:bg-cyan-500/10">
              <button
                type="button"
                title={`Link to ${item.label}`}
                onClick={() => selectReference(item.key)}
                className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left text-xs">
                <BookOpen size={13} className="shrink-0 opacity-60" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {value === item.key && <Check size={14} className="shrink-0 text-cyan-500" />}
              </button>
              {item.hasChildren && (
                <button
                  type="button"
                  onClick={() => browseItem(item.key)}
                  aria-label={`Browse inside ${item.label}`}
                  title={`Browse inside ${item.label}`}
                  className="shrink-0 rounded-md p-2 hover:bg-cyan-500/15">
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          ))}
          {visibleItems.length === 0 && (
            <p className="px-3 py-5 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              {normalizedQuery ? 'No matching items at this level.' : 'No items here yet.'}
            </p>
          )}
          {hasMoreItems && (
            <button
              type="button"
              onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-xs font-medium hover:bg-cyan-500/10"
              style={{ color: 'var(--accent-cyan)' }}>
              Show {Math.min(PAGE_SIZE, filteredItems.length - visibleItems.length)} more
            </button>
          )}
        </section>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'study-reference-options' : undefined}
        aria-label="Link to study item"
        onClick={() => {
          setIsOpen(open => !open);
          setQuery('');
          setRoadmapId(null);
          setTopicId(null);
          setSubtopicId(null);
          setVisibleCount(PAGE_SIZE);
        }}
        className="flex w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 pr-9 text-left text-sm outline-none transition focus:ring-2 focus:ring-cyan-500/30"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: isOpen ? 'var(--accent-cyan)' : 'var(--border)', color: 'var(--text-primary)' }}>
        <BookOpen size={15} className="shrink-0 opacity-60" />
        <span className="min-w-0 flex-1 truncate">{valueLabel || 'No link'}</span>
        {!value && <ChevronDown size={15} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear linked study item"
          title="Clear linked study item"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 dark:hover:bg-white/5"
          style={{ color: 'var(--text-secondary)' }}>
          <X size={14} />
        </button>
      )}
      {menu}
    </div>
  );
}
