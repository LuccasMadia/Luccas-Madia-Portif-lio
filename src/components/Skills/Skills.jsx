import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiPython,
  SiMysql,
  SiHtml5,
  SiCss,
} from 'react-icons/si';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import { AnimatedCounter } from '../AnimatedCounter/AnimatedCounter';
import { LogoLoop } from '../LogoLoop/LogoLoop';
import { iconMap } from '../../utils/icons';
import './Skills.css';

const languages = [
  { node: <SiReact />, title: 'React' },
  { node: <SiJavascript />, title: 'JavaScript' },
  { node: <SiNodedotjs />, title: 'Node.js' },
  { node: <SiNextdotjs />, title: 'Next.js' },
  { node: <SiPython />, title: 'Python' },
  { node: <SiMysql />, title: 'MySQL' },
  { node: <SiHtml5 />, title: 'HTML5' },
  { node: <SiCss />, title: 'CSS3' },
];

export function Skills({ skills, about }) {
  return (
    <AnimatedSection id="habilidades" className="skills">
      <p className="section-label">Competências</p>
      <h2 className="section-title">Habilidades</h2>

      <div className="skills__stats">
        <div className="skills__stat">
          <AnimatedCounter target={about.projectsDelivered} suffix="+" />
          <p>projetos entregues</p>
        </div>
      </div>

      <div className="skills__group">
        <h3>Tecnologias</h3>
        <LogoLoop
          logos={languages}
          speed={60}
          direction="left"
          logoHeight={32}
          gap={56}
          pauseOnHover
          fadeOut
          fadeOutColor="var(--bg)"
          scaleOnHover
          ariaLabel="Linguagens e tecnologias utilizadas"
        />
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
