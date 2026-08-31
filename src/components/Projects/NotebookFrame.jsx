import './NotebookFrame.css';

export function NotebookFrame({ src, alt, gradientIndex = 0 }) {
  return (
    <div className="notebook-frame">
      <div className="notebook-frame__bezel">
        <span className="notebook-frame__camera" aria-hidden="true" />
        {src ? (
          <img src={src} alt={alt} loading="lazy" className="notebook-frame__screen" />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className={`notebook-frame__screen notebook-frame__screen--gradient-${gradientIndex % 3}`}
          />
        )}
      </div>
      <div className="notebook-frame__base" aria-hidden="true">
        <span className="notebook-frame__hinge" />
      </div>
    </div>
  );
}
