import React from 'react';
import renderer from 'react-test-renderer';
import FormDataPage from '../FormData';

describe('FormDataPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<FormDataPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
