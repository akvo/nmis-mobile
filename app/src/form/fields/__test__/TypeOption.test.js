import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TypeOption from '../TypeOption';

describe('TypeOption component', () => {
  test('renders radio group options correctly', () => {
    const onChangeMock = jest.fn();
    const values = {};
    const option = [
      { name: 'option1', label: 'Option 1' },
      { name: 'option2', label: 'Option 2' },
      { name: 'option3', label: 'Option 3' },
    ];

    const { getByText } = render(
      <TypeOption
        onChange={onChangeMock}
        values={values}
        id="radioField"
        name="Radio Field"
        option={option}
      />,
    );

    const radioOption1 = getByText('Option 1');
    const radioOption2 = getByText('Option 2');
    const radioOption3 = getByText('Option 3');
    expect(radioOption1).toBeDefined();
    expect(radioOption2).toBeDefined();
    expect(radioOption3).toBeDefined();

    fireEvent.press(radioOption2);

    expect(onChangeMock).toHaveBeenCalledWith('radioField', ['option2']);
  });

  test('renders dropdown options correctly', async () => {
    const setFieldValueMock = jest.fn();
    const onChangeMock = jest.fn();
    const values = {};
    const option = [
      { name: 'option1', label: 'Option 1' },
      { name: 'option2', label: 'Option 2' },
      { name: 'option3', label: 'Option 3' },
      { name: 'option4', label: 'Option 4' },
    ];

    const { getByTestId } = render(
      <TypeOption
        onChange={onChangeMock}
        values={values}
        id="dropdown"
        name="Dropdown Field"
        option={option}
        setFieldValue={setFieldValueMock}
      />,
    );

    const dropdown = getByTestId('type-option-dropdown');
    expect(dropdown).toBeDefined();
  });
});
