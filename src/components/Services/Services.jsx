import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { scrollToSection } from '../../utils/scrollToSection';
import './Services.css';

// Cartão parado com foto de fundo e texto por cima; ao passar o mouse só a foto dá zoom.
function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <img className="service-card__image" src={service.image} alt="" loading="lazy" />
      <div className="service-card__shade" />
      <div className="service-card__content">
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__text">{service.description}</p>
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
