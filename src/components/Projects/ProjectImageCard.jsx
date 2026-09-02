import { useState } from 'react';
import './ProjectImageCard.css';

export function ProjectImageCard({ images = [], alt, gradientIndex = 0 }) {
  const [imageIndex, setImageIndex] = useState(0);
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const goToImage = (event, nextIndex) => {
    event.stopPropagation();
    event.preventDefault();
    setImageIndex((nextIndex + images.length) % images.length);
  };

  return (
    <div className="project-image-card">
      {hasImages ? (
        <img
          src={images[imageIndex]}
          alt={alt}
          loading="lazy"
          className="project-image-card__image"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`project-image-card__image project-image-card__image--gradient-${gradientIndex % 3}`}
        />
      )}
      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="project-image-card__nav project-image-card__nav--prev"
            aria-label="Imagem anterior"
            onClick={(event) => goToImage(event, imageIndex - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="project-image-card__nav project-image-card__nav--next"
            aria-label="Próxima imagem"
            onClick={(event) => goToImage(event, imageIndex + 1)}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
