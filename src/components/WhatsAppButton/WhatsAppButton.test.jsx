import { render, screen } from '@testing-library/react';
import { WhatsAppButton } from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('links to the given WhatsApp URL and opens in a new tab', () => {
    render(<WhatsAppButton href="https://wa.me/5567998746300" />);

    const link = screen.getByRole('link', { name: 'Conversar no WhatsApp' });
    expect(link).toHaveAttribute('href', 'https://wa.me/5567998746300');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
