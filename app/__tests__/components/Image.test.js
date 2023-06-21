import React from 'react';
import { render } from '@testing-library/react-native';
import { Image } from '../../src/components';

describe('Image', () => {
  test('renders an image with the correct URL', () => {
    const imageURL = 'https://example.com/image.jpg';
    const { getByTestId } = render(<Image src={imageURL} />);

    const imageComponent = getByTestId('image-component');
    expect(imageComponent.props.source.uri).toBe(imageURL);
  });
});
