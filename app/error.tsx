'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-page">
      <p className="status-page__code">오류</p>
      <h1 className="status-page__title">문제가 발생했어요</h1>
      <p className="status-page__desc">
        일시적인 오류일 수 있어요. 다시 시도하거나 홈으로 이동해 주세요.
      </p>
      <div className="status-page__actions">
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          다시 시도
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
