import React from 'react';
import { render } from 'react-native-testing-library';
import { FieldLabel } from '../../../src/form/support';

describe('FieldLabel component', () => {
  it('renders label correctly', () => {
    const label = 'Question';

    const { getByText } = render(<FieldLabel label={label} />);

    const labelElement = getByText(label);
    expect(labelElement).toBeDefined();
  });
});
