'use client';

import type { MouseEvent } from 'react';

interface Props {
  active: boolean;
  onToggle: () => void;
  size?: number;
}

export default function FavoriteButton({ active, onToggle, size = 22 }: Props) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <button
      type="button"
      className={`fav-btn${active ? ' fav-btn--active' : ''}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      title={active ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 17.27l5.18 3.04-1.37-5.88L20.5 9.49l-6.04-.51L12 3.5l-2.46 5.48-6.04.51 4.69 4.94-1.37 5.88z" />
      </svg>
    </button>
  );
}
