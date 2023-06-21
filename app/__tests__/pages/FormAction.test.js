import React from 'react';
import renderer from 'react-test-renderer';
import { FormActionPage } from '../../src/pages';

describe('FormActionPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<FormActionPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
