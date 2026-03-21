'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppState } from '@/lib/store';
import { getRoadmapStats } from '@/lib/utils';
import { Plus, Trash2, Home, ChevronRight, Zap } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
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

export default function Sidebar({ open, onClose, onAddRoadmap }: SidebarProps) {
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

  const predefined = state.roadmaps.filter(r => r.type === 'predefined');
  const custom = state.roadmaps.filter(r => r.type === 'custom');

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col border-r transition-transform duration-300 sidebar-scroll overflow-y-auto
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Zap size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-sm leading-none" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              PrepTracker
            </div>
            <div className="text-xs mt-0.5 mono" style={{ color: 'var(--text-secondary)' }}>
              {state.roadmaps.length} roadmaps
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link href="/" onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
              ${pathname === '/' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/' ? undefined : 'var(--text-secondary)' }}>
            <Home size={15} />
            Dashboard
          </Link>
          <Link href="/flashcards" onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${pathname === '/flashcards' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/flashcards' ? undefined : 'var(--text-secondary)' }}>
            <span>🃏</span>
            Flashcards
          </Link>
          <Link href="/weekly-report" onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
    ${pathname === '/weekly-report' ? 'bg-cyan-500/15 text-cyan-400' : 'hover:opacity-80'}`}
            style={{ color: pathname === '/weekly-report' ? undefined : 'var(--text-secondary)' }}>
            <span>📋</span>
            Weekly Report
          </Link>

          <div className="pt-3">
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider mono" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
              Predefined
            </p>
            {predefined.map(r => {
              const stats = getRoadmapStats(r);
              const active = pathname === `/roadmaps/${r.id}`;
              return (
                <Link key={r.id} href={`/roadmaps/${r.id}`} onClick={onClose}
                  className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5
                    ${active ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:opacity-80'}`}
                  style={{ backgroundColor: active ? undefined : 'transparent' }}>
                  <span className="text-base mt-0.5 shrink-0">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-xs leading-tight truncate ${active ? colorTextMap[r.color] || 'text-cyan-400' : ''}`}
                      style={{ color: active ? undefined : 'var(--text-primary)' }}>
                      {r.name}
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar percentage={stats.percentage} color={r.color} height="h-1" />
                    </div>
                    <div className="text-xs mt-1 mono" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                      {stats.completed}/{stats.total}
                    </div>
                  </div>
                  <ChevronRight size={12} className={`shrink-0 mt-1 transition-transform ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                    style={{ color: 'var(--text-secondary)' }} />
                </Link>
              );
            })}
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
            {custom.length === 0 && (
              <p className="px-3 py-2 text-xs italic" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                No custom roadmaps yet
              </p>
            )}
            {custom.map(r => {
              const stats = getRoadmapStats(r);
              const active = pathname === `/roadmaps/${r.id}`;
              return (
                <div key={r.id} className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-0.5
                  ${active ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:opacity-80'}`}>
                  <Link href={`/roadmaps/${r.id}`} onClick={onClose} className="flex-1 min-w-0 flex items-start gap-2.5">
                    <span className="text-base mt-0.5 shrink-0">{r.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs leading-tight truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</div>
                      <ProgressBar percentage={stats.percentage} color={r.color} height="h-1" />
                      <div className="text-xs mt-1 mono" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>{stats.completed}/{stats.total}</div>
                    </div>
                  </Link>
                  <button onClick={(e) => handleDelete(r.id, e)}
                    className={`shrink-0 p-1 rounded transition-colors mt-0.5 ${deleteConfirm === r.id ? 'text-rose-400' : 'opacity-0 group-hover:opacity-60'}`}
                    title={deleteConfirm === r.id ? 'Click again to confirm' : 'Delete'}>
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onAddRoadmap}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-dashed transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <Plus size={14} />
            New Roadmap
          </button>
        </div>
      </aside>
    </>
  );
}
