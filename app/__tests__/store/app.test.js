import { renderHook, act } from '@testing-library/react-hooks';
import { AppStore } from '../../src/store';

describe('AppStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => AppStore.useState());
    const { currentPage, online } = result.current;
    expect(currentPage).toBe('GetStarted');
    expect(online).toBe(false);
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => AppStore.useState());
    act(() => {
      AppStore.update((s) => {
        s.online = true;
        s.currentPage = 'Home';
      });
    });
    const { online, currentPage } = result.current;
    expect(online).toBe(true);
    expect(currentPage).toBe('Home');
  });
});
