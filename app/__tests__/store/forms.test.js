import { renderHook, act } from '@testing-library/react-hooks';
import { FormStore } from '../../src/store';

describe('FormStore', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => FormStore.useState());
    const { form, questionGroups, questions, currentGroup, saved, submitted } = result.current;
    expect(form).toEqual({});
    expect(questionGroups).toEqual([]);
    expect(questions).toEqual([]);
    expect(currentGroup).toBe(1);
    expect(saved).toBe(false);
    expect(submitted).toBe(false);
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => FormStore.useState());
    const selectedForm = {
      id: 123,
      name: 'Complain form',
      url: '/forms/123',
      version: '1.2.0',
      totalGroup: 2,
    };
    const qg = [
      {
        id: 1,
        name: 'Profile',
      },
      {
        id: 2,
        name: 'Complain',
      },
    ];
    const qs = [
      {
        id: 3,
        text: 'Description',
      },
    ];
    act(() => {
      FormStore.update((s) => {
        s.form = selectedForm;
        s.questionGroups = qg;
        s.questions = qs;
        s.currentGroup = 2;
        s.saved = true;
      });
    });
    const { form, questionGroups, questions, currentGroup, saved, submitted } = result.current;
    expect(form).toBe(selectedForm);
    expect(questionGroups).toBe(qg);
    expect(questions).toBe(qs);
    expect(currentGroup).toBe(2);
    expect(saved).toBe(true);
    expect(submitted).toBe(false);
  });
});
