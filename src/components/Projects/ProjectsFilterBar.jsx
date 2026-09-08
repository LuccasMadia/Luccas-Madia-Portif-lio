import { FaSearch } from 'react-icons/fa';
import './ProjectsFilterBar.css';

function FilterGroup({ label, options, active, onToggle }) {
  return (
    <div className="projects-filter-bar__group">
      <span className="projects-filter-bar__group-label">{label}</span>
      <div className="projects-filter-bar__filters" role="group" aria-label={`Filtrar por ${label.toLowerCase()}`}>
        <button
          type="button"
          className={`projects-filter-bar__chip ${active.length === 0 ? 'projects-filter-bar__chip--active' : ''}`}
          onClick={() => onToggle(null)}
        >
          Todos
        </button>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`projects-filter-bar__chip ${
              active.includes(option) ? 'projects-filter-bar__chip--active' : ''
            }`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProjectsFilterBar({
  search,
  onSearchChange,
  categories,
  activeCategories,
  onToggleCategory,
  stacks,
  activeStacks,
  onToggleStack,
}) {
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
      <hr className="projects-filter-bar__divider" />
      <FilterGroup
        label="Categoria"
        options={categories}
        active={activeCategories}
        onToggle={onToggleCategory}
      />
      <hr className="projects-filter-bar__divider" />
      <FilterGroup label="Tecnologia" options={stacks} active={activeStacks} onToggle={onToggleStack} />
    </div>
  );
}
