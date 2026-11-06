'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'prepTrackerLastLocation';

interface SavedLocation {
  pathname: string;
  scrollTop: number;
}

function getScrollContainer() {
  return document.querySelector<HTMLElement>('[data-location-scroll-container]');
}

function readSavedLocation(): SavedLocation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('pathname' in parsed) ||
      typeof parsed.pathname !== 'string' ||
      !parsed.pathname.startsWith('/') ||
      parsed.pathname.startsWith('//') ||
      !('scrollTop' in parsed) ||
      typeof parsed.scrollTop !== 'number' ||
      !Number.isFinite(parsed.scrollTop)
    ) {
      throw new Error('Saved location has an invalid format');
    }

    return { pathname: parsed.pathname, scrollTop: parsed.scrollTop };
  } catch (error) {
    console.error('Failed to read saved location:', error);
    return null;
  }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } catch (error) {
        console.error('Failed to save location:', error);
      }
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
            if (container) container.scrollTop = pendingRestore.scrollTop;
            pendingRestoreRef.current = null;
          });
        });
      }
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          pathname,
          scrollTop: getScrollContainer()?.scrollTop ?? window.scrollY,
        })
      );
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }, [pathname, router]);

  return null;
}
