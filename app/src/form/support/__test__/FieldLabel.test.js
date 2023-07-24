import React from 'react';
import { render } from 'react-native-testing-library';
import FieldLabel from '../FieldLabel';

describe('FieldLabel component', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<FieldLabel keyform={0} name="Question Name" />);
    const labelElement = getByText('1. Question Name');
    expect(labelElement).toBeDefined();
  });

  it('should not show required sign if requiredSign param is null', () => {
    const wrapper = render(<FieldLabel keyform={0} name="Question Name" />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeFalsy();
  });

  it('should show required sign if requiredSign param is not null', () => {
    const wrapper = render(<FieldLabel keyform={0} name="Question Name" requiredSign="*" />);
    const requiredIcon = wrapper.queryByTestId('field-required-icon');
    expect(requiredIcon).toBeTruthy();
  });
});
