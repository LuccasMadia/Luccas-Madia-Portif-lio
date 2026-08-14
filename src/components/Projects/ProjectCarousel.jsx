import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ProjectCarousel.css';

export function ProjectCarousel({ images, alt = '', interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setAspectRatio(`${probe.naturalWidth} / ${probe.naturalHeight}`);
    probe.src = images[0];
  }, [images]);

  const goTo = useCallback(
    (nextIndex) => {
      setIndex((nextIndex + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, index]);

  return (
    <div className="project-carousel" style={aspectRatio ? { aspectRatio } : undefined}>
      <motion.img
        key={index}
        src={images[index]}
        alt={`${alt} — captura de tela ${index + 1}`}
        className={`project-carousel__image${aspectRatio ? ' project-carousel__image--fitted' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="project-carousel__arrow project-carousel__arrow--prev"
            aria-label="Imagem anterior"
            onClick={() => goTo(index - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="project-carousel__arrow project-carousel__arrow--next"
            aria-label="Próxima imagem"
            onClick={() => goTo(index + 1)}
          >
            ›
          </button>
          <div className="project-carousel__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`project-carousel__dot ${i === index ? 'project-carousel__dot--active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
