import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import ManageFormPage from '../ManageForm';

jest.mock('@react-navigation/native');

describe('ManageFormPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<ManageFormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should navigate to page successfully', () => {
    const navigation = useNavigation();
    const mockParams = {
      params: {
        id: 1,
        name: 'Health Facilities',
        showSubmitted: false,
      },
    };
    const { getByTestId } = render(<ManageFormPage navigation={navigation} route={mockParams} />);

    const listItemEl = getByTestId('goto-item-0');
    expect(listItemEl).toBeDefined();
    fireEvent.press(listItemEl);

    expect(navigation.navigate).toHaveBeenCalledWith('FormPage', mockParams.params);
  });
});
