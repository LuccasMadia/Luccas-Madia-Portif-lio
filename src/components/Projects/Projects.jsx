import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Projects.css';

export function Projects({ projects }) {
  return (
    <AnimatedSection id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <div className="projects__grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="project-card__stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-card__actions">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Ver projeto
              </a>
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                Código
              </a>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
