import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export function AnimatedCounter({ target, suffix = '', duration = 1200, start = true, delay = 0 }) {
  const value = useAnimatedCounter(target, duration, { start, delay });
  return (
    <span className="animated-counter">
      {value}
      {suffix}
    </span>
  );
}
