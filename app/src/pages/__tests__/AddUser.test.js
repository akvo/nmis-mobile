import React from 'react';
import renderer from 'react-test-renderer';
import { render, renderHook, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import * as Crypto from 'expo-crypto';

import AddUser from '../AddUser';
import { UserState } from '../../store';
import { conn, query } from '../../database';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('expo-sqlite');

jest.mock('expo-crypto');

db = conn.init;

describe('AddUserPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AddUser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('only username is required', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const { getByText, getByTestId } = render(<AddUser navigation={navigation} />);
    const saveButton = getByTestId('button-save');
    expect(saveButton).toBeDefined();
    fireEvent.press(saveButton);

    await waitFor(() => {
      const errorText = getByText('Username is required');
      expect(errorText).toBeDefined();
    });
  });

  test('confirm password not matched', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const { getByText, getByTestId } = render(<AddUser navigation={navigation} />);

    const passwordEl = getByTestId('input-password');
    expect(passwordEl).toBeDefined();
    const confirmPassEl = getByTestId('input-confirm-password');
    expect(confirmPassEl).toBeDefined();

    const pass1 = 'secret';
    fireEvent.changeText(passwordEl, pass1);
    const pass2 = 'Hello';
    fireEvent.changeText(confirmPassEl, pass2);

    const saveButton = getByTestId('button-save');
    expect(saveButton).toBeDefined();
    fireEvent.press(saveButton);

    await waitFor(() => {
      const errorText = getByText('Passwords must match');
      expect(errorText).toBeDefined();
    });
  });

  test('create username correctly', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const { getByTestId } = render(<AddUser navigation={navigation} />);
    const { result: userStateRef } = renderHook(() => UserState.useState((s) => s));

    const usernameEl = getByTestId('input-name');
    expect(usernameEl).toBeDefined();

    const usernameVal = 'Jhon';
    fireEvent.changeText(usernameEl, usernameVal);

    const saveButton = getByTestId('button-save');
    expect(saveButton).toBeDefined();
    fireEvent.press(saveButton);

    act(() => {
      const insertQuery = query.insert('users', { id: 1, name: usernameVal });
      conn.tx(db, insertQuery);

      UserState.update((s) => {
        s.id = 1;
        s.name = usernameVal;
      });
    });

    await waitFor(() => {
      const { name: usernameState } = userStateRef.current;
      expect(usernameEl.props.value).toBe(usernameVal);
      expect(usernameState).toEqual(usernameVal);

      const dashboardButton = getByTestId('button-dashboard');
      expect(dashboardButton).toBeDefined();
    });

    const userData = [
      {
        id: 1,
        name: usernameVal,
      },
    ];
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: userData.length, _array: userData } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const selectQuery = query.read('users', { id: 1 });
    const resultSet = await conn.tx(db, selectQuery, [1]);
    expect(resultSet.rows).toHaveLength(userData.length);
    expect(resultSet.rows._array).toEqual(userData);
  });

  test('update password correctly', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const { getByTestId } = render(<AddUser navigation={navigation} />);
    const { result: userStateRef } = renderHook(() => UserState.useState((s) => s));

    const passwordEl = getByTestId('input-password');
    expect(passwordEl).toBeDefined();

    const passwordVal = 'secret';
    fireEvent.changeText(passwordEl, passwordVal);

    const saveButton = getByTestId('button-save');
    expect(saveButton).toBeDefined();
    fireEvent.press(saveButton);

    const passEncrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      passwordVal,
    );

    act(() => {
      UserState.update((s) => {
        s.password = passwordVal;
      });
      const updateQuery = query.update('users', { id: 1 }, { password: passEncrypted });
      conn.tx(db, updateQuery);
    });

    await waitFor(() => {
      const { password: passwordState } = userStateRef.current;
      expect(passwordEl.props.value).toBe(passwordVal);
      expect(passwordState).toEqual(passwordVal);
    });

    const userData = [
      {
        id: 1,
        name: 'Jhon',
        password: passEncrypted,
      },
    ];
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: userData.length, _array: userData } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const selectQuery = query.read('users', { id: 1 });
    const resultSet = await conn.tx(db, selectQuery, [1]);

    expect(resultSet.rows).toHaveLength(userData.length);

    const userDB = resultSet.rows._array[0];
    expect(userDB?.password).toEqual(passEncrypted);
  });
});
