import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthState, UIState } from '../../store';
import { BackHandler } from 'react-native';
import Navigation, { setNotificationHandler } from '../index';
import { backgroundTask, notification } from '../../lib';
import * as Notifications from 'expo-notifications';

jest.mock('expo-background-fetch', () => ({
  ...jest.requireActual('expo-background-fetch'),
  Result: {
    Failed: 'failed',
  },
  BackgroundFetchResult: {
    NewData: 'new-data',
  },
}));

jest.mock('expo-notifications');

Notifications.addNotificationReceivedListener.mockImplementation(() => jest.fn());
Notifications.addNotificationResponseReceivedListener.mockImplementation(() => jest.fn());
Notifications.removeNotificationSubscription.mockImplementation(() => jest.fn());

jest.mock('../..//lib/background-task', () => ({
  syncFormVersion: jest.fn(),
  backgroundTaskStatus: jest.fn(),
}));

jest.mock('../../lib/notification', () => ({
  sendPushNotification: jest.fn(),
  registerForPushNotificationsAsync: jest.fn(),
}));

describe('Navigation Component', () => {
  const mockAddEventListener = jest.fn(() => {
    remove: jest.fn();
  });
  const mockRemoveEventListener = jest.fn(() => {
    remove: jest.fn();
  });

  BackHandler.addEventListener = mockAddEventListener;
  BackHandler.removeEventListener = mockRemoveEventListener;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call set notification handler', async () => {
    const mockHandleNotification = jest.fn().mockResolvedValue({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    });
    Notifications.setNotificationHandler.mockImplementation(({ handleNotification }) => {
      handleNotification(mockHandleNotification);
    });
    await setNotificationHandler();

    expect(Notifications.setNotificationHandler).toHaveBeenCalledTimes(1);
  });

  it('should call set up hardware back press function listener', () => {
    const { unmount } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>,
    );

    act(() => {
      UIState.update((s) => {
        s.currentPage = 'GetStarted';
      });
      AuthState.update((s) => {
        s.token = null;
      });
    });

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('should call set up notification function', () => {
    const { unmount } = render(
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>,
    );

    expect(backgroundTask.backgroundTaskStatus).toHaveBeenCalledTimes(2);
    expect(notification.registerForPushNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalledTimes(1);
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalledTimes(1);
    unmount();
  });
});
