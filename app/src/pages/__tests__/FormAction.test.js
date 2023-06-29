import React from 'react';
import renderer from 'react-test-renderer';
import FormActionPage from '../FormAction';

describe('FormActionPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<FormActionPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
