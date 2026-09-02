import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { AnimatedCounter } from '../AnimatedCounter/AnimatedCounter';
import { iconMap } from '../../utils/icons';
import './Skills.css';

const COUNTER_START_DELAY = 500;
const KEY_TRANSITION = { type: 'spring', stiffness: 500, damping: 25 };

export function Skills({ skills, about }) {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <AnimatedSection id="habilidades" className="skills" onViewportEnter={() => setHasEntered(true)}>
      <p className="section-label">Competências &</p>
      <h2 className="section-title">Habilidades</h2>

      <div className="skills__stats">
        <div className="skills__stat">
          <AnimatedCounter
            target={about.projectsDelivered}
            suffix="+"
            start={hasEntered}
            delay={COUNTER_START_DELAY}
          />
          <p>projetos entregues</p>
        </div>
      </div>

      <div className="keyboard">
        <p className="keyboard__hint">(dica: clique numa tecla)</p>
        <div className="keyboard__grid">
          {skills.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.button
                type="button"
                className="keyboard__key"
                key={item.name}
                whileHover={{ y: -4 }}
                whileTap={{ y: 3 }}
                whileFocus={{ y: -4 }}
                transition={KEY_TRANSITION}
              >
                {Icon && <Icon aria-hidden="true" />}
                <span>{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
