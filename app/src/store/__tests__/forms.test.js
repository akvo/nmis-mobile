import { renderHook, act } from '@testing-library/react-native';
import FormState from '../forms';

describe('FormState', () => {
  it('should initialize with the correct default state', () => {
    const { result } = renderHook(() => FormState.useState());
    const {
      form,
      questionGroups,
      questions,
      currentGroup,
      saved,
      submitted,
      currentValues,
      questionGroupListCurrentValues,
      dataPointName,
    } = result.current;
    expect(form).toEqual({});
    expect(questionGroups).toEqual([]);
    expect(questions).toEqual([]);
    expect(currentGroup).toBe(1);
    expect(saved).toBe(false);
    expect(submitted).toBe(false);
    expect(currentValues).toEqual({});
    expect(questionGroupListCurrentValues).toEqual({});
    expect(dataPointName).toEqual([]);
  });

  it('should updating the state correctly', () => {
    const { result } = renderHook(() => FormState.useState());
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
      FormState.update((s) => {
        s.form = selectedForm;
        s.questionGroups = qg;
        s.questions = qs;
        s.currentGroup = 2;
        s.saved = true;
        s.currentValues = { 1: 'John Doe', 2: 12 };
        s.questionGroupListCurrentValues = { 1: 'John Doe' };
        s.dataPointName = [{ id: 1, type: 'number', value: 12 }];
      });
    });
    const {
      form,
      questionGroups,
      questions,
      currentGroup,
      saved,
      submitted,
      currentValues,
      questionGroupListCurrentValues,
      dataPointName,
    } = result.current;
    expect(form).toBe(selectedForm);
    expect(questionGroups).toBe(qg);
    expect(questions).toBe(qs);
    expect(currentGroup).toBe(2);
    expect(saved).toBe(true);
    expect(submitted).toBe(false);
    expect(currentValues).toEqual({ 1: 'John Doe', 2: 12 });
    expect(questionGroupListCurrentValues).toEqual({ 1: 'John Doe' });
    expect(dataPointName).toEqual([{ id: 1, type: 'number', value: 12 }]);
  });
});
