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
  params: { id: 1, name: 'Form Name', dataPointId: 1, newSubmission: false },
};
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};
const mockValues = {
  name: 'John Doe',
  answers: {
    1: 'John Doe',
    2: new Date('01-01-1992'),
    3: '31',
    4: ['Male'],
    5: ['Bachelor'],
    6: ['Traveling'],
    7: ['Fried Rice'],
  },
};
const mockRefreshForm = jest.fn();
const mockOnSave = jest.fn();
const mockCurrentDataPoint = {
  id: 1,
  form: 1,
  user: 1,
  name: 'John',
  submitted: 0,
  duration: 0,
  createdAt: null,
  submittedAt: new Date().toISOString(),
  syncedAt: null,
  json: {
    1: 'John',
    2: new Date('01-01-1992'),
    3: '31',
    4: ['Male'],
    5: ['Bachelor'],
    6: ['Traveling'],
    7: ['Fried Rice'],
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
          name: 'Birth Date',
          order: 2,
          type: 'date',
          required: true,
          translations: [
            {
              name: 'Tanggal Lahir',
              language: 'id',
            },
          ],
        },
        {
          id: 3,
          name: 'Age',
          order: 3,
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
          id: 4,
          name: 'Gender',
          order: 4,
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
        {
          id: 5,
          name: 'Your last education',
          order: 1,
          type: 'option',
          required: false,
          option: [
            {
              id: 11,
              name: 'Senior High School',
              order: 1,
            },
            {
              id: 12,
              name: 'Bachelor',
              order: 2,
            },
            {
              id: 13,
              name: 'Master',
              order: 3,
            },
            {
              id: 14,
              name: 'Doctor',
              order: 4,
            },
          ],
        },
        {
          id: 6,
          name: 'Hobby',
          order: 2,
          type: 'option',
          required: false,
          option: [
            {
              id: 21,
              name: 'Reading',
              order: 1,
            },
            {
              id: 22,
              name: 'Traveling',
              order: 2,
            },
            {
              id: 23,
              name: 'Programming',
              order: 3,
            },
          ],
        },
        {
          id: 7,
          name: 'Foods',
          order: 3,
          type: 'option',
          required: false,
          option: [
            {
              id: 31,
              name: 'Fried Rice',
              order: 1,
            },
            {
              id: 32,
              name: 'Rendang',
              order: 2,
            },
            {
              id: 33,
              name: 'Noodle',
              order: 3,
            },
            {
              id: 34,
              name: 'Meat Ball',
              order: 5,
            },
            {
              id: 35,
              name: 'Fried Chicken',
              order: 6,
            },
          ],
        },
        {
          id: 8,
          name: 'Comment',
          order: 4,
          type: 'text',
          required: false,
          translations: [
            {
              name: 'Kommentar',
              language: 'id',
            },
          ],
        },
        {
          id: 9,
          name: 'Give Rating from 1 - 9 for Rendang',
          order: 5,
          type: 'number',
          required: true,
          dependency: [
            {
              id: 7,
              options: ['Rendang'],
            },
          ],
          rule: {
            min: 1,
            max: 9,
            allowDecimal: true,
          },
          addonAfter: 'Score',
        },
      ],
    },
  ],
};

jest.mock('../../database/crud/crud-datapoints');
jest.mock('../../form/FormContainer', () => ({ forms, initialValues, onSubmit, onSave }) => {
  mockFormContainer(forms, initialValues, onSubmit, onSave);
  return (
    <mock-FormContainer>
      <button
        onPress={() => mockOnSave(mockValues, mockRefreshForm)}
        testID="mock-save-button-helper"
      >
        Save Trigger helper
      </button>
      <button onPress={() => onSubmit(mockValues, mockRefreshForm)} testID="mock-submit-button">
        Submit
      </button>
    </mock-FormContainer>
  );
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useMemo: jest.fn(),
}));

describe('FormPage continue saved submision then save', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1634123456789);
    FormState.update((s) => {
      s.surveyDuration = 0;
    });
  });

  test('should call handleOnSaveAndExit with the correct values when Save & Exit button pressed', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue({ json: exampleTestForm });
    crudDataPoints.selectDataPointById.mockImplementation(() =>
      Promise.resolve(mockCurrentDataPoint),
    );

    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);
    act(() => {
      FormState.update((s) => {
        s.surveyStart = getCurrentTimestamp();
      });
    });

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    act(() => {
      UserState.update((s) => {
        s.id = 1;
      });
    });

    const arrowBackButton = wrapper.queryByTestId('arrow-back-button');
    expect(arrowBackButton).toBeTruthy();
    fireEvent.press(arrowBackButton);

    const dialogMenuElement = wrapper.queryByTestId('save-dialog-menu');
    await waitFor(() => {
      expect(dialogMenuElement.props.visible).toEqual(true);
    });

    const saveButtonElement = wrapper.queryByTestId('save-and-exit-button');
    expect(saveButtonElement).toBeTruthy();
    fireEvent.press(saveButtonElement);

    await waitFor(() => {
      expect(crudDataPoints.saveDataPoint).not.toHaveBeenCalled();
      expect(crudDataPoints.updateDataPoint).toHaveBeenCalledWith({
        duration: 1,
        form: 1,
        json: {},
        name: 'Untitled',
        submitted: 0,
        user: null,
      });
      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', mockRoute.params);
    });
  });

  test('should show ToastAndroid if handleOnSaveAndExit throw an error', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);
    crudDataPoints.selectDataPointById.mockImplementation(() =>
      Promise.resolve(mockCurrentDataPoint),
    );
    const consoleErrorSpy = jest.spyOn(console, 'error');
    crudDataPoints.updateDataPoint.mockImplementation(() => Promise.reject('Error'));

    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    act(() => {
      UserState.update((s) => {
        s.id = 1;
      });
    });

    const arrowBackButton = wrapper.queryByTestId('arrow-back-button');
    expect(arrowBackButton).toBeTruthy();
    fireEvent.press(arrowBackButton);

    const dialogMenuElement = wrapper.queryByTestId('save-dialog-menu');
    await waitFor(() => {
      expect(dialogMenuElement.props.visible).toEqual(true);
    });

    const saveButtonElement = wrapper.queryByTestId('save-and-exit-button');
    expect(saveButtonElement).toBeTruthy();
    fireEvent.press(saveButtonElement);

    await waitFor(() => {
      expect(crudDataPoints.saveDataPoint).not.toHaveBeenCalled();
      expect(crudDataPoints.updateDataPoint).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      expect(mockRefreshForm).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });
});
