import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export function AnimatedCounter({ target, suffix = '', duration = 1200 }) {
  const value = useAnimatedCounter(target, duration);
  return (
    <span className="animated-counter">
      {value}
      {suffix}
    </span>
  );
}
