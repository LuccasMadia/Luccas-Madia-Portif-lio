import { useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectCard } from './ProjectCard';

export function ProjectsGrid({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  if (projects.length === 0) {
    return <p className="projects-grid__empty">Nenhum projeto encontrado.</p>;
  }

  return (
    <>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard
            project={project}
            index={index}
            onOpenCaseStudy={setCaseStudyProject}
            layout="grid"
            key={project.id}
          />
        ))}
      </div>
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </>
  );
}
