import { useEffect, useState } from 'react';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { iconMap } from '../../utils/icons';
import './Services.css';

const REVEAL_START_DELAY = 500;
const REVEAL_STEP = 400;
const REVEAL_HOLD = 350;

export function Services({ services }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    if (!hasEntered) return;

    const timers = services.map((_, index) =>
      setTimeout(() => setPreviewIndex(index), REVEAL_START_DELAY + index * REVEAL_STEP)
    );
    timers.push(
      setTimeout(
        () => setPreviewIndex(null),
        REVEAL_START_DELAY + (services.length - 1) * REVEAL_STEP + REVEAL_HOLD
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [hasEntered, services]);

  return (
    <AnimatedSection id="servicos" className="services" onViewportEnter={() => setHasEntered(true)}>
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon];
          return (
            <div
              className={`service-card${index === previewIndex ? ' service-card--active' : ''}`}
              key={service.id}
            >
              {Icon && <Icon className="service-card__icon" aria-hidden="true" />}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
