'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type ProgressState = 'idle' | 'loading' | 'finishing';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [state, setState] = useState<ProgressState>('idle');
  const [progress, setProgress] = useState(0);
  const currentPathRef = useRef(pathname);
  const startPathRef = useRef(pathname);
  const progressFrameRef = useRef<number | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (progressFrameRef.current !== null) cancelAnimationFrame(progressFrameRef.current);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    startPathRef.current = currentPathRef.current;
    setProgress(12);
    setState('loading');
    progressFrameRef.current = requestAnimationFrame(() => setProgress(78));
    fallbackTimerRef.current = setTimeout(() => {
      setProgress(100);
      setState('finishing');
      finishTimerRef.current = setTimeout(() => setState('idle'), 250);
    }, 12000);
  }, [clearTimers]);

  const finish = useCallback(() => {
    clearTimers();
    setProgress(100);
    setState('finishing');
    finishTimerRef.current = setTimeout(() => setState('idle'), 250);
  }, [clearTimers]);

  useEffect(() => {
    currentPathRef.current = pathname;
    if (state === 'loading' && pathname !== startPathRef.current) finish();
  }, [finish, pathname, state]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      start();
    };

    const handlePopState = () => start();
    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      clearTimers();
    };
  }, [clearTimers, start]);

  return (
    <div
      className="route-progress"
      data-state={state}
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-hidden={state === 'idle'}>
      <span className="route-progress-track">
        <span className="route-progress-fill" style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}
