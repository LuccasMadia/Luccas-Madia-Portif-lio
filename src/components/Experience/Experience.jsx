import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Experience.css';

export function Experience({ experiences }) {
  return (
    <AnimatedSection id="experiencias" className="experience">
      <p className="section-label">Trajetória</p>
      <h2 className="section-title">Experiências</h2>
      <ol className="experience__timeline">
        {experiences.map((item) => (
          <li key={item.id} className="experience__item">
            <div className="experience__marker" aria-hidden="true" />
            <div className="experience__content">
              <p className="experience__period">{item.period}</p>
              <h3>
                {item.role} · {item.company}
              </h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </AnimatedSection>
  );
}
