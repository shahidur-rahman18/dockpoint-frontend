import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  size?: ModalSize;
  showHeader?: boolean;
  ariaLabelledBy?: string;
  contentClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
  onClose: () => void;
  children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  title,
  description,
  size = 'md',
  showHeader = true,
  ariaLabelledBy,
  contentClassName = '',
  overlayClassName = '',
  panelClassName = '',
  onClose,
  children,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const initialFocusTarget =
      dialogRef.current?.querySelector<HTMLElement>(focusableSelector) ?? dialogRef.current;
    initialFocusTarget?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (document.activeElement === dialogRef.current) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const portalRoot = document.querySelector('.theme-root') ?? document.body;

  return createPortal(
    <div
      data-shared-modal
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 ${overlayClassName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy ?? (showHeader ? titleId : undefined)}
        aria-label={!showHeader && !ariaLabelledBy ? title : undefined}
        aria-describedby={showHeader && description ? descriptionId : undefined}
        className={`shared-modal my-auto w-full ${sizeClasses[size]} rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 text-[var(--text-primary)] shadow-2xl outline-none sm:p-6 ${panelClassName}`}
      >
        {showHeader && (
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-bold text-[var(--text-primary)]">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="cursor-pointer shrink-0 rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
            >
              <X className="size-4" />
            </button>
          </header>
        )}
        <div data-modal-content className={`${showHeader ? 'mt-5' : ''} ${contentClassName}`}>
          {children}
        </div>
      </section>
    </div>,
    portalRoot,
  );
}
