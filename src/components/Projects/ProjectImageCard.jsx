import { useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import './ProjectImageCard.css';

const SPEEDS = [1, 1.25, 1.5, 2, 0.5];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function ProjectImageCard({ video, poster, images = [], alt, gradientIndex = 0 }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasImages = images.length > 0;
  const hasMultipleImages = !video && images.length > 1;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const goToImage = (event, nextIndex) => {
    event.stopPropagation();
    event.preventDefault();
    setImageIndex((nextIndex + images.length) % images.length);
  };

  const togglePlay = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  };

  const seekToClientX = (clientX, rect) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setCurrentTime(el.currentTime);
  };

  const handleSeekStart = (event) => {
    event.stopPropagation();
    event.preventDefault();
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    seekToClientX(event.clientX, event.currentTarget.getBoundingClientRect());
  };

  const handleSeekMove = (event) => {
    if (!isDraggingRef.current) return;
    event.stopPropagation();
    seekToClientX(event.clientX, event.currentTarget.getBoundingClientRect());
  };

  const handleSeekEnd = (event) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleSeekKeyDown = (event) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      el.currentTime = Math.min(el.duration, el.currentTime + 5);
      setCurrentTime(el.currentTime);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      el.currentTime = Math.max(0, el.currentTime - 5);
      setCurrentTime(el.currentTime);
    }
  };

  const cycleSpeed = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const nextRate = SPEEDS[(SPEEDS.indexOf(playbackRate) + 1) % SPEEDS.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  return (
    <div className="project-image-card">
      {video ? (
        <>
          <video
            ref={videoRef}
            src={video}
            poster={poster}
            className="project-image-card__image"
            muted
            playsInline
            aria-label={alt}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={(event) => {
              event.currentTarget.currentTime = 0;
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          />
          {!isPlaying && (
            <button
              type="button"
              className="project-image-card__play"
              aria-label={`Reproduzir vídeo de ${alt}`}
              onClick={togglePlay}
            >
              <FaPlay aria-hidden="true" />
            </button>
          )}
          <div className="project-image-card__controls">
            <div
              className="project-image-card__progress"
              role="slider"
              tabIndex={0}
              aria-label={`Progresso do vídeo de ${alt}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              onPointerDown={handleSeekStart}
              onPointerMove={handleSeekMove}
              onPointerUp={handleSeekEnd}
              onPointerCancel={handleSeekEnd}
              onKeyDown={handleSeekKeyDown}
            >
              <div className="project-image-card__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="project-image-card__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              type="button"
              className="project-image-card__speed"
              aria-label={`Velocidade do vídeo: ${playbackRate}x`}
              onClick={cycleSpeed}
            >
              {playbackRate}x
            </button>
          </div>
        </>
      ) : hasImages ? (
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
