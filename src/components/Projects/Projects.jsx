import { ProjectsStack } from './ProjectsStack';
import './Projects.css';

const PREVIEW_LIMIT = 5;

export function Projects({ projects }) {
  const previewProjects = projects.slice(0, PREVIEW_LIMIT);

  return (
    <section id="projetos" className="projects">
      <div className="projects__heading">
        <div>
          <p className="section-label">Portfólio</p>
          <h2 className="section-title">Projetos</h2>
        </div>
        <a href="/projetos" className="btn btn--outline">
          Ver mais projetos
        </a>
      </div>
      <p className="projects__note">
        Alguns projetos não estão listados aqui por serem sistemas internos de empresas (como controle de
        agendamento de exames, controle de férias, entre outros) que lidam com informações sensíveis e por isso
        não podem ser exibidos publicamente.
      </p>
      <ProjectsStack projects={previewProjects} />
    </section>
  );
}
