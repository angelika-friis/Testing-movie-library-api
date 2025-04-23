import React from 'react';
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Counter from '../components/Counter';

afterEach(cleanup);

describe('Counter', () => {
    it('visar 0 från början', () => {
      render(<Counter />);
      expect(screen.getByTestId('count-value')).toHaveTextContent('0');
    });
  
    it('ökar till 1 efter ett klick', () => {
      render(<Counter />);
      const buttons = screen.getAllByRole('button', { name: /öka/i });
      fireEvent.click(buttons[0]); // välj första knappen
      expect(screen.getByTestId('count-value')).toHaveTextContent('1');
    });
  });
  