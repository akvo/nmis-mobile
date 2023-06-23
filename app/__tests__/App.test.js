import React from 'react';
import { render } from 'react-native-testing-library';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

import App from '../App';

describe('App', () => {
  test('renders App component without crashing', () => {
    render(<App />);
  });
});
