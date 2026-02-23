import { useEffect } from 'react';

export function useKeyboardInput(onButtonClick: (value: string) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Guard 1: Prevent auto-repeat flooding when key is held down
      if (e.repeat) return;

      // Guard 2: Avoid capturing when user is typing in form fields
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Handle copy/paste before blocking other modifier keys
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        onButtonClick('copy');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        onButtonClick('paste');
        return;
      }

      // Block other modifier combos (Alt+Tab, Ctrl+Z, etc.)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Pass letter keys for function name typing (expression mode handles routing)
      if (/^[a-z]$/.test(e.key)) {
        e.preventDefault();
        onButtonClick(e.key);
        return;
      }

      // Define key mapping
      const keyMap: Record<string, string> = {
        // Digits
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        // Operators
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        // Special
        'Enter': 'Enter',  // Changed from '=' to allow autocomplete to intercept
        'Escape': 'C',     // Clear All
        'Delete': 'CE',    // Clear Entry
        // Decimal
        '.': '.',
        // Arrow keys for cursor movement (expression mode) and autocomplete navigation
        'ArrowLeft': 'ArrowLeft',
        'ArrowRight': 'ArrowRight',
        'ArrowUp': 'ArrowUp',
        'ArrowDown': 'ArrowDown',
        // Backspace for deletion
        'Backspace': 'Backspace',
        // Parentheses
        '(': '(',
        ')': ')',
        // Scientific operators
        '^': '^',    // Shift+6 for exponentiation
        '!': '!',    // Shift+1 for factorial
        '%': '%',    // Shift+5 for percentage
      };

      // Look up key in map and call handler if found
      const mapped = keyMap[e.key];
      if (mapped !== undefined) {
        e.preventDefault();
        onButtonClick(mapped);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onButtonClick]);
}
