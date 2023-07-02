import React from 'react';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
import FormPage from '../FormPage';

describe('FormPage component', () => {
  test('should render component correctly', () => {
    const tree = renderer.create(<FormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
