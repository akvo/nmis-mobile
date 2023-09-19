import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
jest.useFakeTimers();
import FormContainer from '../FormContainer';
import { FormState } from '../../store';

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

describe('FormContainer with repeatable question group', () => {
  it('should render form with repeatable question group correctly', async () => {
    const handleOnSave = jest.fn();

    const wrapper = render(<FormContainer forms={exampleTestForm} onSave={handleOnSave} />);

    await waitFor(() => {
      expect(handleOnSave).toHaveBeenCalledWith(null);
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeFalsy();
      const repeatAddMoreButton = wrapper.queryByTestId('repeat-add-more-button');
      expect(repeatAddMoreButton).toBeTruthy();
    });
  });

  it('should add new question group if repeat-add-more-button pressed', async () => {
    const handleOnSave = jest.fn();

    const wrapper = render(<FormContainer forms={exampleTestForm} onSave={handleOnSave} />);

    await waitFor(() => {
      const repeatAddMoreButton = wrapper.queryByTestId('repeat-add-more-button');
      expect(repeatAddMoreButton).toBeTruthy();
      fireEvent.press(repeatAddMoreButton);
    });

    await waitFor(() => {
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeTruthy();
      const repeatTitle1 = wrapper.queryByTestId('repeat-title-1');
      expect(repeatTitle1).toBeTruthy();
      const repeatDeleteButton1 = wrapper.queryByTestId('repeat-delete-button-1');
      expect(repeatDeleteButton1).toBeTruthy();
    });
  });

  it('should remove a question group if repeat-delete-button pressed', async () => {
    const handleOnSave = jest.fn();

    const wrapper = render(<FormContainer forms={exampleTestForm} onSave={handleOnSave} />);

    await waitFor(() => {
      // add repeat group by press add more button
      const repeatAddMoreButton = wrapper.queryByTestId('repeat-add-more-button');
      expect(repeatAddMoreButton).toBeTruthy();
      fireEvent.press(repeatAddMoreButton);
    });

    await waitFor(() => {
      // remove repeat group
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeTruthy();
      fireEvent.press(repeatDeleteButton0);
    });

    await waitFor(() => {
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeFalsy();
      const repeatTitle1 = wrapper.queryByTestId('repeat-title-1');
      expect(repeatTitle1).toBeFalsy();
      const repeatDeleteButton1 = wrapper.queryByTestId('repeat-delete-button-1');
      expect(repeatDeleteButton1).toBeFalsy();
    });
  });

  it('should handle repeat group submission', async () => {
    const handleOnSave = jest.fn();
    const handleOnSubmit = jest.fn();
    const modifiedInitialValues = {
      1: 'John',
      2: '31',
      3: ['Male'],
      '1-1': 'Jane',
      '2-1': '28',
      '3-1': ['Female'],
    };
    act(() => {
      FormState.update((s) => {
        s.currentValues = modifiedInitialValues;
      });
    });

    const wrapper = render(
      <FormContainer
        forms={exampleTestForm}
        onSave={handleOnSave}
        initialValues={modifiedInitialValues}
        onSubmit={handleOnSubmit}
      />,
    );

    await waitFor(() => {
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeTruthy();
      const repeatTitle1 = wrapper.queryByTestId('repeat-title-1');
      expect(repeatTitle1).toBeTruthy();
      const repeatDeleteButton1 = wrapper.queryByTestId('repeat-delete-button-1');
      expect(repeatDeleteButton1).toBeTruthy();
      expect(handleOnSave).toHaveBeenCalledTimes(1);
      expect(handleOnSave).toHaveBeenCalledWith({
        name: '',
        geo: null,
        answers: modifiedInitialValues,
      });
      // submit
      const formSubmitBtn = wrapper.queryByTestId('form-btn-submit');
      expect(formSubmitBtn).toBeTruthy();
      fireEvent.press(formSubmitBtn);
    });

    await waitFor(() => {
      expect(handleOnSubmit).toHaveBeenCalledTimes(1);
      expect(handleOnSubmit).toHaveBeenCalledWith({
        name: '',
        geo: null,
        answers: modifiedInitialValues,
      });
    });
  });

  it('should handle remove repeat group with value then handle submission', async () => {
    const handleOnSave = jest.fn();
    const handleOnSubmit = jest.fn();
    const modifiedInitialValues = {
      1: 'John',
      2: '31',
      3: ['Male'],
      '1-1': 'Jane',
      '2-1': '28',
      '3-1': ['Female'],
    };
    act(() => {
      FormState.update((s) => {
        s.currentValues = modifiedInitialValues;
      });
    });

    const wrapper = render(
      <FormContainer
        forms={exampleTestForm}
        onSave={handleOnSave}
        initialValues={modifiedInitialValues}
        onSubmit={handleOnSubmit}
      />,
    );

    await waitFor(() => {
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeTruthy();
      const repeatTitle1 = wrapper.queryByTestId('repeat-title-1');
      expect(repeatTitle1).toBeTruthy();
      const repeatDeleteButton1 = wrapper.queryByTestId('repeat-delete-button-1');
      expect(repeatDeleteButton1).toBeTruthy();
      expect(handleOnSave).toHaveBeenCalledTimes(1);
      expect(handleOnSave).toHaveBeenCalledWith({
        name: '',
        geo: null,
        answers: modifiedInitialValues,
      });
    });

    await waitFor(() => {
      // remove repeat group
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeTruthy();
      fireEvent.press(repeatDeleteButton0);
    });

    await waitFor(() => {
      const repeatTitle0 = wrapper.queryByTestId('repeat-title-0');
      expect(repeatTitle0).toBeTruthy();
      const repeatDeleteButton0 = wrapper.queryByTestId('repeat-delete-button-0');
      expect(repeatDeleteButton0).toBeFalsy();
      const repeatTitle1 = wrapper.queryByTestId('repeat-title-1');
      expect(repeatTitle1).toBeFalsy();
      const repeatDeleteButton1 = wrapper.queryByTestId('repeat-delete-button-1');
      expect(repeatDeleteButton1).toBeFalsy();
      // submit
      const formSubmitBtn = wrapper.queryByTestId('form-btn-submit');
      expect(formSubmitBtn).toBeTruthy();
      fireEvent.press(formSubmitBtn);
    });

    await waitFor(() => {
      expect(handleOnSubmit).toHaveBeenCalledTimes(1);
      expect(handleOnSubmit).toHaveBeenCalledWith({
        name: '',
        geo: null,
        answers: {
          1: 'Jane',
          2: '28',
          3: ['Female'],
        },
      });
    });
  });
});
