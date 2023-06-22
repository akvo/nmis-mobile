import React from 'react';
import { render } from 'react-native-testing-library';
import { FieldGroupHeader } from '../../../src/form/support';

describe('FieldGroupHeader component', () => {
  it('renders name and description correctly', () => {
    const name = 'Group Title';
    const description = 'Group description';

    const { getByText } = render(<FieldGroupHeader name={name} description={description} />);

    const nameElement = getByText(name);
    expect(nameElement).toBeDefined();

    const descriptionElement = getByText(description);
    expect(descriptionElement).toBeDefined();
  });
});
