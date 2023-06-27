import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsPage } from '../../src/pages';

describe('SettingsPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<SettingsPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
