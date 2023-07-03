import React from 'react';
import renderer from 'react-test-renderer';
import AuthFormPage from '../AuthForm';

describe('AuthFormPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AuthFormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
