'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  };
  const Icon = icons[type];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border toast-slide ${colors[type]}`}
      style={{ minWidth: 280, backdropFilter: 'blur(10px)' }}>
      <Icon size={16} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity"><X size={14} /></button>
    </div>
  );
}
