import React from 'react';
import { render } from 'react-native-testing-library';
import App from '../App';

describe('App', () => {
  test('renders App component without crashing', () => {
    render(<App />);
  });
});
