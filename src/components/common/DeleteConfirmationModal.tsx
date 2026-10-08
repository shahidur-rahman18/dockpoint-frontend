import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  open: boolean;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  open,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete?',
  cancelLabel = 'Cancel',
  confirmLabel = 'Yes, Delete',
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) return;

    const previouslyFocusedElement = document.activeElement;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancelRef.current();
      } else if (event.key === 'Tab' && event.shiftKey && document.activeElement === cancelButtonRef.current) {
        event.preventDefault();
        confirmButtonRef.current?.focus();
      } else if (event.key === 'Tab' && !event.shiftKey && document.activeElement === confirmButtonRef.current) {
        event.preventDefault();
        cancelButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        className="w-full max-w-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-5 text-center shadow-xl"
      >
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-md bg-red-600 text-white">
          <Trash2 aria-hidden="true" className="size-5" />
        </div>
        <h2 id="delete-confirmation-title" className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
        <p id="delete-confirmation-description" className="mt-1 text-sm text-[var(--text-secondary)]">
          {description}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-md bg-[var(--bg-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteConfirmationModal;
