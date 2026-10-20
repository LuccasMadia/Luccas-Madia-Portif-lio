import { act, render } from '@testing-library/react';
import CardSwap from './CardSwap';

const items = [{ title: 'Um' }, { title: 'Dois' }, { title: 'Três' }];

describe('CardSwap', () => {
  let observers;
  const original = window.IntersectionObserver;

  beforeEach(() => {
    vi.useFakeTimers();
    observers = [];
    window.IntersectionObserver = class {
      constructor(callback, options) {
        observers.push({ callback, options });
      }
      observe() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    window.IntersectionObserver = original;
  });

  const showOnScreen = (ratio) =>
    act(() => {
      observers.forEach(({ callback }) => callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]));
    });

  it('only swaps by itself when the whole stack is on screen', () => {
    const onChange = vi.fn();
    render(<CardSwap items={items} delay={1000} intro={false} onChange={onChange} />);

    showOnScreen(0.6);
    act(() => vi.advanceTimersByTime(3000));
    expect(onChange).not.toHaveBeenCalled();

    showOnScreen(1);
    act(() => vi.advanceTimersByTime(1100));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
