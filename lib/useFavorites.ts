'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'event-favorites';
const EVENT_NAME = 'event-favorites:change';

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(read());
    setHydrated(true);

    const sync = () => setFavorites(read());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      write(next);
      return next;
    });
  }, []);

  const has = useCallback((slug: string) => favorites.has(slug), [favorites]);

  return { favorites, toggle, has, count: favorites.size, hydrated };
}
