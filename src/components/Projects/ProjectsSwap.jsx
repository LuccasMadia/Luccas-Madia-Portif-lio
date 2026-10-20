import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import CardSwap from '../CardSwap/CardSwap';
import { CaseStudyModal } from './CaseStudyModal';
import './ProjectsSwap.css';

const coverOf = (project) => project.cover ?? project.images?.[0] ?? project.poster ?? project.caseStudy?.[0]?.imagem;
const hasGallery = (project) => Boolean(project.images?.length || project.caseStudy?.length);

// Pilha de cartões que troca sozinha (CardSwap); ao lado, os detalhes do projeto que está na frente.
export function ProjectsSwap({ projects }) {
  const [front, setFront] = useState(0);
  const [caseStudyProject, setCaseStudyProject] = useState(null);
  const project = projects[front];
  const touch = typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches;
  const items = projects.map((p) => ({ title: p.title, image: coverOf(p), alt: `Tela do projeto ${p.title}` }));

  function openProject(target) {
    if (hasGallery(target)) setCaseStudyProject(target);
    else if (target.liveUrl) window.open(target.liveUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="projects-swap">
      <div className="projects-swap__info" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <span className="project-card__number">{String(front + 1).padStart(2, '0')}</span>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="projects-swap__description">{project.description}</p>
            <ul className="project-card__stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-card__actions">
              {hasGallery(project) && (
                <button type="button" className="btn btn--primary" onClick={() => setCaseStudyProject(project)}>
                  Ver projeto
                </button>
              )}
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="projects-swap__visual">
        <div className="projects-swap__stack">
          <CardSwap
            items={items}
            label="Projetos"
            width={520}
            height={360}
            cardDistance={50}
            verticalDistance={55}
            delay={5000}
            skewAmount={4}
            onChange={setFront}
            onCardClick={(index, isFront) => {
              if (isFront) openProject(projects[index]);
            }}
          />
        </div>
        <p className="projects-swap__hint">
          Arraste o cartão da frente ou {touch ? 'toque' : 'clique'} num de trás para trocar.
        </p>
      </div>

      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </div>
  );
}
