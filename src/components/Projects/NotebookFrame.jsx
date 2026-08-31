import { useState } from 'react';
import './NotebookFrame.css';

export function NotebookFrame({ images = [], alt, gradientIndex = 0, title, description, stack }) {
  const [imageIndex, setImageIndex] = useState(0);
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const goToImage = (event, nextIndex) => {
    event.stopPropagation();
    event.preventDefault();
    setImageIndex((nextIndex + images.length) % images.length);
  };

  return (
    <div className="notebook-frame">
      <div className="notebook-frame__bezel">
        <span className="notebook-frame__camera" aria-hidden="true" />
        <div className="notebook-frame__screen-wrap">
          {hasImages ? (
            <img
              src={images[imageIndex]}
              alt={alt}
              loading="lazy"
              className="notebook-frame__screen"
            />
          ) : (
            <div
              role="img"
              aria-label={alt}
              className={`notebook-frame__screen notebook-frame__screen--gradient-${gradientIndex % 3}`}
            />
          )}
          {title && imageIndex === 0 && (
            <div className="notebook-frame__overlay" aria-hidden="true">
              <h3 className="notebook-frame__overlay-title">{title}</h3>
              {description && <p className="notebook-frame__overlay-description">{description}</p>}
              {stack?.length > 0 && (
                <ul className="notebook-frame__overlay-stack">
                  {stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                className="notebook-frame__image-nav notebook-frame__image-nav--prev"
                aria-label="Imagem anterior"
                onClick={(event) => goToImage(event, imageIndex - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="notebook-frame__image-nav notebook-frame__image-nav--next"
                aria-label="Próxima imagem"
                onClick={(event) => goToImage(event, imageIndex + 1)}
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
      <div className="notebook-frame__base" aria-hidden="true">
        <span className="notebook-frame__hinge" />
      </div>
    </div>
  );
}
