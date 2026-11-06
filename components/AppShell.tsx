'use client';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AddRoadmapModal from '@/components/modals/AddRoadmapModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddRoadmap, setShowAddRoadmap] = useState(false);
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
    </div>
  );
}
