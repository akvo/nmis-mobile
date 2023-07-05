import React from 'react';
import { render, renderHook, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import LogoutButton from '../LogoutButton';
import { AuthState } from '../../store';
import { conn, query } from '../../database';

jest.mock('@react-navigation/native');
jest.mock('expo-sqlite');

const db = conn.init;

describe('LogoutButton', () => {
  test('render correctly', () => {
    const { getByText, getByTestId } = render(<LogoutButton />);

    const logoutItem = getByTestId('list-item-logout');
    expect(logoutItem).toBeDefined();

    const logoutText = getByText('Log Out');
    expect(logoutText).toBeDefined();
  });

  test('state and session still exist when aborted logout', async () => {
    const mockToken = 'Bearer mockToken';
    const mockPasscode = 'secret123';
    act(() => {
      AuthState.update((s) => {
        s.token = mockToken;
      });
    });

    const sessionData = [
      {
        token: mockToken,
        passcode: mockPasscode,
      },
    ];
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: sessionData.length, _array: sessionData } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const { getByText, getByTestId } = render(<LogoutButton />);
    const logoutEl = getByTestId('list-item-logout');
    fireEvent.press(logoutEl);

    const dialogEl = getByTestId('dialog-confirm-logout');
    expect(dialogEl).toBeDefined();
    const cancelEl = getByTestId('dialog-button-no');
    expect(cancelEl).toBeDefined();
    fireEvent.press(cancelEl);

    await waitFor(async () => {
      const { result } = renderHook(() => AuthState.useState());
      const { token } = result.current;
      const table = 'sessions';
      const selectQuery = query.read(table);
      const sessionRes = await conn.tx(db, selectQuery);
      expect(token).toEqual(mockToken);
      expect(sessionRes.rows).toHaveLength(sessionData.length);
      expect(sessionRes.rows._array).toEqual(sessionData);
    });
  });

  test('clear state and sessions on successfull logout', async () => {
    const mockToken = 'Bearer mockToken';
    const mockPasscode = 'secret123';
    act(() => {
      AuthState.update((s) => {
        s.token = mockToken;
      });
    });
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: 0, _array: [] } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const { getByText, getByTestId } = render(<LogoutButton />);
    const logoutEl = getByTestId('list-item-logout');
    fireEvent.press(logoutEl);

    const dialogEl = getByTestId('dialog-confirm-logout');
    expect(dialogEl).toBeDefined();
    const yesEl = getByTestId('dialog-button-yes');
    expect(yesEl).toBeDefined();
    fireEvent.press(yesEl);

    act(() => {
      AuthState.update((s) => {
        s.token = null;
      });
    });

    await waitFor(async () => {
      const { result } = renderHook(() => AuthState.useState());
      const { token } = result.current;
      const table = 'sessions';
      const selectQuery = query.read(table);
      const sessionRes = await conn.tx(db, selectQuery);

      expect(token).toEqual(null);
      expect(sessionRes.rows.length).toEqual(0);
      expect(sessionRes.rows._array).toEqual([]);

      const { result: navigationRef } = renderHook(() => useNavigation());
      const navigation = navigationRef.current;
      expect(navigation.navigate).toHaveBeenCalledWith('GetStarted');
    });
  });
});
