import { useEffect, useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { CaseStudyModal } from './CaseStudyModal';
import './Projects.css';

const STICKY_OFFSET = 90;
const REVEAL_BUFFER = 650;

function ProjectCard({ project, index, onOpenCaseStudy, hidden, setCardRef }) {
  const number = String(index + 1).padStart(2, '0');
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const thumbnail = project.images?.[0] ?? project.caseStudy?.[0]?.imagem;

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
              <h3>
                {project.title}
                {project.status && <span className="project-card__status">{project.status}</span>}
              </h3>
            </div>
          </div>
          <div className="project-card__actions">
            {hasGallery && (
              <button type="button" className="btn btn--outline" onClick={() => onOpenCaseStudy(project)}>
                Ver projeto
              </button>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Visitar site
              </a>
            )}
          </div>
        </div>
        {thumbnail ? (
          <img src={thumbnail} alt={project.title} loading="lazy" className="project-card__thumbnail" />
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
          {project.codeUrl ? (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver código no GitHub"
              className="project-card__code-link"
            >
              <FaGithub aria-hidden="true" />
            </a>
          ) : (
            <span aria-label="Código em breve" className="project-card__code-link project-card__code-link--pending">
              <FaGithub aria-hidden="true" />
            </span>
          )}
        </div>
      </article>
    </div>
  );
}

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);
  const stackRef = useRef(null);

  useEffect(() => {
    function updateActiveIndex() {
      const stack = stackRef.current;
      if (!stack) return;

      const stackDocTop = stack.getBoundingClientRect().top + window.scrollY;
      let cursor = stackDocTop;
      let active = 0;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        if (window.scrollY + STICKY_OFFSET >= cursor + REVEAL_BUFFER) {
          active = i;
        }
        cursor += el.offsetHeight;
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
      <p className="projects__note">
        Alguns projetos não estão listados aqui por serem sistemas internos de empresas (como controle de
        agendamento de exames, controle de férias, entre outros) que lidam com informações sensíveis e por isso
        não podem ser exibidos publicamente.
      </p>
      <div className="projects__stack" ref={stackRef}>
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
