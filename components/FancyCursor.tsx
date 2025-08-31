'use client';
import { useEffect, useRef, useState } from 'react';

export default function FancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const detectDisabled = () => {
      const touch =
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      const reduceMotion = window
        .matchMedia('(prefers-reduced-motion: reduce)')
        .matches;
      const stored = localStorage.getItem('cursorDisabled') === 'true';
      return touch || reduceMotion || stored;
    };
    setDisabled(detectDisabled());

    const handleToggle = () => setDisabled(detectDisabled());
    window.addEventListener('storage', handleToggle);
    window.addEventListener('cursor-toggle', handleToggle as EventListener);
    return () => {
      window.removeEventListener('storage', handleToggle);
      window.removeEventListener(
        'cursor-toggle',
        handleToggle as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (disabled) return;

    const move = (e: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const down = () => cursorRef.current?.classList.add('cursor--down');
    const up = () => cursorRef.current?.classList.remove('cursor--down');

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [disabled]);

  return disabled ? null : <div ref={cursorRef} className="cursor" />;
}
