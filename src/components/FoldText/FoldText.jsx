import { motion } from 'framer-motion';
import './FoldText.css';

const GSAP_EASE_MAP = {
  'power1.out': [0.25, 0.46, 0.45, 0.94],
  'power2.out': [0.16, 1, 0.3, 1],
  'power3.out': [0.19, 1, 0.22, 1],
  'power4.out': [0.23, 1, 0.32, 1],
  'power1.in': [0.55, 0.06, 0.68, 0.19],
  'power2.in': [0.55, 0.09, 0.68, 0.53],
  'power1.inOut': [0.45, 0, 0.55, 1],
  'power2.inOut': [0.83, 0, 0.17, 1],
};

function resolveEase(ease) {
  return GSAP_EASE_MAP[ease] ?? ease;
}

export function getFoldTextDuration(text, { duration = 0.6, stagger = 0.04, splitBy = 'char' } = {}) {
  const units = splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text);
  if (units.length === 0) return 0;
  return (units.length - 1) * stagger + duration;
}

const HINGE_CONFIG = {
  top: { axis: 'rotateX', from: -90, origin: 'top', gradient: 'to bottom' },
  bottom: { axis: 'rotateX', from: 90, origin: 'bottom', gradient: 'to top' },
  left: { axis: 'rotateY', from: -90, origin: 'left', gradient: 'to right' },
  right: { axis: 'rotateY', from: 90, origin: 'right', gradient: 'to left' },
};

export default function FoldText({
  text,
  splitBy = 'char',
  hinge = 'top',
  duration = 0.6,
  stagger = 0.04,
  ease = 'easeOut',
  perspective = 600,
  creaseShading = 0.4,
  fontSize,
  fontWeight = 'inherit',
  color = 'currentColor',
  startDelay = 0,
}) {
  const units = splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text);
  const { axis, from, origin, gradient } = HINGE_CONFIG[hinge] ?? HINGE_CONFIG.top;
  const resolvedEase = resolveEase(ease);

  return (
    <span
      className="fold-text"
      style={{ ...(fontSize ? { fontSize } : {}), fontWeight, color, perspective }}
      aria-label={text}
    >
      {units.map((unit, index) => {
        const display = unit === ' ' ? ' ' : unit;
        const delay = startDelay + index * stagger;

        return (
          <span className="fold-text__unit" key={`${unit}-${index}`} aria-hidden="true">
            <motion.span
              className="fold-text__inner"
              style={{ transformOrigin: origin }}
              initial={{ [axis]: from, opacity: 0 }}
              animate={{ [axis]: 0, opacity: 1 }}
              transition={{ duration, delay, ease: resolvedEase }}
            >
              {display}
              <motion.span
                className="fold-text__crease"
                style={{ backgroundImage: `linear-gradient(${gradient}, rgba(0, 0, 0, ${creaseShading}), transparent 60%)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration, delay, ease: 'easeInOut', times: [0, 0.5, 1] }}
              />
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
