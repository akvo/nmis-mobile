import React, { useState } from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { renderHook, fireEvent, act } from '@testing-library/react-native';
import { route, MockNavigationProvider } from '@react-navigation/native';
import SettingsForm from '../Form';
import { config } from '../config';
import { BuildParamsState } from '../../../store';
import { conn, query } from '../../../database';

jest.mock('@react-navigation/native');
jest.mock('expo-sqlite');

db = conn.init;

describe('SettingsForm', () => {
  it('renders correctly', async () => {
    const params = { id: 2, name: 'User Interface' };
    route.params = params;
    const findConfig = config.find((c) => c?.id === params.id);

    const { unmount, getByText, getByTestId } = await waitFor(() =>
      render(
        <MockNavigationProvider>
          <SettingsForm route={route} />
        </MockNavigationProvider>,
      ),
    );

    const isDarkModeEl = getByTestId('settings-form-switch-1');
    expect(isDarkModeEl).toBeDefined();

    findConfig?.fields?.forEach((f) => {
      const labelEl = getByText(f.label);
      expect(labelEl).toBeDefined();
    });

    const langItem = getByTestId('settings-form-item-0');
    fireEvent.press(langItem);
    const dialogEl = getByTestId('settings-form-dialog');
    expect(dialogEl).toBeDefined();

    unmount();
  });

  test('Storing data to state and database', async () => {
    const params = { id: 1, name: 'Server' };
    route.params = params;
    const findConfig = config.find((c) => c?.id === params.id);

    const handleOKPressMock = jest.fn();
    const { unmount, getByText, getByTestId } = await waitFor(() =>
      render(
        <MockNavigationProvider>
          <SettingsForm route={route} />
        </MockNavigationProvider>,
      ),
    );

    const { result } = renderHook(() => useState(null));
    const { result: buildState } = renderHook(() => BuildParamsState.useState());
    const [edit, setEdit] = result.current;
    const { serverURL } = buildState.current;

    const serverUrlItem = getByTestId('settings-form-item-0');
    fireEvent.press(serverUrlItem);
    const serverConfig = {
      id: 11,
      type: 'text',
      label: 'Server URL',
      name: 'serverURL',
      description: null,
      key: 'BuildParamsState.serverURL',
    };
    act(() => {
      setEdit(serverConfig);
    });

    const dialogEl = getByTestId('settings-form-dialog');
    expect(dialogEl).toBeDefined();
    const inputEl = getByTestId('settings-form-input');
    expect(inputEl).toBeDefined();

    const serverURLValue = 'http://127.0.0.1:19000';
    fireEvent(inputEl, 'onChangeText', { value: serverURLValue });

    const okEl = getByTestId('settings-form-dialog-ok');
    expect(okEl).toBeDefined();
    //    fireEvent.press(okEl);

    // expect(serverURL).toEqual(serverURLValue);
    //expect(handleOKPressMock).toHaveBeenCalled();
    const id = 1;
    const updateQuery = query.update('config', { id }, { serverURL: serverURLValue });
    const updateResultSet = await conn.tx(db, updateQuery, [id]);
    expect(updateResultSet).toEqual({ rowsAffected: 1 });
    expect(db.transaction).toHaveBeenCalled();
    unmount();
  });
});
