import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { scrollToSection } from '../../utils/scrollToSection';
import './Services.css';

// Cartão com a arte, o nome do serviço e o "Quero saber mais"; a frase aparece ao passar o mouse.
// Também desenha as cópias que voam da pasta (ServicesFlight), que carregam a arte na hora.
export function ServiceCard({ service, loading = 'lazy' }) {
  return (
    <article className="service-card">
      {/* sem arte, o cartão fica só com o fundo cinza */}
      {service.image && <img className="service-card__image" src={service.image} alt={service.title} loading={loading} />}
      <div className="service-card__shade" />
      <div className="service-card__content">
        <h3 className="service-card__title">{service.title}</h3>
        <div className="service-card__details">
          <p className="service-card__text">{service.short}</p>
        </div>
        <a
          href="#contato"
          className="service-card__cta"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('contato');
          }}
        >
          Quero saber mais <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export function Services({ services }) {
  return (
    <AnimatedSection id="servicos" className="services">
      <p className="section-label">O que eu faço</p>
      <h2 className="section-title">Serviços</h2>
      <div className="services__grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </AnimatedSection>
  );
}
