import React from 'react';
import renderer from 'react-test-renderer';
import AuthByPassFormPage from '../AuthByPassForm';
import api from '../../lib/api';
import { UIState, UserState } from '../../store';
import { render, fireEvent, act, renderHook, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { crudUsers } from '../../database/crud';

jest.mock('../../lib/api');
jest.mock('../../database/crud');

describe('AuthByPassForm', () => {
  test('it renders correctly', () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const tree = renderer.create(<AuthByPassFormPage navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('it should not download forms when offline', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    api.post.mockImplementation(() => Promise.resolve({ data: { formsUrl: [] } }));

    render(<AuthByPassFormPage navigation={navigation} />);

    act(() => {
      UIState.update((s) => {
        s.online = false;
      });
    });
    expect(api.get).not.toHaveBeenCalled();
  });

  it('it should download forms when online', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    api.get.mockImplementation(() => Promise.resolve({ data: { formsUrl: [] } }));

    render(<AuthByPassFormPage navigation={navigation} />);

    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });

    expect(api.get).toHaveBeenCalledWith('/forms');
  });

  it('it should navigate to add user if no user defined after form downloaded', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const mockListForms = {
      message: 'Success',
      formsUrl: [],
    };

    api.getConfig.mockImplementation(() => ({ baseURL: 'http://example.com' }));
    api.get.mockImplementation(() => Promise.resolve({ data: mockListForms }));

    render(<AuthByPassFormPage navigation={navigation} />);

    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });

    expect(api.get).toHaveBeenCalledWith('/forms');
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('AddUser'));
  });

  it('it should navigate to home if user defined after form downloaded', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const mockGetData = {
      message: 'Success',
      formsUrl: [
        {
          id: 1,
          url: '/forms/1',
          version: '1.0.0',
        },
      ],
    };
    const mockUser = { id: 1, name: 'John Doe', password: 'qwerty' };
    api.get.mockImplementation(() => Promise.resolve({ data: mockGetData }));
    crudUsers.getActiveUser.mockImplementation(() => Promise.resolve(mockUser));
    const { result: userStateRef } = renderHook(() => UserState.useState((s) => s));

    render(<AuthByPassFormPage navigation={navigation} />);

    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });

    expect(api.get).toHaveBeenCalledWith('/forms');
    await waitFor(() => {
      const {
        id: userIdState,
        name: userNameState,
        password: userPasswordState,
      } = userStateRef.current;
      expect(userIdState).toEqual(mockUser.id);
      expect(userNameState).toEqual(mockUser.name);
      expect(userPasswordState).toEqual(mockUser.password);
      expect(navigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('it should be error', async () => {
    const { result: navigationRef } = renderHook(() => useNavigation());
    const navigation = navigationRef.current;
    const mockErrorData = { message: 'Failed' };
    api.get.mockImplementation(() =>
      Promise.reject({ response: { ...mockErrorData, status: 400 } }),
    );
    crudUsers.getActiveUser.mockImplementation(() => Promise.resolve(mockUser));
    const { result: userStateRef } = renderHook(() => UserState.useState((s) => s));

    render(<AuthByPassFormPage navigation={navigation} />);

    act(() => {
      UIState.update((s) => {
        s.online = true;
      });
    });

    expect(api.get).toHaveBeenCalledWith('/forms');
  });
});
