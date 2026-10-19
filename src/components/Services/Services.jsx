import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { scrollToSection } from '../../utils/scrollToSection';
import './Services.css';

const TILT = 10; // graus máximos de inclinação
const SPRING = { stiffness: 220, damping: 20 };

// Cartão com foto de fundo e texto por cima; no computador inclina em 3D seguindo o mouse.
function ServiceCard({ service }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [TILT, -TILT]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-TILT, TILT]), SPRING);
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);

  function move(event) {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width);
    py.set((event.clientY - box.top) / box.height);
  }

  function leave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.article
      className="service-card"
      style={{ rotateX, rotateY, '--glare-x': glareX, '--glare-y': glareY }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <img className="service-card__image" src={service.image} alt="" loading="lazy" />
      <div className="service-card__shade" />
      <div className="service-card__glare" />
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
    </motion.article>
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
