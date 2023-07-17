import React from 'react';
import renderer from 'react-test-renderer';
import { act, render, renderHook, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import ManageFormPage from '../ManageForm';
import { FormState } from '../../store';

jest.mock('@react-navigation/native');

describe('ManageFormPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<ManageFormPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should navigate to page and update formState successfully', async () => {
    const navigation = useNavigation();
    const mockParams = {
      params: {
        id: 1,
        name: 'Health Facilities',
      },
    };
    const { getByTestId } = render(<ManageFormPage navigation={navigation} route={mockParams} />);

    const listItemEl = getByTestId('goto-item-0');
    expect(listItemEl).toBeDefined();
    fireEvent.press(listItemEl);

    act(() => {
      FormState.update((s) => {
        s.form = mockParams.params;
      });
    });

    await waitFor(() => {
      const { result } = renderHook(() => FormState.useState());
      const { form: formSelected } = result.current;
      expect(formSelected).toBe(mockParams.params);
      expect(navigation.navigate).toHaveBeenCalledWith('FormPage', mockParams.params);
    });
  });
});
