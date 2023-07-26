import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TypeDate from '../TypeDate';

describe('TypeDate component', () => {
  it('should render the component correctly', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <TypeDate onChange={() => jest.fn()} values={{}} id="dateField" name="Date Field" />,
    );

    expect(getByText('1. Date Field')).toBeDefined();

    const dateField = getByTestId('type-date');
    expect(dateField).toBeDefined();

    const dateTimePicker = queryByTestId('date-time-picker');
    expect(dateTimePicker).toBeNull();
  });

  test('opens the date picker on input field press', () => {
    const { getByTestId } = render(
      <TypeDate onChange={() => jest.fn()} values={{}} id="dateField" name="Date Field" />,
    );

    const dateField = getByTestId('type-date');
    fireEvent(dateField, 'pressIn');

    const dateTimePicker = getByTestId('date-time-picker');
    expect(dateTimePicker).toBeDefined();
  });

  test('calls the onChange function with the selected date', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <TypeDate onChange={onChangeMock} values={{}} id="dateField" name="Date Field" />,
    );

    const dateField = getByTestId('type-date');
    fireEvent(dateField, 'pressIn');

    const dateTimePicker = getByTestId('date-time-picker');
    fireEvent(dateTimePicker, 'change', { nativeEvent: { timestamp: 1624262400000 } });

    expect(onChangeMock).toHaveBeenCalledWith('dateField', new Date(1624262400000));
  });

  test('should display correct initial value', () => {
    const initialValue = new Date(1624262400000);

    const { getByTestId } = render(
      <TypeDate
        onChange={() => {}}
        values={{ dateField: initialValue }}
        id="dateField"
        name="Date Field"
      />,
    );

    const dateField = getByTestId('type-date');
    expect(dateField.props.value).toBe(initialValue.toLocaleDateString());
  });

  it('should not show required sign if required param is false and requiredSign is not defined', () => {
    const wrapper = render(<TypeDate id="dateField" name="Date Field" required={false} />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is false but requiredSign is defined', () => {
    const wrapper = render(
      <TypeDate id="dateField" name="Date Field" required={false} requiredSign="*" />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should not show required sign if required param is true and requiredSign defined', () => {
    const wrapper = render(
      <TypeDate id="dateField" name="Date Field" required={true} requiredSign="*" />,
    );
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
  });

  it('should show required sign with custom requiredSign', () => {
    const wrapper = render(
      <TypeDate id="dateField" name="Date Field" required={true} requiredSign="**" />,
    );
    const requiredIcon = wrapper.getByText('**');
    expect(requiredIcon).toBeTruthy();
  });
});
