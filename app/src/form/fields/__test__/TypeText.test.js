import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TypeText from '../TypeText';

describe('TypeText component', () => {
  test('renders correctly', () => {
    const onChangeMock = jest.fn();
    const values = {
      textValue: 'Initial value',
    };
    const id = 'textValue';
    const name = 'Text Field';

    const { getByText, getByTestId } = render(
      <TypeText onChange={onChangeMock} values={values} id={id} name={name} />,
    );

    const textAreaFieldLabel = getByText(name);
    expect(textAreaFieldLabel).toBeDefined();

    const textAreaField = getByTestId('type-text');
    expect(textAreaField).toBeDefined();
    expect(textAreaField.props.value).toBe('Initial value');

    fireEvent.changeText(textAreaField, 'New value');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test.todo('should not show required sign if required param is false or undefined')

  test.todo('should show required sign if required param is true')
});
