import { render, screen, waitFor } from '@testing-library/react';
import { useTypingEffect } from './useTypingEffect';

function TestComponent({ text }) {
  const { displayedText } = useTypingEffect(text, 5);
  return <span data-testid="output">{displayedText}</span>;
}

describe('useTypingEffect', () => {
  it('starts with an empty string', () => {
    render(<TestComponent text="Oi" />);
    expect(screen.getByTestId('output').textContent).toBe('');
  });

  it('types out the full text over time', async () => {
    render(<TestComponent text="Oi" />);
    await waitFor(() => expect(screen.getByTestId('output').textContent).toBe('Oi'));
  });
});
