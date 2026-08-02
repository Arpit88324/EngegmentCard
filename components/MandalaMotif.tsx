export function MandalaRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="90" opacity="0.5" />
        <circle cx="100" cy="100" r="72" opacity="0.4" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x1 = 100 + Math.cos(angle) * 72;
          const y1 = 100 + Math.sin(angle) * 72;
          const x2 = 100 + Math.cos(angle) * 90;
          const y2 = 100 + Math.sin(angle) * 90;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.35" />;
        })}
        <circle cx="100" cy="100" r="40" opacity="0.5" />
      </g>
    </svg>
  );
}

export function LotusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="currentColor" aria-hidden="true">
      <path d="M32 6c4 8 6 14 6 19a6 6 0 01-12 0c0-5 2-11 6-19z" opacity="0.9" />
      <path d="M14 20c6 3 11 8 13 13a6 6 0 01-8.5 8c-4-4-6-11-4.5-21z" opacity="0.75" />
      <path d="M50 20c-6 3-11 8-13 13a6 6 0 008.5 8c4-4 6-11 4.5-21z" opacity="0.75" />
      <path d="M4 34c7-2 13-1 17 2a6 6 0 01-4 10.5c-5 0-11-4-13-12.5z" opacity="0.6" />
      <path d="M60 34c-7-2-13-1-17 2a6 6 0 004 10.5c5 0 11-4 13-12.5z" opacity="0.6" />
      <path d="M6 40c14 6 30 6 44 0-4 5-13 8-22 8s-18-3-22-8z" />
    </svg>
  );
}

export function BodhiLeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1C5 8 2 15 2 20a10 10 0 0020 0c0-5-3-12-10-19z" />
    </svg>
  );
}
