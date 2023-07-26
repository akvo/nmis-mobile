import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
jest.useFakeTimers();
import FormPage from '../FormPage';
import crudDataPoints from '../../database/crud/crud-datapoints';

const mockFormContainer = jest.fn();
const mockRoute = {
  params: { id: 1, name: 'Form Name' },
};
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};
const mockValues = {
  name: 'John',
  geo: null,
  answers: [
    {
      1: 'John',
      2: new Date('01-01-1992'),
      3: '31',
      4: ['Male'],
      5: ['Bachelor'],
      6: ['Traveling'],
      7: ['Fried Rice'],
    },
  ],
};
const mockRefreshForm = jest.fn();
const mockOnSave = jest.fn();

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

jest.mock('../../assets/administrations.db', () => {
  return 'data';
});

describe('FormPage handleOnSaveForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render kebab menu and show dialog when kebab menu clicked', async () => {
    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const kebabMenuElement = wrapper.queryByTestId('form-page-kebab-menu');
    expect(kebabMenuElement).toBeTruthy();
    fireEvent.press(kebabMenuElement);

    await waitFor(() => {
      const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
      expect(dropdownMenuElement).toBeTruthy();
    });
  });

  test('should show saved dialog menu when back button pressed', async () => {
    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const arrowBackButton = wrapper.queryByTestId('arrow-back-button');
    expect(arrowBackButton).toBeTruthy();

    const savedTrigger = wrapper.queryByTestId('mock-save-button-helper');
    expect(savedTrigger).toBeTruthy();

    fireEvent.press(savedTrigger);
    fireEvent.press(arrowBackButton);

    const dialogMenuElement = wrapper.queryByTestId('save-dialog-menu');
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockValues, mockRefreshForm);
      expect(dialogMenuElement.props.visible).toEqual(true);
    });
  });

  test('should call handleOnSaveAndExit with the correct values when Save & Exit button pressed', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);

    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

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
      expect(crudDataPoints.saveDataPoint).toHaveBeenCalledWith({
        duration: 0,
        form: undefined,
        json: [],
        name: 'Untitled',
        submitted: 0,
        user: null,
      });
      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ManageForm', {
        id: 1,
        name: 'Form Name',
      });
    });
  });

  test('should show ToastAndroid if handleOnSaveAndExit throw an error', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);
    const consoleErrorSpy = jest.spyOn(console, 'error');
    crudDataPoints.saveDataPoint.mockImplementation(() => Promise.reject('Error'));

    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

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
      expect(crudDataPoints.saveDataPoint).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      expect(mockRefreshForm).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  test('should call handleOnExit and navigate to Home page when Exit without Saving button pressed', async () => {
    const mockSetOnSaveFormParams = jest.fn();
    const mockOnSaveFormParams = { values: mockValues, refreshForm: mockRefreshForm };
    jest
      .spyOn(React, 'useState')
      .mockImplementation(() => [mockOnSaveFormParams, mockSetOnSaveFormParams]);

    const mockSetShowDialogMenu = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetShowDialogMenu]);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const arrowBackButton = wrapper.queryByTestId('arrow-back-button');
    expect(arrowBackButton).toBeTruthy();
    fireEvent.press(arrowBackButton);

    const dialogMenuElement = wrapper.queryByTestId('save-dialog-menu');
    await waitFor(() => {
      expect(dialogMenuElement.props.visible).toEqual(true);
    });

    const exitButtonElement = wrapper.queryByTestId('exit-without-saving-button');
    expect(exitButtonElement).toBeTruthy();
    fireEvent.press(exitButtonElement);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });
});
