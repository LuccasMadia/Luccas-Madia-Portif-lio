import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

const skills = [
  { name: 'React', icon: 'FaReact' },
  { name: 'Gestão de Projetos', icon: 'FaTasks' },
];

const about = { yearsExperience: 3, projectsDelivered: 12 };

describe('Skills', () => {
  it('renders a key button for every skill', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByRole('button', { name: /React/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gestão de Projetos/i })).toBeInTheDocument();
  });

  it('renders the stat label', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByText('projetos entregues')).toBeInTheDocument();
  });
});
