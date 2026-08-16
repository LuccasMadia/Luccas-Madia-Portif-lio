import { motion, useScroll, useTransform } from 'framer-motion';
import StrokeText, { getStrokeTextDuration } from '../StrokeText/StrokeText';
import FoldText, { getFoldTextDuration } from '../FoldText/FoldText';
import { scrollToSection } from '../../utils/scrollToSection';
import './Hero.css';

const NAME_ANIMATION = { drawDuration: 1.6, fillDelay: 0.2, stagger: 0.05 };
const TAGLINE_ANIMATION = { duration: 0.4, stagger: 0.02, splitBy: 'char' };
const TAGLINE_OVERLAP = 0.6;

export function Hero({ about }) {
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 400], [0, 120]);

  const taglineStart = Math.max(0, getStrokeTextDuration(about.name, NAME_ANIMATION) - TAGLINE_OVERLAP);
  const bioStart = taglineStart + getFoldTextDuration(about.tagline, TAGLINE_ANIMATION);

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
        <h1 className="hero__name">
          <StrokeText
            text={about.name}
            strokeColor="var(--accent)"
            fillColor="var(--text)"
            strokeWidth={1.4}
            {...NAME_ANIMATION}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontWeight={700}
            letterSpacing={-1}
            reverse={false}
          />
        </h1>
        <p className="hero__tagline">
          <FoldText
            text={about.tagline}
            hinge="top"
            trigger="mount"
            {...TAGLINE_ANIMATION}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            color="var(--accent)"
            startDelay={taglineStart}
          />
        </p>
        <motion.p
          className="hero__bio"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: bioStart, ease: 'easeOut' }}
        >
          {about.bio}
        </motion.p>
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
