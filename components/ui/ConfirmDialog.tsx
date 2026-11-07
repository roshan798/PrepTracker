'use client';

import { AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialog = (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={event => {
        if (event.target === event.currentTarget) onCancel();
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') onCancel();
      }}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle size={21} aria-hidden="true" />
          </div>
          <h2
            id="confirm-dialog-title"
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-syne), sans-serif', color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p id="confirm-dialog-description" className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );

  return typeof document === 'undefined' ? null : createPortal(dialog, document.body);
}
