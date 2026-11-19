'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PenLine } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AddRoadmapModal from '@/components/modals/AddRoadmapModal';
import QuickNoteEditor from '@/components/QuickNotes/QuickNoteEditor';
import { useAppDispatch } from '@/lib/store';
import { StudyReference } from '@/lib/types';

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
        <main className="flex-1 overflow-y-auto" data-location-scroll-container>
          {children}
        </main>
      </div>

      {showAddRoadmap && <AddRoadmapModal onClose={() => setShowAddRoadmap(false)} />}
      <button
        type="button"
        onClick={() => setShowQuickNote(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-cyan-500 px-5 font-semibold text-gray-950 shadow-xl shadow-cyan-950/25 transition hover:-translate-y-0.5 hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:bottom-7 sm:right-7"
        aria-label="Create a quick note">
        <PenLine size={18} />
        <span className="text-sm">Quick note</span>
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
