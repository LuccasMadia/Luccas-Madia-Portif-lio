import { FaSearch } from 'react-icons/fa';
import './ProjectsFilterBar.css';

export function ProjectsFilterBar({ search, onSearchChange, stacks, activeStacks, onToggleStack }) {
  return (
    <div className="projects-filter-bar">
      <div className="projects-filter-bar__search">
        <FaSearch aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar projetos..."
          aria-label="Buscar projetos"
        />
      </div>
      <div className="projects-filter-bar__filters" role="group" aria-label="Filtrar por tecnologia">
        <button
          type="button"
          className={`projects-filter-bar__chip ${
            activeStacks.length === 0 ? 'projects-filter-bar__chip--active' : ''
          }`}
          onClick={() => onToggleStack(null)}
        >
          Todos
        </button>
        {stacks.map((tech) => (
          <button
            key={tech}
            type="button"
            className={`projects-filter-bar__chip ${
              activeStacks.includes(tech) ? 'projects-filter-bar__chip--active' : ''
            }`}
            onClick={() => onToggleStack(tech)}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}
