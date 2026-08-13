import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

const skills = [
  { category: 'Desenvolvimento', items: [{ name: 'React', icon: 'FaReact' }] },
  { category: 'Gestão', items: [{ name: 'Gestão de Projetos', icon: 'FaTasks' }] },
];

const about = { yearsExperience: 3, projectsDelivered: 12 };

describe('Skills', () => {
  it('renders every category and its badges', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByRole('heading', { name: 'Desenvolvimento' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gestão' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Projetos')).toBeInTheDocument();
  });

  it('renders the stat labels', () => {
    render(<Skills skills={skills} about={about} />);

    expect(screen.getByText('anos de experiência')).toBeInTheDocument();
    expect(screen.getByText('projetos entregues')).toBeInTheDocument();
  });
});
