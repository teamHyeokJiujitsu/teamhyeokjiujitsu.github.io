'use client';

import { useEffect } from 'react';

export default function KeywordBlockRemover() {
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'),
    );
    for (const heading of headings) {
      if (heading.textContent?.includes('주요 키워드로 빠르게 찾기')) {
        const container = heading.closest('.card') ?? heading.parentElement;
        container?.remove();
      }
    }
  }, []);

  return null;
}
