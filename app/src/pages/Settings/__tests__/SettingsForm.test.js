import React, { useState } from 'react';
import { render } from 'react-native-testing-library';
import { renderHook, fireEvent, act } from '@testing-library/react-native';
import { route } from '@react-navigation/native';
import SettingsForm from '../SettingsForm';
import { config } from '../config';
import { BuildParamsState } from '../../../store';
import { conn, query } from '../../../database';

jest.mock('@react-navigation/native');
jest.mock('expo-sqlite');

db = conn.init;

describe('SettingsForm', () => {
  it('renders correctly', () => {
    const params = { id: 2, name: 'User Interface' };
    route.params = params;
    const findConfig = config.find((c) => c?.id === params.id);

    const { unmount, getByText, getByTestId } = render(<SettingsForm route={route} />);

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

    const { unmount, getByTestId } = render(<SettingsForm route={route} />);

    const { result } = renderHook(() => useState(null));
    const [edit, setEdit] = result.current;

    const authCodeItem = getByTestId('settings-form-item-2');
    fireEvent.press(authCodeItem);
    const authCodeConfig = {
      id: 31,
      type: 'number',
      name: 'syncInterval',
      label: 'Sync interval',
      description: 'Sync interval in minutes',
      key: 'UserState.syncInterval',
      editable: true,
    };
    act(() => {
      setEdit(authCodeConfig);
    });

    const dialogEl = getByTestId('settings-form-dialog');
    expect(dialogEl).toBeDefined();
    const inputEl = getByTestId('settings-form-input');
    expect(inputEl).toBeDefined();

    const authCodeValue = 500;
    fireEvent(inputEl, 'onChangeText', { value: authCodeValue });

    const okEl = getByTestId('settings-form-dialog-ok');
    expect(okEl).toBeDefined();

    const id = 1;
    const updateQuery = query.update('config', { id }, { authenticationCode: authCodeValue });
    const updateResultSet = await conn.tx(db, updateQuery, [id]);
    expect(updateResultSet).toEqual({ rowsAffected: 1 });
    expect(db.transaction).toHaveBeenCalled();
    unmount();
  });
});
