import api from '../api';
import backgroundTask from '../background-task';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { crudForms, crudSessions } from '../../database/crud';
import { waitFor } from '@testing-library/react-native';

jest.mock('../api');
jest.mock('../../database/crud');
jest.mock('expo-background-fetch');
jest.mock('expo-task-manager');

describe('backgroundTask', () => {
  const mockTaskName = 'taskName';
  const mockTaskOption = {
    minimumInterval: 86400,
    startOnBoot: true,
    stopOnTerminate: true,
  };

  describe('syncFormVersion', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const mockSession = { passcode: '12345' };
    const mockForm = { id: 1, version: '1.0.0', url: '/forms/1' };
    const mockFormData = { formsUrl: [mockForm], syncToken: 'Bearer token', message: 'Success' };

    it('should handle syncFormVersion with showNotificationOnly=true', async () => {
      const mockFormExist = false;

      crudSessions.selectLastSession.mockImplementation(() => Promise.resolve(mockSession));
      api.post.mockImplementation(() => Promise.resolve({ data: mockFormData }));
      crudForms.selectFormByIdAndVersion.mockImplementation(() => Promise.resolve(mockFormExist));
      crudForms.updateForm.mockImplementation(() => Promise.resolve(false));
      crudForms.addForm.mockImplementation(() => Promise.resolve(false));

      const sendPushNotification = jest.fn();
      await backgroundTask.syncFormVersion({ showNotificationOnly: true, sendPushNotification });

      expect(crudSessions.selectLastSession).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith('/auth', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(crudForms.selectFormByIdAndVersion).toHaveBeenCalledWith(mockForm);
      expect(api.get).not.toHaveBeenCalled();
      expect(crudForms.updateForm).not.toHaveBeenCalled();
      expect(crudForms.addForm).not.toHaveBeenCalled();
      await waitFor(() => expect(sendPushNotification).toHaveBeenCalled());
    });

    it('should handle syncFormVersion with showNotificationOnly=false', async () => {
      const mockFormExist = false;
      const mockFormRes = { data: { formJSON: 'form data' } };
      const mockUpdatedForm = { rowsAffected: 1 };
      const mockSavedForm = { rowsAffected: 1 };

      crudSessions.selectLastSession.mockImplementation(() => Promise.resolve(mockSession));
      api.post.mockImplementation(() => Promise.resolve({ data: mockFormData }));
      crudForms.selectFormByIdAndVersion.mockResolvedValue(mockFormExist);
      api.get.mockImplementation(() => Promise.resolve(mockFormRes));
      crudForms.selectFormByIdAndVersion.mockImplementation(() => Promise.resolve(mockFormExist));
      crudForms.updateForm.mockImplementation(() => Promise.resolve(mockUpdatedForm));
      crudForms.addForm.mockImplementation(() => Promise.resolve(mockSavedForm));

      const sendPushNotification = jest.fn();
      await backgroundTask.syncFormVersion({ showNotificationOnly: false, sendPushNotification });

      expect(crudSessions.selectLastSession).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith('/auth', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(crudForms.selectFormByIdAndVersion).toHaveBeenCalledWith(mockForm);
      await waitFor(() => expect(api.get).toHaveBeenCalledWith(mockForm.url));
      expect(crudForms.updateForm).toHaveBeenCalledWith(mockForm);
      expect(crudForms.addForm).toHaveBeenCalledWith({ ...mockForm, formJSON: mockFormRes.data });
      expect(sendPushNotification).not.toHaveBeenCalled();
    });
  });

  describe('registerBackgroundTask', () => {
    it('should register a background task', async () => {
      await backgroundTask.registerBackgroundTask(mockTaskName);
      await waitFor(() =>
        expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
          mockTaskName,
          mockTaskOption,
        ),
      );
    });
  });

  describe('unregisterBackgroundTask', () => {
    it('should unregister a background task', async () => {
      await backgroundTask.unregisterBackgroundTask(mockTaskName);
      expect(BackgroundFetch.unregisterTaskAsync).toHaveBeenCalledWith(mockTaskName);
    });
  });

  describe('backgroundTaskStatus', () => {
    it('should register the background task if it is not registered', async () => {
      const mockStatus = BackgroundFetch.BackgroundFetchStatus.Available;

      BackgroundFetch.getStatusAsync.mockImplementation(() => Promise.resolve(mockStatus));
      TaskManager.isTaskRegisteredAsync.mockImplementation(() => Promise.resolve(false));

      await backgroundTask.backgroundTaskStatus(mockTaskName);

      expect(BackgroundFetch.getStatusAsync).toHaveBeenCalled();
      expect(TaskManager.isTaskRegisteredAsync).toHaveBeenCalledWith(mockTaskName);
      await waitFor(() =>
        expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
          mockTaskName,
          mockTaskOption,
        ),
      );
    });
  });
});
