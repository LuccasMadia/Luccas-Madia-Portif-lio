import './NotebookFrame.css';

export function NotebookFrame({ src, alt, gradientIndex = 0, title, description, stack }) {
  return (
    <div className="notebook-frame">
      <div className="notebook-frame__bezel">
        <span className="notebook-frame__camera" aria-hidden="true" />
        <div className="notebook-frame__screen-wrap">
          {src ? (
            <img src={src} alt={alt} loading="lazy" className="notebook-frame__screen" />
          ) : (
            <div
              role="img"
              aria-label={alt}
              className={`notebook-frame__screen notebook-frame__screen--gradient-${gradientIndex % 3}`}
            />
          )}
          {title && (
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
        </div>
      </div>
      <div className="notebook-frame__base" aria-hidden="true">
        <span className="notebook-frame__hinge" />
      </div>
    </div>
  );
}
