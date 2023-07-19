import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import TypeInput from '../TypeInput';

describe('TypeInput component', () => {
  it('should render the component correctly', () => {
    const { getByTestId, getByText } = render(
      <TypeInput onChange={() => jest.fn()} values={{}} id="inputField" name="Field Name" />,
    );

    const fieldLabel = getByTestId('field-label');
    expect(fieldLabel).toBeDefined();
    expect(getByText('Field Name')).toBeDefined();

    const inputElement = getByTestId('type-input');
    expect(inputElement).toBeDefined();
  });

  test('should call onChange when input text changes', () => {
    const onChangeMock = jest.fn();

    const { getByTestId } = render(
      <TypeInput onChange={onChangeMock} values={{}} id="inputField" name="Field Name" />,
    );

    const inputElement = getByTestId('type-input');
    fireEvent.changeText(inputElement, 'New Value');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('should display correct initial value', () => {
    const initialValue = 'Initial Value';

    const { getByTestId } = render(
      <TypeInput
        onChange={() => {}}
        values={{ inputField: initialValue }}
        id="inputField"
        name="Field Name"
      />,
    );

    const inputElement = getByTestId('type-input');
    expect(inputElement.props.value).toBe(initialValue);
  });

  test.todo('should show input preffix if addonBefore defined');
  test.todo('should show input suffix if addonAfter defined');
});
