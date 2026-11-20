'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PenLine } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useAppDispatch } from '@/lib/store';
import { StudyReference } from '@/lib/types';

const AddRoadmapModal = dynamic(() => import('@/components/modals/AddRoadmapModal'));
const QuickNoteEditor = dynamic(() => import('@/components/QuickNotes/QuickNoteEditor'));

export default function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddRoadmap, setShowAddRoadmap] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const roadmapMatch = pathname.match(/^\/roadmaps\/([^/]+)/);
  const defaultReference: StudyReference | undefined = roadmapMatch
    ? { roadmapId: decodeURIComponent(roadmapMatch[1]) }
    : undefined;
  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setSidebarCollapsed(collapsed => !collapsed);
      return;
    }

    setSidebarOpen(open => !open);
  };

  return (
    <div className="app-shell flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
        onAddRoadmap={() => setShowAddRoadmap(true)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className="app-main-mobile flex-1 overflow-y-auto" data-location-scroll-container>
          {children}
        </main>
      </div>

      <MobileBottomNav onAddRoadmap={() => setShowAddRoadmap(true)} />
      {showAddRoadmap && <AddRoadmapModal onClose={() => setShowAddRoadmap(false)} />}
      <button
        type="button"
        onClick={() => setShowQuickNote(true)}
        className="quick-note-fab fixed bottom-24 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full p-0 font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:bottom-7 lg:right-7 lg:h-14 lg:w-auto lg:gap-2 lg:justify-start lg:px-5"
        style={{ backgroundColor: 'var(--accent-cyan)', color: 'var(--accent-contrast)' }}
        aria-label="Create a quick note">
        <PenLine size={18} />
        <span className="hidden text-md lg:inline">Quick note</span>
      </button>
      {showQuickNote && (
        <QuickNoteEditor
          defaultReference={defaultReference}
          onSave={note => {
            dispatch({ type: 'ADD_QUICK_NOTE', payload: note });
            setShowQuickNote(false);
          }}
          onClose={() => setShowQuickNote(false)}
        />
      )}
    </div>
  );
}
