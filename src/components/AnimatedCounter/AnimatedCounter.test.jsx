import { render, screen, waitFor } from '@testing-library/react';
import { AnimatedCounter } from './AnimatedCounter';

describe('AnimatedCounter', () => {
  it('starts at zero', () => {
    render(<AnimatedCounter target={12} duration={2000} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('counts up to the target value with the given suffix', async () => {
    render(<AnimatedCounter target={12} suffix="+" duration={50} />);
    await waitFor(() => expect(screen.getByText('12+')).toBeInTheDocument(), { timeout: 1000 });
  });
});
