import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface MenuPosition {
  top: number;
  right: number;
}

interface ActionDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionDropdown({
  isOpen,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: ActionDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = containerRef.current?.getBoundingClientRect();
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const { innerHeight, innerWidth } = window;
      const menuRect = menu.getBoundingClientRect();
      const spaceBelow = innerHeight - trigger.bottom;
      const spaceAbove = trigger.top;
      const openBelow = spaceBelow >= menuRect.height + 8 || spaceBelow >= spaceAbove;
      const top = openBelow
        ? trigger.bottom + 4
        : trigger.top - menuRect.height - 4;
      const right = Math.min(
        Math.max(8, innerWidth - trigger.right),
        Math.max(8, innerWidth - menuRect.width - 8),
      );

      setMenuPosition({
        top: Math.min(Math.max(8, top), innerHeight - menuRect.height - 8),
        right,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        onToggle();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={onToggle}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: menuPosition?.top ?? 0,
              right: menuPosition?.right ?? 0,
              visibility: menuPosition ? 'visible' : 'hidden',
            }}
            className="z-50 w-[152px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5"
          >
            <button
              type="button"
              role="menuitem"
              disabled={!onView}
              onClick={() => {
                onView?.();
                onToggle();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors enabled:cursor-pointer enabled:hover:bg-slate-50 enabled:hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>View</span>
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!onEdit}
              title={!onEdit ? 'Editing is not connected to the API yet' : undefined}
              onClick={() => {
                onEdit?.();
                onToggle();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors enabled:cursor-pointer enabled:hover:bg-slate-50 enabled:hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!onDelete}
              title={!onDelete ? 'Deleting is not connected to the API yet' : undefined}
              onClick={() => {
                onDelete?.();
                onToggle();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 transition-colors enabled:cursor-pointer enabled:hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>,
          document.querySelector('.dashboard-content') ?? document.body,
        )
      )}
    </div>
  );
}
