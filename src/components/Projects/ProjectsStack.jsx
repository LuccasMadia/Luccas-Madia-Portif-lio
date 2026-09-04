import { useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectCard } from './ProjectCard';

export function ProjectsStack({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  return (
    <>
      <div className="projects__stack">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} onOpenCaseStudy={setCaseStudyProject} key={project.id} />
        ))}
      </div>
      <div className="projects__end-spacer" aria-hidden="true" />
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </>
  );
}
