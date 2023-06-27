import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
jest.useFakeTimers();
import { FormContainer } from '../../src/form';
import * as exampleTestForm from './example-test-form.json';

describe('FormContainer component', () => {
  test('submits form data correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const modifiedInitialValues = {
      1: 'John',
      2: new Date('01-01-1992'),
      3: '31',
      4: ['Male'],
      5: ['Bachelor'],
      6: [undefined, 'Traveling'],
      7: ['Fried Rice', 'Rendang'],
      8: ' ',
    };

    const { queryByTestId } = render(
      <FormContainer forms={exampleTestForm} initialValues={modifiedInitialValues} />,
    );

    const nextBtn = queryByTestId('form-nav-btn-next');
    expect(nextBtn).toBeDefined();
    fireEvent.press(nextBtn);

    const formSubmitBtn = queryByTestId('form-btn-submit');
    expect(formSubmitBtn).toBeDefined();
    fireEvent.press(formSubmitBtn);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
    expect(consoleSpy).toHaveBeenCalledWith({
      1: 'John',
      2: new Date('01-01-1992'),
      3: '31',
      4: ['Male'],
      5: ['Bachelor'],
      6: ['Traveling'],
      7: ['Fried Rice', 'Rendang'],
    });

    consoleSpy.mockRestore();
  });
});
