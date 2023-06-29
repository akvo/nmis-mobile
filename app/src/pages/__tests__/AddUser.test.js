import React from 'react';
import renderer from 'react-test-renderer';
import AddUser from '../AddUser';

describe('AddUserPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AddUser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
