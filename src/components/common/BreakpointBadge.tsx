import { useEffect, useState } from 'react';

const BREAKPOINTS = [
  { name: 'base', min: 0 },
  { name: 'sm', min: 640 },
  { name: 'md', min: 768 },
  { name: 'lg', min: 1024 },
  { name: 'xl', min: 1280 },
  { name: '2xl', min: 1536 },
] as const;

function resolveBreakpoint(width: number): string {
  let label: string = BREAKPOINTS[0].name;

  for (const breakpoint of BREAKPOINTS) {
    if (width >= breakpoint.min) {
      label = breakpoint.name;
    }
  }

  return label;
}

export function BreakpointBadge() {
  const [width, setWidth] = useState(() => window.innerWidth);
  const [label, setLabel] = useState(() => resolveBreakpoint(window.innerWidth));

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setLabel(resolveBreakpoint(window.innerWidth));
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-2 right-2 z-[70] rounded-md bg-primary-700 px-2 py-1 font-mono text-xs text-white shadow-md"
    >
      {label} · {width}px
    </div>
  );
}
