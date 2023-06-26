import { renderHook, act } from '@testing-library/react-hooks';
import { AuthStore } from '../../src/store';

describe('AuthStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => AuthStore.useState());
    const {
      authenticationTypes,
      authenticationType,
      authenticationCode,
      serverUrl,
      username,
      password,
    } = result.current;
    expect(authenticationTypes).toEqual(['assesment', 'username_password']);
    expect(authenticationType).toBe('assesment');
    expect(authenticationCode).toBe('');
    expect(serverUrl).toBe('http://api.example.com/nmis');
    expect(username).toBe('');
    expect(password).toBe('');
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => AuthStore.useState());

    AuthStore.update((s) => {
      s.authenticationType = 'username_password';
      s.authenticationCode = 'testing123';
      s.username = 'jhondoe';
      s.password = 'secret';
    });
    const { authenticationTypes, authenticationType, authenticationCode, username, password } =
      result.current;
    expect(authenticationType).toBe('username_password');
    expect(authenticationTypes.includes(authenticationType)).toEqual(true);
    expect(authenticationCode).toBe('testing123');
    expect(username).toBe('jhondoe');
    expect(password).toBe('secret');
  });
});
