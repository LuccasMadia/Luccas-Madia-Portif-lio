import { useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { NotebookFrame } from './NotebookFrame';
import './Projects.css';

function ProjectCard({ project, index, onOpenCaseStudy }) {
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const gallery = project.images?.length ? project.images : project.caseStudy?.map((area) => area.imagem) ?? [];
  const frame = <NotebookFrame images={gallery} alt={project.title} gradientIndex={index} />;

  let interactiveFrame = frame;
  if (hasGallery) {
    interactiveFrame = (
      <button
        type="button"
        className="project-notebook-trigger"
        aria-label={`Ver projeto ${project.title}`}
        onClick={() => onOpenCaseStudy(project)}
      >
        {frame}
      </button>
    );
  } else if (project.liveUrl) {
    interactiveFrame = (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="project-notebook-trigger"
        aria-label={`Visitar site de ${project.title}`}
      >
        {frame}
      </a>
    );
  }

  return (
    <div className="project-showcase">
      <div className="project-showcase__notebook">{interactiveFrame}</div>
      <div className="project-showcase__info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-showcase__stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = projects.length > 1;

  const goTo = (nextIndex) => {
    setActiveIndex((nextIndex + projects.length) % projects.length);
  };

  return (
    <section id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <p className="projects__note">
        Alguns projetos não estão listados aqui por serem sistemas internos de empresas (como controle de
        agendamento de exames, controle de férias, entre outros) que lidam com informações sensíveis e por isso
        não podem ser exibidos publicamente.
      </p>
      <div className="projects__carousel">
        {hasMultiple && (
          <button
            type="button"
            className="projects__nav projects__nav--prev"
            aria-label="Projeto anterior"
            onClick={() => goTo(activeIndex - 1)}
          >
            ‹
          </button>
        )}
        <div className="projects__stack">
          <ProjectCard
            project={projects[activeIndex]}
            index={activeIndex}
            onOpenCaseStudy={setCaseStudyProject}
            key={projects[activeIndex].id}
          />
        </div>
        {hasMultiple && (
          <button
            type="button"
            className="projects__nav projects__nav--next"
            aria-label="Próximo projeto"
            onClick={() => goTo(activeIndex + 1)}
          >
            ›
          </button>
        )}
      </div>
      {hasMultiple && (
        <div className="projects__dots">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              className={`projects__dot${i === activeIndex ? ' projects__dot--active' : ''}`}
              aria-label={`Ir para o projeto ${project.title}`}
              aria-current={i === activeIndex}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
