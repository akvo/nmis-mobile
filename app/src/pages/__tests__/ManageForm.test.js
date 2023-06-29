import React from 'react';
import renderer from 'react-test-renderer';
import ManageFormPage from '../ManageForm';

describe('ManageFormPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<ManageFormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
