import React from 'react';
import renderer from 'react-test-renderer';
import GetStartedPage from '../GetStarted';

describe('GetStartedPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
