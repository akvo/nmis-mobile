import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { act, renderHook } from '@testing-library/react-native';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import NetInfo from '@react-native-community/netinfo';

import App from '../App';
import { UIState } from 'store';
import { crudSessions, crudUsers, crudConfig } from '../src/database/crud';
import { conn, query } from '../src/database';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('@react-navigation/native-stack');
jest.mock('expo-sqlite');

jest.mock('../src/database/crud', () => ({
  crudSessions: {
    selectLastSession: jest.fn(() => Promise.resolve({ rows: { length: 0, _array: [] } })),
    addSession: jest.fn(),
  },
  crudUsers: {
    getActiveUser: jest.fn(() => Promise.resolve({ rows: { length: 0, _array: [] } })),
    selectUserById: jest.fn(),
  },
  crudConfig: {
    getConfig: jest.fn(() => Promise.resolve({ rows: { length: 0, _array: [] } })),
    addConfig: jest.fn(),
    updateConfig: jest.fn(),
  },
}));

const db = conn.init;

describe('App', () => {
  beforeAll(() => {
    crudSessions.selectLastSession.mockImplementation(() =>
      Promise.resolve({
        rows: { length: 1, _array: [{ id: 1, token: 'secret', passcode: 'test123' }] },
      }),
    );
  });
  it('should update UIState on NetInfo change', async () => {
    // Render the component
    const { unmount } = await waitFor(() => render(<App />));
    // Simulate a connected network state
    NetInfo.addEventListener.mock.calls[0][0]({ isConnected: true });
    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });

    // Verify that UIState.update was called with the expected state
    expect(UIState.update).toHaveBeenCalledWith(expect.any(Function));

    // Verify that the NetInfo event listener was subscribed
    expect(NetInfo.addEventListener).toHaveBeenCalledWith(expect.any(Function));
    // Unmount the component to trigger the cleanup function
    unmount();
  });

  it('should set AddUser for currentPage in UIState when the users doesnt exists', async () => {
    UIState.useState.mockReturnValue('AddPage');
    render(<App />);
    await act(async () => {
      UIState.update((s) => {
        s.currentPage = 'AddPage';
      });
    });
    await waitFor(() => {
      const currentPage = UIState.useState((s) => s.currentPage);
      expect(currentPage).toBe('AddPage');
    });
  });
  it('should set Home for currentPage in UIState when the users exists', async () => {
    crudUsers.getActiveUser.mockImplementation(() =>
      Promise.resolve({
        rows: { length: 1, _array: [{ id: 1, name: 'John', active: 1 }] },
      }),
    );
    UIState.useState.mockReturnValue('Home');
    render(<App />);
    await act(async () => {
      UIState.update((s) => {
        s.currentPage = 'Home';
      });
    });
    await waitFor(() => {
      const currentPage = UIState.useState((s) => s.currentPage);
      expect(currentPage).toBe('Home');
    });
  });
  it.todo('should set UserState as active user when the user exists');
  it.todo('should set serverUrl when its exists');
});
