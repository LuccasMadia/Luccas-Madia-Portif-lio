import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';

const socials = {
  whatsapp: 'https://wa.me/5500000000000',
  linkedin: 'https://linkedin.com/in/test',
  github: 'https://github.com/test',
};

describe('Contact', () => {
  it('renders a link for each social channel with the correct href', () => {
    render(<Contact socials={socials} />);

    expect(screen.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute('href', socials.whatsapp);
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', socials.linkedin);
    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', socials.github);
  });
});
