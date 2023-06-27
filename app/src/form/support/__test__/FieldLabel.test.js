import React from 'react';
import { render } from 'react-native-testing-library';
import FieldLabel from '../FieldLabel';

describe('FieldLabel component', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<FieldLabel keyform={0} name="Question Name" />);
    const labelElement = getByText('1. Question Name');
    expect(labelElement).toBeDefined();
  });
});
