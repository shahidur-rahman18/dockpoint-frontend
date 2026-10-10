import { useEffect, useId, useRef } from 'react';
import { CheckCircle2, CircleX } from 'lucide-react';

export interface FeedbackModalProps {
  open: boolean;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onClose: () => void;
}

interface ModalContentProps extends FeedbackModalProps {
  variant: 'success' | 'failure';
}

function FeedbackModal({
  open,
  title,
  description,
  buttonLabel = 'Close',
  onClose,
  variant,
}: ModalContentProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const id = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previouslyFocusedElement = document.activeElement;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
    };
  }, [open]);

  if (!open) return null;

  const isSuccess = variant === 'success';
  const Icon = isSuccess ? CheckCircle2 : CircleX;
  const modalTitle = title ?? (isSuccess ? 'Success!' : 'Something went wrong');
  const modalDescription =
    description ??
    (isSuccess
      ? 'Your action was completed successfully.'
      : "We couldn't complete your request. Please try again.");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        className="w-full max-w-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-6 text-center shadow-xl"
      >
        <div
          className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full ${
            isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          <Icon aria-hidden="true" className="size-8" />
        </div>
        <h2 id={`${id}-title`} className="text-base font-semibold text-[var(--text-primary)]">
          {modalTitle}
        </h2>
        <p id={`${id}-description`} className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {modalDescription}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className={`mt-5 min-h-10 rounded-lg px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isSuccess
              ? 'bg-emerald-600 focus-visible:outline-emerald-600'
              : 'bg-rose-600 focus-visible:outline-rose-600'
          }`}
        >
          {buttonLabel}
        </button>
      </section>
    </div>
  );
}

export function SuccessModal(props: FeedbackModalProps) {
  return <FeedbackModal {...props} variant="success" />;
}

export function FailureModal(props: FeedbackModalProps) {
  return <FeedbackModal {...props} variant="failure" />;
}
