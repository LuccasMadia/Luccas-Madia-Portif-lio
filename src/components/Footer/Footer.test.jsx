import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the current year and the given name', () => {
    render(<Footer name="Luccas Madia" />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}.*Luccas Madia`))).toBeInTheDocument();
  });
});
