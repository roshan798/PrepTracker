'use client';
import { Sun, Moon, Download, Upload, Menu, X, Zap, BarChart2 } from 'lucide-react';
import { useAppState, useAppDispatch } from '@/lib/store';
import { downloadJSON } from '@/lib/utils';
import { useRef, useState } from 'react';
import Toast from '@/components/ui/Toast';
import { AppState } from '@/lib/types';
import Link from 'next/link';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [importConfirm, setImportConfirm] = useState<AppState | null>(null);

  const handleExport = () => {
    downloadJSON(state, `preptracker-backup-${new Date().toISOString().slice(0, 10)}.json`);
    setToast({ msg: 'Data exported successfully!', type: 'success' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as AppState;
        if (!parsed.roadmaps) throw new Error('Invalid format');
        setImportConfirm(parsed);
      } catch {
        setToast({ msg: 'Invalid file format', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (!importConfirm) return;
    dispatch({ type: 'LOAD_STATE', payload: importConfirm });
    setImportConfirm(null);
    setToast({ msg: 'Data imported successfully!', type: 'success' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
        <button onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg transition-colors hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2 mr-auto">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Zap size={14} className="text-cyan-400" />
          </div>
          <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            PrepTracker
          </span>
        </div>

        <Link href="/metrics" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:opacity-80">
          <BarChart2 size={16} />
          <span>Metrics</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
            <Upload size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <Link
            href="https://github.com/roshan798/PrepTracker"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:opacity-80 flex items-center justify-center"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-tertiary)'
            }}
            title="View source on GitHub"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
          <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
            className="p-2 rounded-lg border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
            {state.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />


        </div>
      </header>

      {importConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full fade-in"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              Import Data
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              This will overwrite all your current progress. {importConfirm.roadmaps.length} roadmaps found. Continue?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setImportConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button onClick={confirmImport}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500 text-gray-900 transition-opacity hover:opacity-90">
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
