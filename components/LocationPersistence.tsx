'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  getVisibleProblemLocation,
  readSavedLocation,
  saveLocation,
} from '@/lib/location-persistence';
import type { SavedLocation } from '@/lib/location-persistence';

function getScrollContainer() {
  return document.querySelector<HTMLElement>('[data-location-scroll-container]');
}

export default function LocationPersistence() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const initializedRef = useRef(false);
  const pendingRestoreRef = useRef<SavedLocation | null>(null);

  useEffect(() => {
    let saveTimeout: ReturnType<typeof setTimeout> | undefined;

    const persistLocation = () => {
      if (pendingRestoreRef.current) return;
      const location: SavedLocation = {
        pathname: pathnameRef.current,
        scrollTop: getScrollContainer()?.scrollTop ?? window.scrollY,
      };
      const container = getScrollContainer();
      if (container && pathnameRef.current.startsWith('/roadmaps/')) {
        location.activeProblem = getVisibleProblemLocation(container);
      }
      saveLocation(location);
    };

    const handleScroll = () => {
      if (pendingRestoreRef.current) return;
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(persistLocation, 150);
    };

    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('pagehide', persistLocation);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('pagehide', persistLocation);
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;

    if (!initializedRef.current) {
      initializedRef.current = true;
      const savedLocation = readSavedLocation();

      if (pathname === '/' && savedLocation && savedLocation.pathname !== '/') {
        pendingRestoreRef.current = savedLocation;
        router.replace(savedLocation.pathname);
        return;
      }

      if (savedLocation?.pathname === pathname) {
        pendingRestoreRef.current = savedLocation;
      }
    }

    const pendingRestore = pendingRestoreRef.current;
    if (pendingRestore) {
      if (pendingRestore.pathname === pathname) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const container = getScrollContainer();
            if (container) {
              container.scrollTop = pathname.startsWith('/roadmaps/')
                ? 0
                : pendingRestore.scrollTop;
            }
            pendingRestoreRef.current = null;
          });
        });
      }
      return;
    }

    const container = getScrollContainer();
    const location: SavedLocation = {
      pathname,
      scrollTop: pathname.startsWith('/roadmaps/')
        ? 0
        : container?.scrollTop ?? window.scrollY,
    };
    if (container && pathname.startsWith('/roadmaps/')) {
      location.activeProblem = getVisibleProblemLocation(container);
    }
    saveLocation(location);
  }, [pathname, router]);

  return null;
}
