'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, BookOpen, CalendarClock, Ellipsis, FileText, Home, Info, Palette, Plus, Target, X } from 'lucide-react';
import { useAppState } from '@/lib/store';
import { sortRoadmaps } from '@/lib/roadmap-utils';

interface MobileBottomNavProps {
  onAddRoadmap: () => void;
}

const primaryLinks = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/review', label: 'Review', Icon: CalendarClock },
  { href: '/notes', label: 'Notes', Icon: FileText },
  { href: '/metrics', label: 'Metrics', Icon: BarChart3 },
];

const secondaryLinks = [
  { href: '/flashcards', label: 'Flashcards', Icon: BookOpen },
  { href: '/simulation', label: 'Simulation', Icon: Target },
  { href: '/weekly-report', label: 'Weekly Report', Icon: BarChart3 },
  { href: '/appearance', label: 'Appearance', Icon: Palette },
  { href: '/about', label: 'About', Icon: Info },
];

export default function MobileBottomNav({ onAddRoadmap }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { roadmaps } = useAppState();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const moreOpen = menuPath === pathname;
  const closeMore = () => setMenuPath(null);

  const sortedRoadmaps = sortRoadmaps(roadmaps);
  const isMoreActive = secondaryLinks.some(link => pathname === link.href)
    || pathname.startsWith('/roadmaps/');

  return (
    <div className="mobile-bottom-nav-shell lg:hidden">
      {moreOpen && (
        <button
          type="button"
          className="mobile-bottom-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMore}
        />
      )}

      {moreOpen && (
        <nav className="mobile-more-menu" aria-label="More navigation">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="page-kicker">More</span>
            <button type="button" onClick={closeMore} aria-label="Close menu"
              className="rounded-lg p-2" style={{ color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
          </div>
          {secondaryLinks.map(({ href, label, Icon }) => (
            <Link key={href} href={href} prefetch={false} onClick={closeMore}
              className={`mobile-more-link ${pathname === href ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
          <div className="mobile-more-divider" />
          <div className="px-2 pb-1 page-kicker">Roadmaps</div>
          <div className="mobile-more-roadmaps">
            {sortedRoadmaps.map(roadmap => (
              <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} prefetch={false}
                onClick={closeMore}
                className={`mobile-more-link ${pathname === `/roadmaps/${roadmap.id}` ? 'active' : ''}`}>
                <span aria-hidden="true">{roadmap.emoji}</span>
                <span className="truncate">{roadmap.name}</span>
              </Link>
            ))}
            {sortedRoadmaps.length === 0 && (
              <p className="px-2 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                No roadmaps yet
              </p>
            )}
          </div>
          <button type="button" className="mobile-more-link w-full" onClick={() => {
            closeMore();
            onAddRoadmap();
          }}>
            <Plus size={17} />
            <span>New roadmap</span>
          </button>
        </nav>
      )}

      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        {primaryLinks.map(({ href, label, Icon }) => {
          const active = href === '/'
            ? pathname === '/'
            : pathname === href;
          return (
            <Link key={href} href={href} prefetch={false} aria-current={active ? 'page' : undefined}
              className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}>
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
        <button type="button" aria-expanded={moreOpen} aria-current={isMoreActive ? 'page' : undefined}
          onClick={() => setMenuPath(moreOpen ? null : pathname)}
          className={`mobile-bottom-nav-item ${moreOpen || isMoreActive ? 'active' : ''}`}>
          <Ellipsis size={20} strokeWidth={2} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
