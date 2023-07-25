import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
jest.useFakeTimers();
import FormPage from '../FormPage';
import { FormState } from 'store';
import crudDataPoints from '../../database/crud/crud-datapoints';

const mockFormContainer = jest.fn();
const mockRoute = {
  params: { id: 1, name: 'Form Name' },
};
const mockNavigation = { navigate: jest.fn() };
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
jest.mock('../../form/FormContainer', () => ({ forms, initialValues, onSubmit }) => {
  mockFormContainer(forms, initialValues, onSubmit);
  return (
    <mock-FormContainer>
      <button onPress={() => onSubmit(mockValues, mockRefreshForm)} testID="mock-submit-button">
        Submit
      </button>
    </mock-FormContainer>
  );
});

jest.mock('../../assets/administrations.db', () => {
  return 'data';
});

describe('FormPage component', () => {
  test('should render component correctly', () => {
    const tree = renderer.create(<FormPage navigation={mockNavigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render the FormPage with the correct form title', () => {
    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);
    expect(wrapper.getByText('Form Name')).toBeDefined();
  });

  test('should show the correct form content based on formJSON', async () => {
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);
    FormState.useState.mockReturnValue({
      form: exampleTestForm,
    });

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);
    const { form: mockStateForm } = FormState.useState((s) => s);

    await waitFor(() => {
      expect(mockFormContainer.mock.calls[0]).toEqual([exampleTestForm, {}, expect.any(Function)]);
      expect(mockStateForm).toEqual(exampleTestForm);
      expect(wrapper.getByText('Form Name')).toBeDefined();
    });
  });

  test('should call handleOnSubmitForm with the correct values when the form is submitted', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const submitButton = wrapper.getByTestId('mock-submit-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      // save datapoint to database
      expect(crudDataPoints.saveDataPoint).toHaveBeenCalledWith({
        duration: 0,
        form: undefined,
        json: [
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
        name: 'John',
        submitted: 1,
        user: null,
      });

      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      // call refreshForm
      expect(mockRefreshForm).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('FormData', {
        id: 1,
        name: 'Form Name',
        showSubmitted: true,
      });
    });
  });

  test('should show ToastAndroid if handleOnSubmitForm throw an error', async () => {
    Platform.OS = 'android';
    ToastAndroid.show = jest.fn();
    jest.spyOn(React, 'useMemo').mockReturnValue(exampleTestForm);
    const consoleErrorSpy = jest.spyOn(console, 'error');
    crudDataPoints.saveDataPoint.mockImplementation(() => Promise.reject('Error'));

    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const submitButton = wrapper.getByTestId('mock-submit-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      // save datapoint to database
      expect(crudDataPoints.saveDataPoint).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(ToastAndroid.show).toHaveBeenCalledTimes(1);
      // call refreshForm
      expect(mockRefreshForm).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  test('should render kebab menu and show dialog when kebab menu clicked', async () => {
    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const kebabMenuElement = wrapper.queryByTestId('form-page-kebab-menu');
    expect(kebabMenuElement).toBeTruthy();
    fireEvent.press(kebabMenuElement);

    await waitFor(() => {
      const dialogMenuElement = wrapper.queryByTestId('form-page-dialog-menu');
      expect(dialogMenuElement).toBeTruthy();
    });
  });

  test('should show Save and Exit button on dialog', async () => {
    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const kebabMenuElement = wrapper.queryByTestId('form-page-kebab-menu');
    fireEvent.press(kebabMenuElement);

    await waitFor(() => {
      const saveExitButtonElement = wrapper.queryByTestId('save-and-exit-button');
      expect(saveExitButtonElement).toBeTruthy();
    });
  });

  test('should show Exit without Saving button', async () => {
    const wrapper = render(<FormPage navigation={mockNavigation} route={mockRoute} />);

    const kebabMenuElement = wrapper.queryByTestId('form-page-kebab-menu');
    fireEvent.press(kebabMenuElement);

    await waitFor(() => {
      const exitWithoutSavingButton = wrapper.queryByTestId('exit-without-saving-button');
      expect(exitWithoutSavingButton).toBeTruthy();
    });
  });

  test.todo(
    'should show dialog menu with save/exit button when back button pressed or hardwareBackPress',
  );

  test.todo('should disable Save and Exit button values not defined yet');

  test.todo('should call handleOnSaveForm with the correct values when Save & Exit button pressed');

  test.todo('should navigate to Home page when Exit without Saving button pressed');
});
