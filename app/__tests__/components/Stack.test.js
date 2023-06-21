import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Stack } from '../../src/components';

describe('Stack component', () => {
  test('renders correctly with style prop', () => {
    const { getByTestId } = render(
      <Stack>
        <View testID="child-1" />
        <View testID="child-2" />
      </Stack>,
    );

    const container = getByTestId('stack-container');
    expect(container.props.style).toEqual({
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      backgroundColor: '#f9fafb',
    });
  });
});
