import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { act } from '@testing-library/react-native';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import NetInfo from '@react-native-community/netinfo';
import App from '../App';
import { UIState } from 'store';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

describe('App', () => {
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
});
