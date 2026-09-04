import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectsFilterBar } from './ProjectsFilterBar';

describe('ProjectsFilterBar', () => {
  it('renders the search input with the current value', () => {
    render(
      <ProjectsFilterBar
        search="popy"
        onSearchChange={() => {}}
        stacks={['Next.js', 'Python']}
        activeStacks={[]}
        onToggleStack={() => {}}
      />
    );

    expect(screen.getByRole('searchbox', { name: 'Buscar projetos' })).toHaveValue('popy');
  });

  it('calls onSearchChange when the user types', () => {
    const onSearchChange = vi.fn();
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={onSearchChange}
        stacks={['Next.js']}
        activeStacks={[]}
        onToggleStack={() => {}}
      />
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar projetos' }), { target: { value: 'rango' } });

    expect(onSearchChange).toHaveBeenCalledWith('rango');
  });

  it('renders a chip for every stack plus a "Todos" chip', () => {
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={() => {}}
        stacks={['Next.js', 'Python']}
        activeStacks={[]}
        onToggleStack={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next.js' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Python' })).toBeInTheDocument();
  });

  it('marks "Todos" as active when no stack filter is selected', () => {
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={() => {}}
        stacks={['Next.js']}
        activeStacks={[]}
        onToggleStack={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Todos' }).className).toContain('projects-filter-bar__chip--active');
  });

  it('marks the matching stack chip as active', () => {
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={() => {}}
        stacks={['Next.js', 'Python']}
        activeStacks={['Python']}
        onToggleStack={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Python' }).className).toContain('projects-filter-bar__chip--active');
    expect(screen.getByRole('button', { name: 'Next.js' }).className).not.toContain(
      'projects-filter-bar__chip--active'
    );
  });

  it('calls onToggleStack with the tech name when a chip is clicked', () => {
    const onToggleStack = vi.fn();
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={() => {}}
        stacks={['Next.js']}
        activeStacks={[]}
        onToggleStack={onToggleStack}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next.js' }));

    expect(onToggleStack).toHaveBeenCalledWith('Next.js');
  });

  it('calls onToggleStack with null when "Todos" is clicked', () => {
    const onToggleStack = vi.fn();
    render(
      <ProjectsFilterBar
        search=""
        onSearchChange={() => {}}
        stacks={['Next.js']}
        activeStacks={['Next.js']}
        onToggleStack={onToggleStack}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));

    expect(onToggleStack).toHaveBeenCalledWith(null);
  });
});
