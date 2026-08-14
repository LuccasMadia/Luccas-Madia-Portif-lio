import { motion } from 'framer-motion';
import './StrokeText.css';

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

export function getStrokeTextDuration(text, { drawDuration = 1.2, fillDelay = 0, stagger = 0.05 } = {}) {
  const length = Array.from(text).length;
  if (length === 0) return 0;
  return (length - 1) * stagger + drawDuration + fillDelay + drawDuration * 0.8;
}

export default function StrokeText({
  text,
  strokeColor = 'currentColor',
  fillColor = 'currentColor',
  strokeWidth = 1,
  drawDuration = 1.2,
  fillDelay = 0,
  stagger = 0.05,
  ease = 'easeOut',
  fillMode = 'wipe',
  fontSize,
  fontWeight = 700,
  letterSpacing = 0,
  reverse = false,
  startDelay = 0,
}) {
  const letters = Array.from(text);
  const resolvedEase = resolveEase(ease);

  return (
    <span
      className="stroke-text"
      style={{ ...(fontSize ? { fontSize } : {}), fontWeight, letterSpacing: `${letterSpacing}px` }}
      aria-label={text}
    >
      {letters.map((letter, index) => {
        const order = reverse ? letters.length - 1 - index : index;
        const drawDelay = startDelay + order * stagger;
        const fillStart = drawDelay + drawDuration + fillDelay;
        const display = letter === ' ' ? ' ' : letter;

        return (
          <span className="stroke-text__letter" key={`${letter}-${index}`} aria-hidden="true">
            <motion.span
              className="stroke-text__layer stroke-text__layer--stroke"
              style={{ WebkitTextStroke: `${strokeWidth}px ${strokeColor}`, color: strokeColor }}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: drawDuration, delay: drawDelay, ease: resolvedEase }}
            >
              {display}
            </motion.span>
            <motion.span
              className="stroke-text__layer stroke-text__layer--fill"
              style={{ color: fillColor }}
              initial={fillMode === 'wipe' ? { clipPath: 'inset(0 100% 0 0)' } : { opacity: 0 }}
              animate={fillMode === 'wipe' ? { clipPath: 'inset(0 0% 0 0)' } : { opacity: 1 }}
              transition={{ duration: drawDuration * 0.8, delay: fillStart, ease: resolvedEase }}
            >
              {display}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
