import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ServicesFolder.css';

// Contorno da frente da pasta (do componente "folder interaction"), em coordenadas 235x122.
const FRONT_PATH =
  'M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z';

// Posição de cada folha: guardada na pasta e aberta em leque. O celular usa um leque mais fechado.
const FAN = [
  { closed: { x: -54, y: 4, rotate: -4 }, open: { x: -196, y: -62, rotate: -8 } },
  { closed: { x: -18, y: 0, rotate: -1 }, open: { x: -66, y: -104, rotate: -2 } },
  { closed: { x: 18, y: 1, rotate: 1.5 }, open: { x: 66, y: -104, rotate: 2 } },
  { closed: { x: 54, y: 3, rotate: 4 }, open: { x: 196, y: -62, rotate: 8 } },
];
const NARROW_SCALE = 0.62;
const PAGE_SPRING = { type: 'spring', stiffness: 175, damping: 22 };
const FRONT_SPRING = { type: 'spring', duration: 0.5, bounce: 0.2 };

function useNarrow() {
  const query = '(max-width: 520px)';
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setNarrow(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return narrow;
}

// No computador abre ao passar o mouse; no celular (e pelo teclado) abre ao tocar.
export function ServicesFolder({ services }) {
  const [open, setOpen] = useState(false);
  const narrow = useNarrow();
  const scale = narrow ? NARROW_SCALE : 1;
  const hoverable = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;

  return (
    <div className="services-folder">
      <div
        className={`services-folder__box${open ? ' services-folder__box--open' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label="Serviços"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
        onMouseEnter={hoverable ? () => setOpen(true) : undefined}
        onMouseLeave={hoverable ? () => setOpen(false) : undefined}
      >
        <div className="services-folder__tab" />
        <div className="services-folder__back" />

        {services.slice(0, FAN.length).map((service, index) => {
          const { closed, open: opened } = FAN[index];
          const target = open ? opened : closed;
          return (
            <motion.div
              key={service.id}
              className="services-folder__page"
              style={{ zIndex: index === 1 || index === 2 ? 20 : 10 }}
              initial={false}
              animate={{ x: target.x * scale, y: target.y, rotate: target.rotate }}
              transition={{ ...PAGE_SPRING, stiffness: PAGE_SPRING.stiffness + index * 8 }}
            >
              <h3 className="services-folder__page-title">{service.title}</h3>
              <p className="services-folder__page-text">{service.short}</p>
            </motion.div>
          );
        })}

        <motion.div
          className="services-folder__front"
          initial={false}
          animate={{ rotateX: open ? -40 : 0 }}
          transition={FRONT_SPRING}
        >
          <div className="services-folder__glass" />
          <svg viewBox="0 0 235 121" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="services-folder-fill" x1="117" y1="0" x2="117" y2="122" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1d3b37" />
                <stop offset="1" stopColor="#232323" />
              </linearGradient>
              <linearGradient id="services-folder-stroke" x1="117" y1="0" x2="117" y2="122" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2dd4bf" stopOpacity="0.35" />
                <stop offset="1" stopColor="#2dd4bf" stopOpacity="0.05" />
              </linearGradient>
              <clipPath id="services-folder-shape" clipPathUnits="objectBoundingBox">
                <path transform="scale(0.00424 0.0082)" d={FRONT_PATH} />
              </clipPath>
            </defs>
            <path d={FRONT_PATH} fill="url(#services-folder-fill)" fillOpacity="0.72" stroke="url(#services-folder-stroke)" strokeWidth="0.8" />
          </svg>
        </motion.div>

        <div className="services-folder__label" aria-hidden={open}>
          <strong>Serviços</strong>
          <span>o que a Madia faz pelo seu negócio</span>
        </div>
      </div>
      <p className="services-folder__hint">{hoverable ? 'passe o mouse para abrir' : 'toque para abrir'}</p>
    </div>
  );
}
