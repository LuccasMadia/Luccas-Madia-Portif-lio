import { render, screen } from '@testing-library/react';
import { AnimatedSection } from './AnimatedSection';

describe('AnimatedSection', () => {
  it('renders its children inside a section with the given id and class', () => {
    render(
      <AnimatedSection id="teste" className="test-class">
        <p>Conteúdo</p>
      </AnimatedSection>
    );

    const section = document.getElementById('teste');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('test-class');
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
