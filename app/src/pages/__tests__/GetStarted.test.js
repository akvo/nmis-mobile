import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { renderHook, act } from '@testing-library/react-native';
import GetStartedPage from '../GetStarted';

describe('GetStartedPage', () => {
  beforeAll(() => {
    const { result } = renderHook(() => useState({}));
    const [currentConfig, setCurrentConfig] = result.current;

    act(() => {
      setCurrentConfig({
        serverURL: 'http://127.0.0.1:8080',
      });
    });
  });

  test('renders correctly', () => {
    const tree = renderer.create(<GetStartedPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
