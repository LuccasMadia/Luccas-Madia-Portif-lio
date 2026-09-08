import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProjectsFilterBar } from './ProjectsFilterBar';

const baseProps = {
  search: '',
  onSearchChange: () => {},
  categories: ['Landing page', 'Sistemas'],
  activeCategories: [],
  onToggleCategory: () => {},
  stacks: ['Next.js', 'Python'],
  activeStacks: [],
  onToggleStack: () => {},
};

function techGroup() {
  return screen.getByRole('group', { name: 'Filtrar por tecnologia' });
}

function categoryGroup() {
  return screen.getByRole('group', { name: 'Filtrar por categoria' });
}

describe('ProjectsFilterBar', () => {
  it('renders the search input with the current value', () => {
    render(<ProjectsFilterBar {...baseProps} search="popy" />);

    expect(screen.getByRole('searchbox', { name: 'Buscar projetos' })).toHaveValue('popy');
  });

  it('calls onSearchChange when the user types', () => {
    const onSearchChange = vi.fn();
    render(<ProjectsFilterBar {...baseProps} onSearchChange={onSearchChange} />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar projetos' }), { target: { value: 'rango' } });

    expect(onSearchChange).toHaveBeenCalledWith('rango');
  });

  it('renders a chip for every stack plus a "Todos" chip', () => {
    render(<ProjectsFilterBar {...baseProps} />);

    const group = techGroup();
    expect(within(group).getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: 'Next.js' })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: 'Python' })).toBeInTheDocument();
  });

  it('marks "Todos" as active when no stack filter is selected', () => {
    render(<ProjectsFilterBar {...baseProps} />);

    expect(within(techGroup()).getByRole('button', { name: 'Todos' }).className).toContain(
      'projects-filter-bar__chip--active'
    );
  });

  it('marks the matching stack chip as active', () => {
    render(<ProjectsFilterBar {...baseProps} activeStacks={['Python']} />);

    const group = techGroup();
    expect(within(group).getByRole('button', { name: 'Python' }).className).toContain(
      'projects-filter-bar__chip--active'
    );
    expect(within(group).getByRole('button', { name: 'Next.js' }).className).not.toContain(
      'projects-filter-bar__chip--active'
    );
  });

  it('calls onToggleStack with the tech name when a chip is clicked', () => {
    const onToggleStack = vi.fn();
    render(<ProjectsFilterBar {...baseProps} onToggleStack={onToggleStack} />);

    fireEvent.click(within(techGroup()).getByRole('button', { name: 'Next.js' }));

    expect(onToggleStack).toHaveBeenCalledWith('Next.js');
  });

  it('calls onToggleStack with null when "Todos" is clicked', () => {
    const onToggleStack = vi.fn();
    render(<ProjectsFilterBar {...baseProps} activeStacks={['Next.js']} onToggleStack={onToggleStack} />);

    fireEvent.click(within(techGroup()).getByRole('button', { name: 'Todos' }));

    expect(onToggleStack).toHaveBeenCalledWith(null);
  });

  it('renders a chip for every category plus a "Todos" chip', () => {
    render(<ProjectsFilterBar {...baseProps} />);

    const group = categoryGroup();
    expect(within(group).getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: 'Landing page' })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: 'Sistemas' })).toBeInTheDocument();
  });

  it('marks the matching category chip as active', () => {
    render(<ProjectsFilterBar {...baseProps} activeCategories={['Sistemas']} />);

    const group = categoryGroup();
    expect(within(group).getByRole('button', { name: 'Sistemas' }).className).toContain(
      'projects-filter-bar__chip--active'
    );
    expect(within(group).getByRole('button', { name: 'Landing page' }).className).not.toContain(
      'projects-filter-bar__chip--active'
    );
  });

  it('calls onToggleCategory with the category name when a chip is clicked', () => {
    const onToggleCategory = vi.fn();
    render(<ProjectsFilterBar {...baseProps} onToggleCategory={onToggleCategory} />);

    fireEvent.click(within(categoryGroup()).getByRole('button', { name: 'Sistemas' }));

    expect(onToggleCategory).toHaveBeenCalledWith('Sistemas');
  });

  it('calls onToggleCategory with null when "Todos" is clicked', () => {
    const onToggleCategory = vi.fn();
    render(
      <ProjectsFilterBar {...baseProps} activeCategories={['Sistemas']} onToggleCategory={onToggleCategory} />
    );

    fireEvent.click(within(categoryGroup()).getByRole('button', { name: 'Todos' }));

    expect(onToggleCategory).toHaveBeenCalledWith(null);
  });
});
