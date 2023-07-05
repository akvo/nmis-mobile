import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { renderHook, fireEvent, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import TypeGeo from '../TypeGeo';
import { MapState } from '../../../store';
import { loc } from '../../../lib';

jest.mock('expo-location');

jest.mock('@react-navigation/native');

describe('TypeGeo', () => {
  test('render and get current location successfully', async () => {
    const { getByTestId, getByText } = render(
      <TypeGeo onChange={() => jest.fn()} values={{}} id="geoField" name="Geolocation" />,
    );

    const waitingText = getByText('Waiting..');
    expect(waitingText).toBeDefined();

    act(() => {
      loc.getCurrentLocation((res) => {
        MapState.update((s) => {
          s.latitude = res.coords.latitude;
          s.longitude = res.coords.longitude;
        });
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => MapState.useState());
      const { latitude, longitude } = result.current;

      const latText = getByTestId('text-lat');
      expect(latText.props.children).toEqual(['Latitude: ', `${latitude}`]);
      const lngText = getByTestId('text-lng');
      expect(lngText.props.children).toEqual(['Longitude: ', `${longitude}`]);
    });

    const { result: navigationReff } = renderHook(() => useNavigation());
    const navigation = navigationReff.current;

    const openMapButton = getByTestId('button-open-map');
    expect(openMapButton).toBeDefined();
    fireEvent.press(openMapButton);

    await waitFor(() => {
      const { result } = renderHook(() => MapState.useState());
      const { latitude, longitude } = result.current;

      expect(navigation.navigate).toHaveBeenCalledWith('MapView', { latitude, longitude });
    });
  });
});
