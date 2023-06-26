import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PageTitle from '../../../src/components/BaseLayout/PageTitle';

describe('PageTitle component', () => {
  it('renders page title and more options button correctly', () => {
    const title = 'Example Title';
    const { getByText, getByTestId } = render(<PageTitle text={title} />);

    const titleElement = getByText(title);
    expect(titleElement).toBeDefined();
    const moreOptionsEl = getByTestId('more-options-button');

    expect(moreOptionsEl).toBeDefined();
  });

  test('calls onPress function when back button is pressed', () => {
    const title = 'Example Title';
    const onPressMock = jest.fn();
    const { getByTestId } = render(<PageTitle text={title} />);
    const button = getByTestId('arrow-back-button');

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
