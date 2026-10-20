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
import { LogoLoop } from '../LogoLoop/LogoLoop';
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

// Só a faixa de tecnologias rolando; a antiga seção "Competências & Habilidades" saiu.
export function Skills() {
  return (
    <section id="tecnologias" className="skills" aria-label="Tecnologias">
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
    </section>
  );
}
