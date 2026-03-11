'use client';
import { useEffect, useRef } from 'react';

export default function Confetti({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const colors = ['#00E5FF', '#9D7FD4', '#FF4B6E', '#FFD700', '#00FF88', '#FF6B35'];
    const shapes = ['rounded-sm', 'rounded-full', ''];

    const pieces = Array.from({ length: 80 }, (_, i) => {
      const el = document.createElement('div');
      el.className = `confetti-piece ${shapes[i % 3]}`;
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${0.7 + Math.random() * 0.3};
      `;
      return el;
    });

    pieces.forEach(p => container.appendChild(p));
    const cleanup = setTimeout(() => {
      pieces.forEach(p => p.remove());
    }, 5000);
    return () => {
      clearTimeout(cleanup);
      pieces.forEach(p => p.remove());
    };
  }, [active]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-50 overflow-hidden" />;
}
