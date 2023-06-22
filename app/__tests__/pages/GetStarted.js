import React from 'react';
import renderer from 'react-test-renderer';
import { GetStartedPage } from '../../src/pages';

describe('GetStartedPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
