import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders every top-level section by id', () => {
    const { container } = render(<App />);

    ['sobre', 'servicos', 'experiencias', 'projetos', 'habilidades', 'contato'].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });
});
