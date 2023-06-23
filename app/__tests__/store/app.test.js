import { AppStore } from '../../src/store';
import { renderHook, act } from '@testing-library/react-hooks';

describe('AppStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => AppStore.useState());
    const { currentPage, lang, online } = result.current;
    expect(currentPage).toBe('GetStarted');
    expect(lang).toBe('en');
    expect(online).toBe(false);
  });

  it('should update online state correctly', () => {
    const { result } = renderHook(() => AppStore.useState());
    act(() => {
      AppStore.update((s) => {
        s.online = true;
      });
    });
    const { online } = result.current;
    expect(online).toBe(true);
  });
});
