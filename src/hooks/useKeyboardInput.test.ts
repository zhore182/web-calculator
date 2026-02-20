import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardInput } from './useKeyboardInput';

describe('useKeyboardInput', () => {
  let onButtonClick: ReturnType<typeof vi.fn<(value: string) => void>>;

  beforeEach(() => {
    onButtonClick = vi.fn<(value: string) => void>();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function dispatchKey(options: KeyboardEventInit) {
    window.dispatchEvent(new KeyboardEvent('keydown', { ...options, bubbles: true }));
  }

  describe('key mapping', () => {
    it('maps digit keys 0-9 to button values', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      for (let d = 0; d <= 9; d++) {
        const digit = String(d);
        dispatchKey({ key: digit });
        expect(onButtonClick).toHaveBeenCalledWith(digit);
      }

      expect(onButtonClick).toHaveBeenCalledTimes(10);
    });

    it('maps operator keys to button values', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      const operators = ['+', '-', '*', '/'];
      operators.forEach((op) => {
        dispatchKey({ key: op });
        expect(onButtonClick).toHaveBeenCalledWith(op);
      });

      expect(onButtonClick).toHaveBeenCalledTimes(4);
    });

    it('maps Enter key', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'Enter' });
      expect(onButtonClick).toHaveBeenCalledWith('Enter');
      expect(onButtonClick).toHaveBeenCalledTimes(1);
    });

    it('maps Escape to clear', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'Escape' });
      expect(onButtonClick).toHaveBeenCalledWith('C');
      expect(onButtonClick).toHaveBeenCalledTimes(1);
    });

    it('maps period to decimal', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: '.' });
      expect(onButtonClick).toHaveBeenCalledWith('.');
      expect(onButtonClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('guards', () => {
    it('ignores repeated key events', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: '5', repeat: true });
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('ignores events with Ctrl modifier', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'c', ctrlKey: true });
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('ignores events with Alt modifier', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'a', altKey: true });
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('ignores events with Meta modifier', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'm', metaKey: true });
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('passes lowercase letter keys for function typing', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'a' });
      expect(onButtonClick).toHaveBeenCalledWith('a');
      expect(onButtonClick).toHaveBeenCalledTimes(1);
    });

    it('ignores unmapped keys', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      dispatchKey({ key: 'A' }); // Uppercase letters not mapped
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('ignores events when target is INPUT', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      const event = new KeyboardEvent('keydown', { key: '5', bubbles: true });
      Object.defineProperty(event, 'target', {
        value: { tagName: 'INPUT' },
        writable: false,
      });
      window.dispatchEvent(event);

      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it('ignores events when target is TEXTAREA', () => {
      renderHook(() => useKeyboardInput(onButtonClick));

      const event = new KeyboardEvent('keydown', { key: '5', bubbles: true });
      Object.defineProperty(event, 'target', {
        value: { tagName: 'TEXTAREA' },
        writable: false,
      });
      window.dispatchEvent(event);

      expect(onButtonClick).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useKeyboardInput(onButtonClick));

      unmount();

      dispatchKey({ key: '5' });
      expect(onButtonClick).not.toHaveBeenCalled();
    });
  });
});
