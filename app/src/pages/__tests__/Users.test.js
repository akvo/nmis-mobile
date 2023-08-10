import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { render, renderHook, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import Users from '../Users';
import { UserState } from '../../store';
import { conn, query } from '../../database';

jest.mock('expo-sqlite');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

db = conn.init;

describe('UsersPage', () => {
  it('should match with snapshot', async () => {
    jest.useFakeTimers();
    const mockNavigation = useNavigation();
    const usersData = [
      {
        id: 1,
        name: 'John',
        active: 1,
      },
    ];
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: usersData.length, _array: usersData } });
    });

    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const { toJSON } = render(<Users navigation={mockNavigation} />);
    const { result } = renderHook(() => useState([]));
    const { result: resLoading } = renderHook(() => useState(true));
    const [users, setUsers] = result.current;
    const [loading, setLoading] = resLoading.current;

    await act(async () => {
      const selectQuery = query.read('users');
      const rows = await conn.tx(db, selectQuery);
      setUsers(rows._array);
      setLoading(false);
    });

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should show empty page when users table has no data', () => {
    const mockNavigation = useNavigation();
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: 0, _array: [] } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    const { queryByTestId } = render(<Users navigation={mockNavigation} />);

    const userItemEl = queryByTestId('list-item-user-1');
    expect(userItemEl).toBeNull();
  });
});
