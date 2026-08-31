import { useEffect, useRef, useState } from 'react';
import { CaseStudyModal } from './CaseStudyModal';
import { NotebookFrame } from './NotebookFrame';
import './Projects.css';

const STICKY_OFFSET = 90;
const REVEAL_BUFFER = 650;

function ProjectCard({ project, index, onOpenCaseStudy, hidden, setCardRef }) {
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const thumbnail = project.images?.[0] ?? project.caseStudy?.[0]?.imagem;

  const frame = <NotebookFrame src={thumbnail} alt={project.title} gradientIndex={index} />;

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
    <div
      className={`project-sticky${hidden ? ' project-sticky--hidden' : ''}`}
      style={{ zIndex: index + 1 }}
      ref={setCardRef}
    >
      {interactiveFrame}
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
