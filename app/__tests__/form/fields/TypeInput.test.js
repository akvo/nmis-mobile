import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { TypeInput } from '../../../src/form/fields';

describe('TypeInput component', () => {
  it('should render the component correctly', () => {
    const { getByTestId } = render(
      <TypeInput onChange={() => jest.fn()} values={{}} id="inputField" />
    );

    const fieldLabel = getByTestId('field-label');
    expect(fieldLabel).toBeDefined()

    const inputElement = getByTestId('type-input');
    expect(inputElement).toBeDefined()
  });

  test('should call onChange when input text changes', () => {
    const onChangeMock = jest.fn();

    const { getByTestId } = render(
      <TypeInput onChange={onChangeMock} values={{}} id="inputField" />
    );

    const inputElement = getByTestId('type-input');
    fireEvent.changeText(inputElement, 'New Value');
    expect(onChangeMock).toHaveBeenCalledWith('inputField');
  });

  test('should display correct initial value', () => {
    const initialValue = 'Initial Value';

    const { getByTestId } = render(
      <TypeInput onChange={() => {}} values={{ inputField: initialValue }} id="inputField" />
    );

    const inputElement = getByTestId('type-input');
    expect(inputElement.props.value).toBe(initialValue);
  });
});
