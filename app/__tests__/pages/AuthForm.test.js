import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthFormPage } from '../../src/pages';

describe('AuthFormPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AuthFormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('auth page field render correctly', () => {
    const { getByTestId } = render(<AuthFormPage />);
    const inputField = getByTestId('auth-password-field');
    const toggleEye = getByTestId('auth-toggle-eye-button');
    const checkbox = getByTestId('auth-checkbox-field');
    const loginBtn = getByTestId('auth-login-button');

    expect(inputField).toBeDefined();
    expect(toggleEye).toBeDefined();
    expect(checkbox).toBeDefined();
    expect(loginBtn).toBeDefined();
  });

  test('enables the login button when the form is filled correctly', () => {
    const { getByTestId } = render(<AuthFormPage />);
    const inputField = getByTestId('auth-password-field');
    const checkbox = getByTestId('auth-checkbox-field');
    const loginButton = getByTestId('auth-login-button');

    expect(loginButton.props.accessibilityState.disabled).toBe(true);
    fireEvent.changeText(inputField, '123456');
    fireEvent.press(checkbox);
    expect(loginButton.props.accessibilityState.disabled).toBe(false);
  });
});
