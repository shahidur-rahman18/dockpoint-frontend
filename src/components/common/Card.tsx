import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm ${className}`}
    />
  );
}

export default Card;
