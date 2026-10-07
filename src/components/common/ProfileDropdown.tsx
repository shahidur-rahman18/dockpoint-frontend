import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface ProfileDropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  dividerBefore?: boolean;
}

interface ProfileDropdownProps {
  name: string;
  role: string;
  avatarUrl: string;
  items: ProfileDropdownItem[];
}

export function ProfileDropdown({
  name,
  role,
  avatarUrl,
  items,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <img
          src={avatarUrl}
          alt=""
          className="w-8 h-8 rounded-full object-cover border border-slate-200"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          <div className="mb-1 flex items-center gap-2.5 rounded-lg bg-slate-50 px-2.5 py-2">
            <img
              src={avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{name}</p>
              <p className="truncate text-xs text-slate-500">{role}</p>
            </div>
          </div>

          <div className="py-1">
            {items.map((item) => (
              <div key={item.id}>
                {item.dividerBefore && (
                  <div className="my-1 border-t border-slate-200" />
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors cursor-pointer ${
                    item.variant === 'danger'
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
