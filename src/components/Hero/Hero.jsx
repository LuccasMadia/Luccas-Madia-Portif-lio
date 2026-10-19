import { motion } from 'framer-motion';
import { iconMap } from '../../utils/icons';
import { scrollToSection } from '../../utils/scrollToSection';
import './Hero.css';

const ENTER = { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0 } };
const enter = (order) => ({ duration: 0.7, delay: order * 0.12, ease: [0.2, 0.7, 0.2, 1] });

// `ready` segura a entrada até a tela de boas-vindas sumir, para a animação não rodar escondida.
export function Hero({ about, services, ready = true }) {
  const state = ready ? 'shown' : 'hidden';

  return (
    <section id="sobre" className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <motion.div variants={ENTER} initial="hidden" animate={state} transition={enter(0)}>
            <h1 className="hero__company">{about.company}</h1>
            <p className="hero__signature">
              por <strong>{about.name}</strong>
            </p>
          </motion.div>
          <motion.p className="hero__description" variants={ENTER} initial="hidden" animate={state} transition={enter(1)}>
            {about.heroDescription}
          </motion.p>
          <motion.div className="hero__actions" variants={ENTER} initial="hidden" animate={state} transition={enter(2)}>
            <a
              href="#contato"
              className="btn btn--primary"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('contato');
              }}
            >
              Fale comigo
            </a>
            <a
              href="#projetos"
              className="btn btn--outline"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('projetos');
              }}
            >
              Ver projetos
            </a>
          </motion.div>
        </div>

        <ul className="hero__services">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.li
                key={service.id}
                className="hero__service"
                variants={ENTER}
                initial="hidden"
                animate={state}
                transition={enter(3 + index)}
              >
                {Icon && <Icon className="hero__service-icon" aria-hidden="true" />}
                <h2 className="hero__service-title">{service.title}</h2>
                <p className="hero__service-text">{service.description}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
