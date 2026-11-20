'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppState } from '@/lib/store';
import { getRoadmapStats } from '@/lib/utils';
import { sortRoadmaps } from '@/lib/roadmap-utils';
import {
  CalendarClock, Plus, Trash2, Home, ChevronRight, ChevronDown, Pin, PinOff, Zap,
  PanelLeftClose, PanelLeftOpen, Palette, FileText, BookOpen, BarChart3, Target,
  Info, Ellipsis,
} from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useState } from 'react';
import { Roadmap } from '@/lib/types';
import { getDueReviews } from '@/lib/spaced-repetition';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onToggleSidebar: () => void;
  onClose: () => void;
  onAddRoadmap: () => void;
}

const colorTextMap: Record<string, string> = {
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

export default function Sidebar({ open, collapsed, onToggleSidebar, onClose, onAddRoadmap }: SidebarProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [roadmapToDelete, setRoadmapToDelete] = useState<Roadmap | null>(null);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const extraActionActive = ['/flashcards', '/weekly-report', '/simulation', '/about'].includes(pathname);

  const confirmDeleteRoadmap = () => {
    if (!roadmapToDelete) return;
    dispatch({ type: 'DELETE_ROADMAP', payload: roadmapToDelete.id });
    setRoadmapToDelete(null);
  };

  const sortedRoadmaps = sortRoadmaps(state.roadmaps);
  const dueReviewCount = getDueReviews(sortedRoadmaps).length;
  const pinned = sortedRoadmaps.filter(roadmap => roadmap.isPinned === true);
  const predefined = sortedRoadmaps.filter(roadmap => roadmap.type === 'predefined' && !roadmap.isPinned);
  const custom = sortedRoadmaps.filter(roadmap => roadmap.type === 'custom' && !roadmap.isPinned);
  const customCount = state.roadmaps.filter(roadmap => roadmap.type === 'custom').length;

  const renderRoadmap = (roadmap: Roadmap, canDelete: boolean) => {
    const stats = getRoadmapStats(roadmap);
    const active = pathname === `/roadmaps/${roadmap.id}`;
    return (
      <div key={roadmap.id} className={`group flex items-start gap-1 px-2 py-2 rounded-xl mb-0.5
        ${active ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:opacity-80'}`}>
        <Link href={`/roadmaps/${roadmap.id}`} prefetch={false} onClick={onClose}
          className="flex-1 min-w-0 flex items-start gap-2.5 px-1">
          <span className="text-base mt-0.5 shrink-0">{roadmap.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-xs leading-tight truncate ${active ? colorTextMap[roadmap.color] || 'text-cyan-400' : ''}`}
              style={{ color: active ? undefined : 'var(--text-primary)' }}>
              {roadmap.name}
            </div>
            <div className="mt-1.5">
              <ProgressBar percentage={stats.percentage} color={roadmap.color} height="h-1" />
            </div>
            <div className="text-xs mt-1 mono" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
              {stats.completed}/{stats.total}
            </div>
          </div>
          <ChevronRight size={12} className={`shrink-0 mt-1 transition-transform ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
            style={{ color: 'var(--text-secondary)' }} />
        </Link>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_ROADMAP_PIN', payload: roadmap.id })}
          aria-label={roadmap.isPinned ? `Unpin ${roadmap.name}` : `Pin ${roadmap.name}`}
          title={roadmap.isPinned ? 'Unpin roadmap' : 'Pin roadmap'}
          className="shrink-0 p-1 rounded transition-colors hover:text-violet-400 focus:opacity-100"
          style={{ color: roadmap.isPinned ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
          {roadmap.isPinned ? <Pin size={13} /> : <PinOff size={13} />}
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={() => setRoadmapToDelete(roadmap)}
            aria-label={`Delete ${roadmap.name}`}
            className="mt-0.5 shrink-0 rounded p-1 opacity-0 transition-colors group-hover:opacity-60 hover:text-rose-400 focus:opacity-100"
            style={{ color: 'var(--text-secondary)' }}
            title="Delete roadmap">
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      )}
      <aside
        className={`app-sidebar fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col border-r transition-[width,transform] duration-300 sidebar-scroll overflow-y-auto
          ${collapsed ? 'w-64 lg:w-20' : 'w-64'}
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        data-collapsed={collapsed}
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

        <div className={`sidebar-brand-row flex items-center gap-2.5 px-5 py-5 border-b ${collapsed ? 'lg:justify-center lg:px-3' : ''}`} style={{ borderColor: 'var(--border)' }}>
          <div className="sidebar-brand flex items-center gap-2.5 min-w-0 flex-1">
            <div className="sidebar-brand-mark flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
              <Zap size={16} className="text-cyan-400" />
            </div>
            <div className={collapsed ? 'lg:hidden' : ''}>
              <div className="font-bold text-sm leading-none" style={{ fontFamily: 'var(--font-syne), sans-serif', color: 'var(--text-primary)' }}>
                Prep<span style={{ color: 'var(--accent-cyan)' }}>Tracker</span>
              </div>
              <div className="text-xs mt-0.5 mono" style={{ color: 'var(--text-secondary)' }}>
                {state.roadmaps.length} roadmaps
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="sidebar-collapse-toggle hidden lg:flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border transition-colors hover:bg-cyan-500/10"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className={`flex-1 p-3 space-y-1 ${collapsed ? 'lg:px-2' : ''}`}>
          <Link href="/" prefetch={false} onClick={onClose}
            title={collapsed ? 'Dashboard' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${collapsed ? 'lg:justify-center lg:px-0' : ''}
              ${pathname === '/' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/' ? undefined : 'var(--text-secondary)' }}>
            <Home size={15} />
            <span className={collapsed ? 'lg:hidden' : ''}>Dashboard</span>
          </Link>
          <Link href="/review" prefetch={false} onClick={onClose}
            title={collapsed ? 'Review Queue' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${collapsed ? 'lg:justify-center lg:px-0' : ''}
              ${pathname === '/review' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/review' ? undefined : 'var(--text-secondary)' }}>
            <CalendarClock size={15} />
            <span className={collapsed ? 'lg:hidden' : ''}>Review Queue</span>
            {dueReviewCount > 0 && (
              <span className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: 'color-mix(in srgb, var(--accent-cyan) 14%, transparent)', color: 'var(--accent-cyan)' }}>
                {dueReviewCount}
              </span>
            )}
          </Link>
          <Link href="/notes" prefetch={false} onClick={onClose}
            title={collapsed ? 'Quick Notes' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${collapsed ? 'lg:justify-center lg:px-0' : ''}
              ${pathname === '/notes' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/notes' ? undefined : 'var(--text-secondary)' }}>
            <FileText size={15} />
            <span className={collapsed ? 'lg:hidden' : ''}>Quick Notes</span>
          </Link>
          <Link href="/appearance" prefetch={false} onClick={onClose}
            title={collapsed ? 'Appearance' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${pathname === '/appearance' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/appearance' ? undefined : 'var(--text-secondary)' }}>
            <Palette size={15} />
            <span className={collapsed ? 'lg:hidden' : ''}>Appearance</span>
          </Link>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setMoreActionsOpen(open => !open)}
              aria-expanded={moreActionsOpen}
              aria-controls="sidebar-extra-actions"
              title={collapsed ? 'More tools' : undefined}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:opacity-80
                ${collapsed ? 'lg:justify-center lg:px-0' : ''}
                ${extraActionActive ? 'bg-cyan-500/10' : ''}`}
              style={{ color: extraActionActive ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
              <Ellipsis size={16} />
              <span className={collapsed ? 'lg:hidden' : ''}>More tools</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${collapsed ? 'lg:hidden' : ''} ${moreActionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreActionsOpen && (
              <div id="sidebar-extra-actions" className="mt-1 space-y-1 border-l pl-2" style={{ borderColor: 'var(--border)' }}>
                {[
                  { href: '/flashcards', label: 'Flashcards', Icon: BookOpen },
                  { href: '/weekly-report', label: 'Weekly Report', Icon: BarChart3 },
                  { href: '/simulation', label: 'Simulation', Icon: Target },
                  { href: '/about', label: 'About', Icon: Info },
                ].map(({ href, label, Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href} prefetch={false} onClick={onClose}
                      title={collapsed ? label : undefined}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all
                        ${collapsed ? 'lg:justify-center lg:px-0' : ''}
                        ${active ? 'bg-cyan-500/15' : 'hover:opacity-80'}`}
                      style={{ color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                      <Icon size={15} />
                      <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {pinned.length > 0 && (
            <div className="pt-3">
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)' }}>
                Pinned
              </p>
              {pinned.map(roadmap => renderRoadmap(roadmap, roadmap.type === 'custom'))}
            </div>
          )}

          <div className="pt-3">
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)' }}>
              Predefined
            </p>
            {predefined.map(roadmap => renderRoadmap(roadmap, false))}
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between px-3 pb-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)' }}>
                Custom
              </p>
              <button onClick={onAddRoadmap}
                aria-label="Add custom roadmap"
                className="p-1 rounded-md transition-colors hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}>
                <Plus size={13} aria-hidden="true" />
              </button>
            </div>
            {customCount === 0 && (
              <p className="px-3 py-2 text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                No custom roadmaps yet
              </p>
            )}
            {custom.map(roadmap => renderRoadmap(roadmap, true))}
          </div>
        </nav>

        <div className={`p-3 border-t ${collapsed ? 'lg:px-2' : ''}`} style={{ borderColor: 'var(--border)' }}>
          <button onClick={onAddRoadmap}
            title={collapsed ? 'New Roadmap' : undefined}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-dashed transition-all hover:opacity-80 ${collapsed ? 'lg:px-0' : ''}`}
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <Plus size={14} />
            <span className={collapsed ? 'lg:hidden' : ''}>New Roadmap</span>
          </button>
        </div>
      </aside>
      {roadmapToDelete && (
        <ConfirmDialog
          title={`Delete ${roadmapToDelete.name}?`}
          description="This roadmap and all of its topics, tasks, notes, and progress will be permanently removed."
          onCancel={() => setRoadmapToDelete(null)}
          onConfirm={confirmDeleteRoadmap}
        />
      )}
    </>
  );
}
