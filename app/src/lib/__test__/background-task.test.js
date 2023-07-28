import api from '../api';
import backgroundTask from '../background-task';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { crudForms, crudSessions, crudUsers, crudDataPoints } from '../../database/crud';
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

  describe('syncFormSubmission', () => {
    const mockSession = { token: 'eyjtoken', passcode: '12345' };
    const mockForm = {
      id: 123,
      formId: 456,
      name: 'Form Name',
      version: '1.0.0',
      latest: 1,
      json: JSON.stringify({
        formId: 456,
        name: 'Form Name',
        version: '1.0.0',
        question_group: [],
      }),
      createdAt: '2023-07-28T07:53:40.210Z',
    };
    const dataPoints = [
      {
        id: 1,
        form: 123,
        user: 1,
        name: 'Data point 1 name',
        geo: '-8.676119|115.4927994',
        submitted: 1,
        duration: 2.5,
        createdAt: '2023-07-28T07:53:40.210Z',
        submittedAt: '2023-07-28T07:53:40.210Z',
        syncedAt: null,
        json: JSON.stringify([{ 101: 'Data point 1', 102: 1 }]),
      },
    ];
    const mockUser = {
      id: 1,
      name: 'John Doe',
      password: 'password',
      active: 1,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    // it('should log an error if check connection rejected', async () => {
    //   const consoleSpy = jest.spyOn(console, 'error');
    //   api.get.mockImplementation(() => Promise.reject('No connection'));

    //   await backgroundTask.syncFormSubmission();
    //   expect(consoleSpy).toHaveBeenCalledWith('[syncFormSubmission] Error: ', 'No connection');
    // });

    it('should sync submission if any', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      // api.get.mockImplementation(() => Promise.resolve(true));
      crudSessions.selectLastSession.mockImplementation(() => Promise.resolve(mockSession));
      crudDataPoints.selectSubmissionToSync.mockImplementation(() => Promise.resolve(dataPoints));
      crudUsers.selectUserById.mockImplementation(() => Promise.resolve(mockUser));
      crudForms.selectFormById.mockImplementation(() => Promise.resolve(mockForm));
      crudDataPoints.updateDataPoint.mockImplementation(() => Promise.resolve({ rowsAffected: 1 }));

      api.setToken.mockReturnValue({ token: mockSession.token });
      api.post.mockImplementation(() =>
        Promise.resolve({ status: 200, data: { id: 123, message: 'Success' } }),
      );

      await backgroundTask.syncFormSubmission();
      expect(consoleSpy).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(crudSessions.selectLastSession).toHaveBeenCalled();
        expect(api.setToken).toHaveBeenCalled();
        expect(crudDataPoints.selectSubmissionToSync).toHaveBeenCalled();
        expect(crudUsers.selectUserById).toHaveBeenCalled();
        expect(crudForms.selectFormById).toHaveBeenCalled();
        expect(api.post).toHaveBeenCalledWith('/sync', {
          answers: [{ 101: 'Data point 1', 102: 1 }],
          duration: 2.5,
          formId: 456,
          geo: [-8.676119, 115.4927994],
          name: 'Data point 1 name',
          submittedAt: '2023-07-28T07:53:40.210Z',
          submitter: 'John Doe',
        });
        expect(crudDataPoints.updateDataPoint).toHaveBeenCalled();
      });
    });
  });
});
