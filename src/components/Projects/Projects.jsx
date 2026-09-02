import { useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectImageCard } from './ProjectImageCard';
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
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const gallery = project.images?.length ? project.images : project.caseStudy?.map((area) => area.imagem) ?? [];
  const visual = (
    <ProjectImageCard video={project.video} images={gallery} alt={project.title} gradientIndex={index} />
  );

  let interactiveVisual = visual;
  if (hasGallery) {
    interactiveVisual = (
      <button
        type="button"
        className="project-image-trigger"
        aria-label={`Ver projeto ${project.title}`}
        onClick={() => onOpenCaseStudy(project)}
      >
        {visual}
      </button>
    );
  } else if (project.liveUrl) {
    interactiveVisual = (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="project-image-trigger"
        aria-label={`Visitar site de ${project.title}`}
      >
        {visual}
      </a>
    );
  }

  return (
    <div className="project-sticky" style={{ top: `${90 + index * 16}px`, zIndex: index + 1 }} ref={ref}>
      <motion.article className="project-card" style={{ scale, opacity }}>
        <div className="project-card__info">
          <span className="project-card__number">{number}</span>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__description">{project.description}</p>
          <ul className="project-card__stack">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="project-card__actions">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Visitar site
              </a>
            )}
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
        </div>
        <div className="project-card__visual">{interactiveVisual}</div>
      </motion.article>
    </div>
  );
}

const PREVIEW_LIMIT = 3;

export function Projects({ projects }) {
  const [caseStudyProject, setCaseStudyProject] = useState(null);
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
      <div className="projects__stack">
        {previewProjects.map((project, index) => (
          <ProjectCard project={project} index={index} onOpenCaseStudy={setCaseStudyProject} key={project.id} />
        ))}
      </div>
      <div className="projects__end-spacer" aria-hidden="true" />
      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
