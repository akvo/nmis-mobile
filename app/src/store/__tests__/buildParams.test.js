import { renderHook, act } from '@testing-library/react-native';
import BuildParamsState from '../buildParams';

describe('BuildParamsState', () => {
  it('should initialize with the correct default state from build.json', () => {
    const { result } = renderHook(() => BuildParamsState.useState());
    const {
      authenticationType,
      serverURL,
      debugMode,
      dataSyncInterval,
      errorHandling,
      loggingLevel,
      appVersion,
    } = result.current;
    expect(authenticationType).toEqual(['code_assignment', 'username', 'password']);
    expect(serverURL).toBe('https://api.example.com/nmis');
    expect(debugMode).toBe(false);
    expect(dataSyncInterval).toBe(300);
    expect(errorHandling).toBe(true);
    expect(loggingLevel).toBe('verbose');
    expect(appVersion).toBe('1.2.0');
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => BuildParamsState.useState());
    const serverURLValue = 'http://127.0.0.1:8080';
    act(() => {
      BuildParamsState.update((s) => {
        s.authenticationType = ['code_assignment'];
        s.serverURL = serverURLValue;
        s.debugMode = true;
        s.debugMode = true;
        s.dataSyncInterval = 400;
        s.errorHandling = false;
        s.loggingLevel = 'trace';
        s.appVersion = '1.1.0';
      });
    });
    const {
      authenticationType,
      serverURL,
      debugMode,
      dataSyncInterval,
      errorHandling,
      loggingLevel,
      appVersion,
    } = result.current;
    expect(authenticationType).toEqual(['code_assignment']);
    expect(serverURL).toBe(serverURLValue);
    expect(debugMode).toBe(true);
    expect(dataSyncInterval).toBe(400);
    expect(errorHandling).toBe(false);
    expect(loggingLevel).toBe('trace');
    expect(appVersion).toBe('1.1.0');
  });
});
