import { useEffect, useRef, useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectCarousel } from './ProjectCarousel';
import './Projects.css';

const STICKY_OFFSET = 90;

function ProjectCard({ project, index, onOpenCaseStudy, hidden, setCardRef }) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <div
      className={`project-sticky${hidden ? ' project-sticky--hidden' : ''}`}
      style={{ zIndex: index + 1 }}
      ref={setCardRef}
    >
      <article className="project-card">
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
      </article>
    </div>
  );
}

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    function updateActiveIndex() {
      let active = 0;
      cardRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= STICKY_OFFSET + 1) {
          active = i;
        }
      });
      setActiveIndex(active);
    }

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    return () => {
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, [projects]);

  return (
    <section id="projetos" className="projects">
      <p className="section-label">Portfólio</p>
      <h2 className="section-title">Projetos</h2>
      <div className="projects__stack">
        {projects.map((project, index) => (
          <ProjectCard
            project={project}
            index={index}
            key={project.id}
            onOpenCaseStudy={setCaseStudyProject}
            hidden={index < activeIndex}
            setCardRef={(el) => {
              cardRefs.current[index] = el;
            }}
          />
        ))}
      </div>
      <div className="projects__end-spacer" aria-hidden="true" />
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
