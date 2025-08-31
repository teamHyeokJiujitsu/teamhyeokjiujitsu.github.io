'use client';
import { useEffect, useState } from 'react';

export default function CursorToggle() {
  const [disabled, setDisabled] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const touch =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    if (touch || reduceMotion) return;

    const stored = localStorage.getItem('cursorDisabled') === 'true';
    setDisabled(stored);
    setAvailable(true);

    const handleChange = () => {
      const next = localStorage.getItem('cursorDisabled') === 'true';
      setDisabled(next);
    };
    window.addEventListener('storage', handleChange);
    window.addEventListener('cursor-toggle', handleChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('cursor-toggle', handleChange as EventListener);
    };
  }, []);

  const toggle = () => {
    const next = !disabled;
    localStorage.setItem('cursorDisabled', String(next));
    setDisabled(next);
    window.dispatchEvent(new Event('cursor-toggle'));
  };

  if (!available) return null;

  return (
    <button type="button" className="cursor-toggle" onClick={toggle}>
      {disabled ? '커서 켜기' : '커서 끄기'}
    </button>
  );
}
