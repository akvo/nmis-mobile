import { renderHook, act } from '@testing-library/react-hooks';
import { UserStore } from '../../src/store';

describe('UserStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => UserStore.useState());
    const { id, name, token, preferences, forms } = result.current;
    expect(id).toBe(null);
    expect(name).toBe('');
    expect(token).toBe(null);
    expect(preferences).toEqual({});
    expect(forms).toEqual([]);
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => UserStore.useState());
    const userData = {
      id: 1,
      name: 'Jhon doe',
      token: 'Bearer eyjtoken',
      forms: [
        {
          id: 123,
          url: '/forms/123',
          version: '1.2.0',
        },
      ],
    };
    const userPreferences = {
      syncWifiOnly: true,
      syncInterval: 500,
      lang: 'fr',
    };
    act(() => {
      UserStore.update((s) => {
        s.id = userData.id;
        s.name = userData.name;
        s.token = userData.token;
        s.preferences = userPreferences;
        s.forms = userData.forms;
      });
    });
    const { id, name, token, preferences, forms } = result.current;
    expect(id).toBe(userData.id);
    expect(name).toBe(userData.name);
    expect(token).toBe(userData.token);
    expect(preferences).toBe(userPreferences);
    expect(forms).toBe(userData.forms);
  });
});
