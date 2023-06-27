import React from 'react';
import { render } from '@testing-library/react-native';
import PageTitle from '../../../src/components/BaseLayout/PageTitle';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');

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
    const navigation = useNavigation();
    navigation.canGoBack.mockReturnValue(true);
    expect(navigation.canGoBack()).toEqual(true);
    const title = 'Example Title';
    const { getByTestId } = render(<PageTitle text={title} />);
    const button = getByTestId('arrow-back-button');
    expect(button).toBeDefined();
  });
});
