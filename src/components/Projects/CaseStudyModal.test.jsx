import { fireEvent, render, screen } from '@testing-library/react';
import { CaseStudyModal } from './CaseStudyModal';

const project = {
  title: 'Canecas da Dri',
  caseStudy: [
    { titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' },
    { titulo: 'Dashboard', imagem: 'dashboard.png', descricao: 'Descrição do dashboard.' },
  ],
};

describe('CaseStudyModal', () => {
  it('renders nothing when there is no project', () => {
    render(<CaseStudyModal project={null} onClose={() => {}} />);
    expect(screen.queryByText('Canecas da Dri')).not.toBeInTheDocument();
  });

  it('renders the project title and every case study item', () => {
    render(<CaseStudyModal project={project} onClose={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Canecas da Dri' })).toBeInTheDocument();
    expect(screen.getByText('Tela inicial')).toBeInTheDocument();
    expect(screen.getByText('Descrição da tela inicial.')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<CaseStudyModal project={project} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<CaseStudyModal project={project} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
