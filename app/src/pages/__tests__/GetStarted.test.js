import React from 'react';
import renderer from 'react-test-renderer';
import { act } from '@testing-library/react-native';
import GetStartedPage from '../GetStarted';
import { BuildParamsState } from '../../store';

describe('GetStartedPage', () => {
  test('renders correctly', () => {
    act(() => {
      BuildParamsState.update((s) => {
        s.serverURL = null;
      });
    });

    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
