import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TypeMultipleOption from '../TypeMultipleOption';

describe('TypeMultipleOption', () => {
  test('renders checkbox options correctly when option length is less than or equal to 3', () => {
    const option = [
      { name: 'option1', label: 'Option 1' },
      { name: 'option2', label: 'Option 2' },
      { name: 'option3', label: 'Option 3' },
    ];
    const onChange = jest.fn();

    const { getByText } = render(
      <TypeMultipleOption
        onChange={onChange}
        values={{}}
        id="multipleOptionId"
        name="Multiple Option"
        option={option}
      />,
    );

    expect(getByText('Option 1')).toBeDefined();
    expect(getByText('Option 2')).toBeDefined();
    expect(getByText('Option 3')).toBeDefined();

    fireEvent.press(getByText('Option 1'));
    expect(onChange).toHaveBeenCalledWith('multipleOptionId.0', 'option1');
  });

  test('renders MultiSelect correctly when option length is greater than 3', () => {
    const option = [
      { name: 'option1', label: 'Option 1' },
      { name: 'option2', label: 'Option 2' },
      { name: 'option3', label: 'Option 3' },
      { name: 'option4', label: 'Option 4' },
    ];
    const onChange = jest.fn();

    const { getByText, getByTestId } = render(
      <TypeMultipleOption
        onChange={onChange}
        values={{}}
        id="multipleOptionId"
        name="Multiple Option"
        option={option}
      />,
    );

    const multipleDropdown = getByTestId('type-multiple-option-dropdown');
    expect(multipleDropdown).toBeDefined();
  });

  it('should not show required sign if required param is false and requiredSign is not defined', () => {
    const wrapper = render(
      <TypeMultipleOption
        id="multipleOptionField"
        name="Multiple Option Field Name"
        required={false}
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is false but requiredSign is defined', () => {
    const wrapper = render(
      <TypeMultipleOption
        id="multipleOptionField"
        name="Multiple Option Field Name"
        required={false}
        requiredSign="*"
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is true and requiredSign defined', () => {
    const wrapper = render(
      <TypeMultipleOption
        id="multipleOptionField"
        name="Multiple Option Field Name"
        required={true}
        requiredSign="*"
      />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
  });

  it('should show required sign with custom requiredSign', () => {
    const wrapper = render(
      <TypeMultipleOption
        id="multipleOptionField"
        name="Multiple Option Field Name"
        required={true}
        requiredSign="**"
      />,
    );
    const requiredIcon = wrapper.getByText('**');
    expect(requiredIcon).toBeTruthy();
  });
});
