import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCarousel } from './ProjectCarousel';
import './CaseStudyModal.css';

export function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="case-study-modal__backdrop"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            onClick={(event) => event.stopPropagation()}
            className="case-study-modal"
          >
            <button type="button" onClick={onClose} aria-label="Fechar" className="case-study-modal__close">
              ×
            </button>

            <p className="section-label">Projeto</p>
            <h3 className="case-study-modal__title">{project.title}</h3>

            {project.caseStudy ? (
              <div className="case-study-modal__list">
                {project.caseStudy.map((area) => (
                  <div key={area.titulo} className="case-study-modal__item">
                    <img src={area.imagem} alt={area.titulo} loading="lazy" className="case-study-modal__image" />
                    <div className="case-study-modal__text">
                      <h4>{area.titulo}</h4>
                      <p>{area.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProjectCarousel images={project.images} alt={project.title} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
