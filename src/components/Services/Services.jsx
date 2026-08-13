import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { iconMap } from '../../utils/icons';
import './Services.css';

export function Services({ services }) {
  return (
    <AnimatedSection id="servicos" className="services">
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <div className="service-card" key={service.id}>
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
