import { useEffect, useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProjectImageCard } from './ProjectImageCard';

export function ProjectCard({ project, index, onOpenCaseStudy, layout = 'sticky' }) {
  const ref = useRef(null);
  const descriptionRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || isExpanded) return undefined;

    const checkTruncation = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [project.description, isExpanded]);

  const number = String(index + 1).padStart(2, '0');
  const hasGallery = Boolean(project.images?.length || project.caseStudy?.length);
  const gallery = project.images?.length ? project.images : project.caseStudy?.map((area) => area.imagem) ?? [];
  const visual = (
    <ProjectImageCard
      video={project.video}
      poster={project.poster}
      images={gallery}
      alt={project.title}
      gradientIndex={index}
    />
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

  const info = (
    <div className="project-card__info">
      <span className="project-card__number">{number}</span>
      <h3 className="project-card__title">{project.title}</h3>
      <p
        ref={descriptionRef}
        className={`project-card__description${isExpanded ? ' project-card__description--expanded' : ''}`}
      >
        {project.description}
      </p>
      {isTruncated && (
        <button
          type="button"
          className="project-card__toggle"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
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
  );

  if (layout === 'grid') {
    return (
      <article className="project-card project-card--grid">
        <div className="project-card__visual">{interactiveVisual}</div>
        {info}
      </article>
    );
  }

  return (
    <div className="project-sticky" style={{ top: `${90 + index * 16}px`, zIndex: index + 1 }} ref={ref}>
      <motion.article className="project-card" style={{ scale, opacity }}>
        {info}
        <div className="project-card__visual">{interactiveVisual}</div>
      </motion.article>
    </div>
  );
}
