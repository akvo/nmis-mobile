import React, { useState } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { act, render, renderHook, waitFor, fireEvent } from '@testing-library/react-native';

import MapView from '../MapView';
import { MapState } from '../../store';
import { loc } from '../../lib';

const loadHtml = require('map.html');
const htmlData = `${loadHtml}`;

jest.useFakeTimers();

jest.mock('@react-navigation/native');

jest.mock('expo-location');

jest.mock('expo-asset', () => {
  return {
    Asset: {
      loadAsync: jest.fn(() => Promise.resolve([{ localUri: 'mocked-uri' }])),
    },
  };
});

jest.mock('expo-file-system', () => {
  return {
    readAsStringAsync: jest.fn(() => Promise.resolve(htmlData)),
  };
});

describe('MapView', () => {
  it('should render html on webview correctly', async () => {
    const route = {
      params: {
        lat: 123,
        lng: -456,
      },
    };

    const { getByTestId } = render(<MapView route={route} />);
    const { result: resultState } = renderHook(() => useState());

    const [htmlContent, setHtmlContent] = resultState.current;

    await act(async () => {
      const [{ localUri }] = await Asset.loadAsync(require('../../assets/map.html'));
      let fileContents = await FileSystem.readAsStringAsync(localUri);
      const { latitude: lat, longitude: lng } = route?.params;
      setHtmlContent(fileContents);
    });

    await waitFor(() => {
      const webEl = getByTestId('webview-map');
      expect(webEl).toBeDefined();
      const htmlFromWebView = webEl.props.source.html;
      expect(htmlFromWebView).toBe(htmlData);
    });
  });

  it('should use current location when the button clicked', async () => {
    const route = {
      params: {
        lat: 37.12345,
        lng: -122.6789,
      },
    };

    const { getByTestId } = render(<MapView route={route} />);
    const { result: resMapState } = renderHook(() => MapState.useState());
    const { result: resLoadingState } = renderHook(() => useState(false));

    const [loading, setLoading] = resLoadingState.current;

    const buttonEl = getByTestId('button-get-current-loc');
    expect(buttonEl).toBeDefined();
    fireEvent.press(buttonEl);

    act(() => {
      setLoading(true);
      loc.getCurrentLocation((res) => {
        MapState.update((s) => {
          s.latitude = res.coords.latitude;
          s.longitude = res.coords.longitude;
        });
        setLoading(false);
      });
    });

    await waitFor(() => {
      const { latitude, longitude } = resMapState.current;
      expect(latitude).toBe(route.params.lat);
      expect(longitude).toBe(route.params.lng);

      expect(resLoadingState.current[0]).toBeFalsy();
    });
  });

  it('should back to the previous screen when back hardware pressed', async () => {
    const route = {
      params: {
        lat: 37.12345,
        lng: -122.6789,
      },
    };
    const { result } = renderHook(() => useNavigation());
    const navigation = result.current;
    navigation.canGoBack.mockReturnValue(true);
    expect(navigation.canGoBack()).toEqual(true);

    render(<MapView route={route} navigation={navigation} />);
  });
});
