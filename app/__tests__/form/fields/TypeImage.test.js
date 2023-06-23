import React from 'react';
import { render } from 'react-native-testing-library';
import { TypeImage } from '../../../src/form/fields';

describe('TypeImage component', () => {
  it('renders correctly', () => {
    const { getByTestId, queryByTestId } = render(<TypeImage onChange={() => jest.fn()} />);

    const fieldLabel = getByTestId('field-label');
    expect(fieldLabel).toBeDefined();

    const btnSelectFile = getByTestId('btn-select-file');
    expect(btnSelectFile).toBeDefined();

    const btnRemove = getByTestId('btn-remove');
    expect(btnRemove).toBeDefined();

    const imagePreview = queryByTestId('image-preview');
    expect(imagePreview).toBeNull();
  });
});
