import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StartScreen } from '../src/pages';

describe('App', () => {
  it('should show Get started button', () => {
    render(<StartScreen />);
    const element = screen.getByText(/Get Started/);
    expect(element).toBeDefined();
  });
});
