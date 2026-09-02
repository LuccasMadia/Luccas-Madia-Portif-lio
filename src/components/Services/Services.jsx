import { useState } from 'react';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { iconMap } from '../../utils/icons';
import './Services.css';

export function Services({ services }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleActive = (index) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <AnimatedSection id="servicos" className="services">
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon];
          const isActive = index === activeIndex;
          return (
            <div
              className={`service-card${isActive ? ' service-card--active' : ''}`}
              key={service.id}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => toggleActive(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleActive(index);
                }
              }}
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
