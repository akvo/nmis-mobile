import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthState, UIState, UserState } from '../../store';
import mockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler.js';

import Navigation from '../index';
import { backgroundTask, notification } from '../../lib';
import * as Notifications from 'expo-notifications';
import { crudForms } from '../../database/crud';

jest.mock('expo-background-fetch', () => ({
  ...jest.requireActual('expo-background-fetch'),
  Result: {
    Failed: 'failed',
  },
  BackgroundFetchResult: {
    NewData: 'new-data',
  },
}));

jest.mock('expo-notifications', () => ({
  ...jest.requireActual('expo-notifications'),
  addNotificationReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  removeNotificationSubscription: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'denied' })),
}));

jest.mock('@react-navigation/native-stack');

jest.mock('../../lib/background-task', () => ({
  syncFormVersion: jest.fn(() => Promise.resolve([])),
  backgroundTaskStatus: jest.fn(),
}));

jest.mock('../../lib/notification', () => ({
  sendPushNotification: jest.fn(),
  registerForPushNotificationsAsync: jest.fn(),
}));

jest.mock('../../database/crud', () => ({
  crudForms: {
    selectLatestFormVersion: jest.fn(() => Promise.resolve([])),
    selectFormById: jest.fn(() => Promise.resolve([])),
    selectFormByIdAndVersion: jest.fn(() => Promise.resolve([])),
    addForm: jest.fn(() => Promise.resolve({ insertId: null })),
    updateForm: jest.fn(() => Promise.resolve({ rowsAffected: 1 })),
  },
}));
jest.mock('react-native/Libraries/Utilities/BackHandler', () => mockBackHandler);

describe('Navigation Component', () => {
  beforeAll(() => {
    UserState.update((s) => {
      s.id = null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call set up hardware back press function listener', () => {
    const { unmount } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>,
    );
    const mockAddEventListener = jest.fn();
    act(() => {
      mockAddEventListener();
      UIState.update((s) => {
        s.currentPage = 'GetStarted';
      });
      AuthState.update((s) => {
        s.token = null;
      });
    });

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('should call set up notification function', async () => {
    render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(backgroundTask.backgroundTaskStatus).toHaveBeenCalledTimes(2);
      expect(notification.registerForPushNotificationsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.addNotificationReceivedListener).toHaveBeenCalledTimes(1);
      expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
    });
  });

  it('should be able to sync form version', async () => {
    render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>,
    );
    Notifications.getPermissionsAsync.mockImplementation(() =>
      Promise.resolve({ status: 'granted' }),
    );

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Form version available',
        body: 'Here is the notification body',
        data: null,
      },
      trigger: null,
    });

    await act(async () => {
      await backgroundTask.syncFormVersion();
    });

    await waitFor(() => {
      expect(backgroundTask.syncFormVersion).toHaveBeenCalledTimes(1);
    });
  });
});
