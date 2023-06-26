import { renderHook, act } from '@testing-library/react-hooks';
import { UIStore } from '../../src/store';

describe('UIStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => UIStore.useState());
    const { fontSize, lang, isDarkMode } = result.current;
    expect(fontSize).toBe('default');
    expect(lang).toBe('en');
    expect(isDarkMode).toBe(false);
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => UIStore.useState());
    act(() => {
      UIStore.update((s) => {
        s.isDarkMode = true;
        s.lang = 'fr';
        s.fontSize = 'large';
      });
    });
    const { isDarkMode, lang, fontSize } = result.current;
    expect(isDarkMode).toBe(true);
    expect(lang).toBe('fr');
    expect(fontSize).toBe('large');
  });
});
