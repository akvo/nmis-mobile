import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
jest.useFakeTimers();
import FormPage from '../FormPage';
import crudDataPoints from '../../database/crud/crud-datapoints';
import { UserState, FormState } from '../../store';
import { getCurrentTimestamp } from '../../form/lib';

const mockFormContainer = jest.fn();
const mockRoute = {
  params: { id: 1, name: 'Form Name', newSubmission: true },
};
const mockNavigation = {
  navigate: jest.fn(),
  canGoBack: jest.fn(() => Promise.resolve(true)),
  goBack: jest.fn(),
};
const mockValues = {
  name: 'John',
  geo: null,
  answers: {
    1: 'John',
    2: '31',
    3: ['Male'],
    '1-1': 'Jane',
    '2-1': '28',
    '3-1': ['Female'],
  },
};

const exampleTestForm = {
  name: 'Testing Form',
  languages: ['en', 'id'],
  defaultLanguage: 'en',
  translations: [
    {
      name: 'Formulir untuk Testing',
      language: 'id',
    },
  ],
  question_group: [
    {
      name: 'Registration',
      order: 1,
      repeatable: true,
      translations: [
        {
          name: 'Registrasi',
          language: 'id',
        },
      ],
      question: [
        {
          id: 1,
          name: 'Your Name',
          order: 1,
          type: 'input',
          required: true,
          meta: true,
          translations: [
            {
              name: 'Nama Anda',
              language: 'id',
            },
          ],
          addonBefore: 'Name',
        },
        {
          id: 2,
          name: 'Age',
          order: 2,
          type: 'number',
          required: true,
          translations: [
            {
              name: 'Umur',
              language: 'id',
            },
          ],
        },
        {
          id: 3,
          name: 'Gender',
          order: 3,
          type: 'option',
          required: true,
          option: [
            {
              id: 1,
              name: 'Male',
              order: 1,
            },
            {
              id: 2,
              name: 'Female',
              order: 2,
            },
          ],
          meta: false,
          translations: [
            {
              name: 'Jenis Kelamin',
              language: 'id',
            },
          ],
        },
      ],
    },
  ],
};

jest.mock('../../database/crud/crud-datapoints');
jest.mock('../../form/FormContainer', () => ({ forms, initialValues, onSubmit }) => {
  mockFormContainer(forms, initialValues, onSubmit);
  return (
    <mock-FormContainer>
      <button onPress={() => onSubmit(mockValues)} testID="mock-submit-button">
        Submit
      </button>
    </mock-FormContainer>
  );
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn(),
}));

describe('FormPage handle repeatable question group submission', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1634123456789);
    FormState.update((s) => {
      s.surveyDuration = 0;
    });
  });

  it('should call handleOnSubmitForm with repetable answer values when submitted', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);
    act(() => {
      FormState.update((s) => {
        s.surveyStart = getCurrentTimestamp() - 90;
      });
    });

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    act(() => {
      UserState.update((s) => {
        s.id = 1;
      });
      FormState.update((s) => {
        s.surveyDuration = 9;
      });
    });

    await waitFor(() => {
      const submitButton = wrapper.getByTestId('mock-submit-button');
      fireEvent.press(submitButton);
    });

    // save datapoint to database
    await waitFor(() => {
      expect(crudDataPoints.saveDataPoint).toHaveBeenCalledWith({
        duration: 10,
        form: 1,
        json: {
          1: 'John',
          2: 31,
          3: ['Male'],
          '1-1': 'Jane',
          '2-1': 28,
          '3-1': ['Female'],
        },
        name: 'John',
        geo: null,
        submitted: 1,
        user: 1,
      });
    });

    expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', mockRoute.params);
  });
});
