import React from 'react';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
import { WebformPage } from '../../src/pages';

describe('WebformPage component', () => {
  test('should render component correctly', () => {
    const tree = renderer.create(<WebformPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
