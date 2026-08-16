import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(target, duration = 1200, { start = true, delay = 0 } = {}) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!start) return undefined;

    let frame;
    startRef.current = null;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      setValue(Math.floor(progress * target));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, start, delay]);

  return value;
}
