import { motion, useScroll, useTransform } from 'framer-motion';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { scrollToSection } from '../../utils/scrollToSection';
import './Hero.css';

export function Hero({ about }) {
  const { displayedText } = useTypingEffect(about.tagline, 40);
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 400], [0, 120]);

  return (
    <section id="sobre" className="hero">
      <motion.div className="hero__glow" style={{ y: glowY }} aria-hidden="true" />
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="hero__eyebrow">Portfólio</p>
        <h1 className="hero__name">{about.name}</h1>
        <p className="hero__tagline">
          {displayedText}
          <span className="hero__cursor" aria-hidden="true">
            |
          </span>
        </p>
        <p className="hero__bio">{about.bio}</p>
        <div className="hero__actions">
          <a
            href="#projetos"
            className="btn btn--primary"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('projetos');
            }}
          >
            Ver projetos
          </a>
          <a
            href="#contato"
            className="btn btn--outline"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('contato');
            }}
          >
            Fale comigo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
