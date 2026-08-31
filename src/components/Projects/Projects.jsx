import { useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { NotebookFrame } from './NotebookFrame';
import './Projects.css';

function ProjectCard({ project, index, onOpenCaseStudy }) {
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const frame = <NotebookFrame alt={project.title} gradientIndex={index} />;

  if (hasGallery) {
    return (
      <button
        type="button"
        className="project-notebook-trigger"
        aria-label={`Ver projeto ${project.title}`}
        onClick={() => onOpenCaseStudy(project)}
      >
        {frame}
      </button>
    );
  }

  if (project.liveUrl) {
    return (
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

  return frame;
}

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  return (
    <section id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <p className="projects__note">
        Alguns projetos não estão listados aqui por serem sistemas internos de empresas (como controle de
        agendamento de exames, controle de férias, entre outros) que lidam com informações sensíveis e por isso
        não podem ser exibidos publicamente.
      </p>
      <div className="projects__stack">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.id} onOpenCaseStudy={setCaseStudyProject} />
        ))}
      </div>
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
