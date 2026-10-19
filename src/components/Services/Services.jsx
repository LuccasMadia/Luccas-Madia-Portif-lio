import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Services.css';

// Os cartões repetem as folhas da pasta da hero: mesmo visual, nome do serviço e a frase curta.
export function Services({ services }) {
  return (
    <AnimatedSection id="servicos" className="services">
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service) => (
          <article className="service-page" key={service.id}>
            <h3 className="service-page__title">{service.title}</h3>
            <p className="service-page__text">{service.short}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
