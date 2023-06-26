import { renderHook, act } from '@testing-library/react-hooks';
import { BuildParamsStore } from '../../src/store';

describe('BuildParamsStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => BuildParamsStore.useState());
    const { debugMode, dataSyncInterval, errorHandling, loggingLevel, appVersion } = result.current;
    expect(debugMode).toBe(false);
    expect(dataSyncInterval).toBe(300);
    expect(errorHandling).toBe(true);
    expect(loggingLevel).toBe('verbose');
    expect(appVersion).toBe('1.0.0');
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => BuildParamsStore.useState());
    act(() => {
      BuildParamsStore.update((s) => {
        s.debugMode = true;
        s.dataSyncInterval = 400;
        s.errorHandling = false;
        s.loggingLevel = 'trace';
        s.appVersion = '1.1.0';
      });
    });
    const { debugMode, dataSyncInterval, errorHandling, loggingLevel, appVersion } = result.current;
    expect(debugMode).toBe(true);
    expect(dataSyncInterval).toBe(400);
    expect(errorHandling).toBe(false);
    expect(loggingLevel).toBe('trace');
    expect(appVersion).toBe('1.1.0');
  });
});
