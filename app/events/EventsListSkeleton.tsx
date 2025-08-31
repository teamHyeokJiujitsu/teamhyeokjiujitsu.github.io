import React from 'react';

export default function EventsListSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="card">
          <div
            className="skeleton"
            style={{ height: 20, width: '60%', marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ height: 14, width: '80%', marginBottom: 6 }}
          />
          <div
            className="skeleton"
            style={{ height: 14, width: '50%', marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 3 }).map((__, tagIdx) => (
              <span
                key={tagIdx}
                className="skeleton"
                style={{ height: 20, width: 40, borderRadius: 4 }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
