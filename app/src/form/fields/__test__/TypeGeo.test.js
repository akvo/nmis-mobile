import React, { useState } from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { renderHook, fireEvent, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import TypeGeo from '../TypeGeo';
import { UIState, FormState } from '../../../store';
import { loc } from '../../../lib';

jest.mock('expo-location');

jest.mock('@react-navigation/native');

describe('TypeGeo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });
  });
  test('render and get current location successfully', async () => {
    const { getByTestId, getByText, debug } = render(
      <TypeGeo onChange={() => jest.fn()} values={{}} id="geoField" name="Geolocation" />,
    );

    const buttonCurrLoc = getByTestId('button-curr-location');
    expect(buttonCurrLoc).toBeDefined();
    fireEvent.press(buttonCurrLoc);

    act(() => {
      loc.getCurrentLocation(({ coords }) => {
        FormState.update((s) => {
          s.currentValues = {
            ...s.currentValues,
            geoField: [coords.latitude, coords.longitude],
          };
        });
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState((s) => s.currentValues));
      const { geoField } = result.current;
      const [latitude, longitude] = geoField || {};

      const latText = getByTestId('text-lat');
      expect(latText.props.children).toEqual(['Latitude', ': ', latitude]);
      const lngText = getByTestId('text-lng');
      expect(lngText.props.children).toEqual(['Longitude', ': ', longitude]);
    });
  });

  it('should not show required sign if required param is false and requiredSign is not defined', async () => {
    const values = { geoField: [] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });
    const wrapper = render(
      <TypeGeo
        id="geoField"
        name="Geolocation"
        required={false}
        onChange={mockedOnChange}
        values={values}
      />,
    );
    await waitFor(() => {
      const requiredIcon = wrapper.queryByTestId('field-required-icon');
      expect(requiredIcon).toBeFalsy();
    });
  });

  it('should not show required sign if required param is false but requiredSign is defined', async () => {
    const values = { geoField: [] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const wrapper = render(
      <TypeGeo
        id="geoField"
        name="Geolocation"
        required={false}
        requiredSign="*"
        onChange={mockedOnChange}
        values={values}
      />,
    );
    await waitFor(() => {
      const requiredIcon = wrapper.queryByTestId('field-required-icon');
      expect(requiredIcon).toBeFalsy();
    });
  });

  it('should not show required sign if required param is true and requiredSign defined', async () => {
    const values = { geoField: [] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const wrapper = render(
      <TypeGeo
        id="geoField"
        name="Geolocation"
        required={true}
        requiredSign="*"
        onChange={mockedOnChange}
        values={values}
      />,
    );
    await waitFor(() => {
      const requiredIcon = wrapper.queryByTestId('field-required-icon');
      expect(requiredIcon).toBeTruthy();
    });
  });

  it('should show required sign with custom requiredSign', async () => {
    const values = { geoField: [] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const wrapper = render(
      <TypeGeo
        id="geoField"
        name="Geolocation"
        required={true}
        requiredSign="**"
        onChange={mockedOnChange}
        values={values}
      />,
    );
    await waitFor(() => {
      const requiredIcon = wrapper.getByText('**');
      expect(requiredIcon).toBeTruthy();
    });
  });

  it('should set empty object when getting current location failed', async () => {
    const values = { geoField: [11, 12] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const errorMessage = 'Permission to access location was denied';
    Location.requestForegroundPermissionsAsync.mockImplementation(() => {
      return Promise.resolve({ status: 'denied' });
    });
    Location.getCurrentPositionAsync.mockImplementation(() => {
      return Promise.resolve({ coords: {} });
    });

    Location.getCurrentPositionAsync.mockRejectedValue({ message: errorMessage });

    const { getByTestId, getByText } = render(
      <TypeGeo id="geoField" name="Geolocation" onChange={mockedOnChange} values={values} />,
    );
    const { result } = renderHook(() => useState());
    const [errorMsg, setErrorMsg] = result.current;

    const buttonCurLocationEl = getByTestId('button-curr-location');
    expect(buttonCurLocationEl).toBeDefined();
    fireEvent.press(buttonCurLocationEl);

    act(() => {
      mockedOnChange('geoField', []);
      setErrorMsg(errorMessage);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(errorMessage);
      const errorText = getByText(errorMessage);
      expect(errorText).toBeDefined();
    });
  });

  it('should not showing button open map when network is offline', async () => {
    const values = { geoField: [11, 12] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const { queryByTestId } = render(
      <TypeGeo id="geoField" name="Geolocation" onChange={mockedOnChange} values={values} />,
    );
    const { result } = renderHook(() => UIState.useState());

    act(() => {
      UIState.update((s) => {
        s.online = false;
      });
    });

    await waitFor(() => {
      const openButton = queryByTestId('button-open-map');
      expect(openButton).toBeNull();
      expect(result.current.online).toBe(false);
    });
  });

  it('should get current location by clicking the button', async () => {
    Location.requestForegroundPermissionsAsync.mockImplementation(() => {
      return Promise.resolve({ status: 'granted' });
    });
    Location.getCurrentPositionAsync.mockImplementation(() => {
      return Promise.resolve({
        coords: {
          latitude: 35677,
          longitude: -7811,
        },
      });
    });

    const values = { geoField: [] };
    const mockedOnChange = jest.fn((fieldName, value) => {
      values[fieldName] = value;
    });

    const { getByTestId } = render(
      <TypeGeo id="geoField" name="Geolocation" onChange={mockedOnChange} values={values} />,
    );

    const buttonCurLocationEl = getByTestId('button-curr-location');
    expect(buttonCurLocationEl).toBeDefined();
    fireEvent.press(buttonCurLocationEl);

    await waitFor(() => {
      expect(values.geoField).toEqual([35677, -7811]);
    });
  });

  it('should get current location and redirect to MapView when open map clicked', async () => {
    const mockNavigation = useNavigation();
    const { getByTestId, getByText, debug } = render(
      <TypeGeo
        onChange={() => jest.fn()}
        values={{}}
        id="geoField"
        name="Geolocation"
        navigation={mockNavigation}
      />,
    );

    const buttonCurrLoc = getByTestId('button-open-map');
    expect(buttonCurrLoc).toBeDefined();
    fireEvent.press(buttonCurrLoc);

    act(() => {
      loc.getCurrentLocation(({ coords }) => {
        FormState.update((s) => {
          s.currentValues = {
            ...s.currentValues,
            geoField: [coords.latitude, coords.longitude],
          };
        });
      });
    });
    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState((s) => s.currentValues));
      const { geoField } = result.current;
      const [latitude, longitude] = geoField || {};

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MapView', {
        id: 'geoField',
        latitude,
        longitude,
      });
    });
  });
});
