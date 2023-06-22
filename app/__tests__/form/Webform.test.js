import React from 'react';
import renderer from 'react-test-renderer';
import { Webform } from '../../src/form';

describe('Webform component', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Webform />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
