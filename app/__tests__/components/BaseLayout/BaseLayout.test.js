import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BaseLayout } from '../../../src/components';

describe('BaseLayout component', () => {
  it('renders page without props correctly', () => {
    const { getByTestId } = render(<BaseLayout />);
    const stackElement = getByTestId('stack-container');
    expect(stackElement).toBeDefined();
  });

  it('renders page with title correctly', () => {
    const title = 'Example Title';
    const { getByText, getByTestId } = render(<BaseLayout title={title} />);

    const titleElement = getByText(title);
    expect(titleElement).toBeDefined();
  });

  it('renders page with search bar correctly', () => {
    const search = {
      placeholder: 'Search here...',
      show: true,
    };
    const { getByPlaceholderText, getByTestId } = render(<BaseLayout search={search} />);
    const searchBarElement = getByTestId('search-bar');
    expect(searchBarElement).toBeDefined();

    const searchPlaceholderElement = getByPlaceholderText(search.placeholder);
    expect(searchPlaceholderElement).toBeDefined();
  });

  test('calls onPress function when back button is pressed', () => {
    const title = 'Example Title';
    const onPressMock = jest.fn();
    const { getByTestId } = render(<BaseLayout title={title} back={onPressMock} />);
    const button = getByTestId('arrow-back-button');

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
