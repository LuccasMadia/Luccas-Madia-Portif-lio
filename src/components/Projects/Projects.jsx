import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProjectCarousel } from './ProjectCarousel';
import { CaseStudyModal } from './CaseStudyModal';
import './Projects.css';

function ProjectCard({ project, index, onOpenCaseStudy }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="project-sticky" style={{ top: `${90 + index * 20}px` }} ref={ref}>
      <motion.article className="project-card" style={{ scale, opacity }}>
        <div className="project-card__header">
          <div className="project-card__heading">
            <span className="project-card__number">{number}</span>
            <div>
              <p className="project-card__label">Projeto</p>
              <h3>{project.title}</h3>
            </div>
          </div>
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
              Ver projeto
            </a>
          ) : (
            project.caseStudy && (
              <button type="button" className="btn btn--outline" onClick={() => onOpenCaseStudy(project)}>
                Ver projeto
              </button>
            )
          )}
        </div>
        {project.images ? (
          <ProjectCarousel images={project.images} alt={project.title} />
        ) : (
          <div className={`project-card__visual project-card__visual--${index % 3}`} aria-hidden="true" />
        )}
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__footer">
          <ul className="project-card__stack">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            Código
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  return (
    <section id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <div className="projects__stack">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.id} onOpenCaseStudy={setCaseStudyProject} />
        ))}
      </div>
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
