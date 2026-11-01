'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppState } from '@/lib/store';
import { getRoadmapStats } from '@/lib/utils';
import { sortRoadmaps } from '@/lib/roadmap-utils';
import { Plus, Trash2, Home, ChevronRight, Pin, PinOff, Zap, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { useState } from 'react';
import { Roadmap } from '@/lib/types';

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleteConfirm === id) {
      dispatch({ type: 'DELETE_ROADMAP', payload: id });
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 2500);
    }
  };

  const sortedRoadmaps = sortRoadmaps(state.roadmaps);
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
        <Link href={`/roadmaps/${roadmap.id}`} onClick={onClose}
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
          <button onClick={event => handleDelete(roadmap.id, event)}
            aria-label={deleteConfirm === roadmap.id ? `Confirm delete ${roadmap.name}` : `Delete ${roadmap.name}`}
            className={`shrink-0 p-1 rounded transition-colors mt-0.5 ${deleteConfirm === roadmap.id ? 'text-rose-400' : 'opacity-0 group-hover:opacity-60 focus:opacity-100'}`}
            style={{ color: deleteConfirm === roadmap.id ? undefined : 'var(--text-secondary)' }}
            title={deleteConfirm === roadmap.id ? 'Click again to confirm' : 'Delete'}>
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
              <div className="font-bold text-sm leading-none" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
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
          <Link href="/" onClick={onClose}
            title={collapsed ? 'Dashboard' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${collapsed ? 'lg:justify-center lg:px-0' : ''}
              ${pathname === '/' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/' ? undefined : 'var(--text-secondary)' }}>
            <Home size={15} />
            <span className={collapsed ? 'lg:hidden' : ''}>Dashboard</span>
          </Link>
          <Link href="/flashcards" onClick={onClose}
            title={collapsed ? 'Flashcards' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${pathname === '/flashcards' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/flashcards' ? undefined : 'var(--text-secondary)' }}>
            <span aria-hidden="true">🃏</span>
            <span className={collapsed ? 'lg:hidden' : ''}>Flashcards</span>
          </Link>
          <Link href="/weekly-report" onClick={onClose}
            title={collapsed ? 'Weekly Report' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${pathname === '/weekly-report' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/weekly-report' ? undefined : 'var(--text-secondary)' }}>
            <span aria-hidden="true">📋</span>
            <span className={collapsed ? 'lg:hidden' : ''}>Weekly Report</span>
          </Link>
          <Link href="/simulation" onClick={onClose}
            title={collapsed ? 'Simulation' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${pathname === '/simulation' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/simulation' ? undefined : 'var(--text-secondary)' }}>
            <span aria-hidden="true">🎯</span>
            <span className={collapsed ? 'lg:hidden' : ''}>Simulation</span>
          </Link>

          <Link href="/about" onClick={onClose}
            title={collapsed ? 'About' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${pathname === '/about' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/about' ? undefined : 'var(--text-secondary)' }}>
            <span aria-hidden="true">ℹ️</span>
            <span className={collapsed ? 'lg:hidden' : ''}>About</span>
          </Link>

          {pinned.length > 0 && (
            <div className="pt-3">
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                Pinned
              </p>
              {pinned.map(roadmap => renderRoadmap(roadmap, roadmap.type === 'custom'))}
            </div>
          )}

          <div className="pt-3">
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
              Predefined
            </p>
            {predefined.map(roadmap => renderRoadmap(roadmap, false))}
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between px-3 pb-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                Custom
              </p>
              <button onClick={onAddRoadmap}
                className="p-1 rounded-md transition-colors hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}>
                <Plus size={13} />
              </button>
            </div>
            {customCount === 0 && (
              <p className="px-3 py-2 text-xs italic" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
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
    </>
  );
}
