import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { AnimatedCounter } from '../AnimatedCounter/AnimatedCounter';
import { iconMap } from '../../utils/icons';
import './Skills.css';

export function Skills({ skills, about }) {
  return (
    <AnimatedSection id="habilidades" className="skills">
      <p className="section-label">Competências</p>
      <h2 className="section-title">Habilidades</h2>

      <div className="skills__stats">
        <div className="skills__stat">
          <AnimatedCounter target={about.yearsExperience} suffix="+" />
          <p>anos de experiência</p>
        </div>
        <div className="skills__stat">
          <AnimatedCounter target={about.projectsDelivered} suffix="+" />
          <p>projetos entregues</p>
        </div>
      </div>

      {skills.map((group) => (
        <div className="skills__group" key={group.category}>
          <h3>{group.category}</h3>
          <ul className="skills__badges">
            {group.items.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li className="skills__badge" key={item.name}>
                  {Icon && <Icon aria-hidden="true" />}
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </AnimatedSection>
  );
}
