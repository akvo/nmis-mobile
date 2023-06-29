import React from 'react';
import renderer from 'react-test-renderer';
import HomePage from '../Home';

describe('Homepage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<HomePage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
