import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { route, MockNavigationProvider } from '@react-navigation/native';
import SettingsForm from '../Form';

jest.mock('@react-navigation/native');

describe('SettingsForm', () => {
  it('renders correctly', async () => {
    route.params = { id: 1, name: 'User Interface' };
    const { unmount } = await waitFor(() =>
      render(
        <MockNavigationProvider>
          <SettingsForm />
        </MockNavigationProvider>,
      ),
    );

    unmount();
  });
});
