import * as React from 'react';

export default function Celebration() {
  const [reduced, setReduced] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <div aria-live="polite" className="grid place-items-center py-8">
      <div className="text-3xl">{reduced ? '🎊' : '🎉✨🎉'}</div>
      <p className="mt-2 text-sm text-[--muted]">Great job! Keep it up.</p>
    </div>
  );
}
