import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { renderHook, fireEvent } from '@testing-library/react-native';
import { route, MockNavigationProvider } from '@react-navigation/native';
import SettingsForm from '../Form';
import { config } from '../config';
import { UIState } from '../../../store';

jest.mock('@react-navigation/native');

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
});
