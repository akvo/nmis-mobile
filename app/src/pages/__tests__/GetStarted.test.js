import React from 'react';
import renderer from 'react-test-renderer';
import { act } from '@testing-library/react-native';
import GetStartedPage from '../GetStarted';
import { BuildParamsState } from '../../store';

describe('GetStartedPage', () => {
  test('renders correctly with IP Address input', () => {
    act(() => {
      BuildParamsState.update((s) => {
        s.serverURL = null;
      });
    });

    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly without IP Address input', () => {
    act(() => {
      BuildParamsState.update((s) => {
        s.serverURL = 'https://www.example.com/api';
      });
    });

    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
