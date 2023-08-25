import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthState, UIState } from '../../store';
import { BackHandler } from 'react-native';
import Navigation, {
  setNotificationHandler,
  defineSyncFormVersionTask,
  defineSyncFormSubmissionTask,
} from '../index';
import { backgroundTask, notification } from '../../lib';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

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
jest.mock('expo-task-manager');
jest.mock('../../lib/background-task');
jest.mock('../../lib/notification');

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

  it('should call set notification handler func', async () => {
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

  it('should call define sync form version task func', async () => {
    TaskManager.defineTask.mockImplementation((taskName, taskFn) => {
      return taskFn();
    });

    await defineSyncFormVersionTask();

    expect(TaskManager.defineTask).toHaveBeenCalledWith('sync-form-version', expect.any(Function));
    expect(backgroundTask.syncFormVersion).toHaveBeenCalledWith({
      sendPushNotification: notification.sendPushNotification,
      showNotificationOnly: true,
    });
  });

  it('should handle catch error when call define sync form version task func', async () => {
    TaskManager.defineTask.mockImplementation(async (taskName, taskFn) => {
      backgroundTask.syncFormVersion.mockRejectedValue(new Error('Simulated error'));

      const result = await taskFn();

      expect(TaskManager.defineTask).toHaveBeenCalledWith(
        'sync-form-version',
        expect.any(Function),
      );
      expect(result).toBe(BackgroundFetch.Result.Failed);
    });

    await defineSyncFormVersionTask();
  });

  it('should call define sync form submission task func', async () => {
    TaskManager.defineTask.mockImplementation((taskName, taskFn) => {
      return taskFn();
    });

    await defineSyncFormSubmissionTask();

    expect(TaskManager.defineTask).toHaveBeenCalledWith(
      'sync-form-submission',
      expect.any(Function),
    );
    expect(backgroundTask.syncFormSubmission).toHaveBeenCalledTimes(1);
  });

  it('should handle catch error when call define sync form submission task func', async () => {
    TaskManager.defineTask.mockImplementation(async (taskName, taskFn) => {
      backgroundTask.syncFormSubmission.mockRejectedValue(new Error('Simulated error'));

      const result = await taskFn();

      expect(TaskManager.defineTask).toHaveBeenCalledWith(
        'sync-form-submission',
        expect.any(Function),
      );
      expect(result).toBe(BackgroundFetch.Result.Failed);
    });

    await defineSyncFormSubmissionTask();
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
