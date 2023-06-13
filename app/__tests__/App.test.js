import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import App from '../App';


describe('App', () => {
  test('updates text value correctly', () => {
    const { getByTestId } = render(<App />);
    const input = getByTestId('inputText');
    fireEvent.changeText(input, 'New Value');
    expect(input.props.value).toBe('New Value');
  });

  test('updates number value correctly', () => {
    const { getByTestId } = render(<App />);
    const input = getByTestId('inputNumber');
    fireEvent.changeText(input, '123');
    expect(input.props.value).toBe('123');
  });

  test('keyboard type for number input', () => {
    const { getByTestId } = render(<App />);
    const input = getByTestId('inputNumber');

    expect(input.props.keyboardType).toBe('numeric');
  });
});