import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import TypeNumber from '../TypeNumber';

describe('TypeNumber component', () => {
  it('should render the component correctly', () => {
    const { getByTestId, getByText } = render(
      <TypeNumber onChange={() => jest.fn()} values={{}} id="inputField" name="Field Name" />,
    );

    const fieldLabel = getByTestId('field-label');
    expect(fieldLabel).toBeDefined();
    expect(getByText('Field Name')).toBeDefined();

    const inputElement = getByTestId('type-number');
    expect(inputElement).toBeDefined();
  });

  test('should call onChange when input number changes', () => {
    const onChangeMock = jest.fn();

    const { getByTestId } = render(
      <TypeNumber onChange={onChangeMock} values={{}} id="inputField" name="Field Name" />,
    );

    const inputElement = getByTestId('type-number');
    fireEvent.changeText(inputElement, 20);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('should display correct initial value', () => {
    const initialValue = '20';

    const { getByTestId } = render(
      <TypeNumber
        onChange={() => {}}
        values={{ inputField: initialValue }}
        id="inputField"
        name="Field Name"
      />,
    );

    const inputElement = getByTestId('type-number');
    expect(inputElement.props.value).toBe(initialValue);
  });

  test.todo('should not show input preffix if addonBefore not defined');

  test.todo('should show input preffix if addonBefore (string) defined');

  test.todo('should show input preffix if addonBefore (React element) defined');

  test.todo('should not show input suffix if only addonBefore defined');

  test.todo('should not show input preffix if addonBefore not defined');

  test.todo('should show input suffix if addonAfter (string) defined');

  test.todo('should show input suffix if addonAfter (React element) defined');

  test.todo('should not show input preffix if only addonAfter defined');

  test.todo('should show both input suffix & preffix if both addonAfter & addonBefore defined');
});
