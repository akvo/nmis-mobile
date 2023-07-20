import React from 'react';
import renderer from 'react-test-renderer';
import { render, waitFor } from '@testing-library/react-native';
import FormDataPage from '../FormData';
import crudDataPoints from '../../database/crud/crud-datapoints';

jest.mock('../../database/crud/crud-datapoints');

describe('FormDataPage', () => {
  const mockRoute = {
    params: {
      id: 123,
      name: 'Form Name',
      showSubmitted: false,
    },
  };

  const mockData = [
    {
      id: 1,
      createdAt: '2023-07-18T12:34:56.789Z',
      duration: '30 minutes',
      syncedAt: '2023-07-18T13:00:00.000Z',
    },
  ];

  crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

  test('renders correctly', () => {
    const tree = renderer.create(<FormDataPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with mocked data', async () => {
    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      expect(wrapper.getByText('Created: 18/07/2023')).toBeTruthy();
      expect(wrapper.getByText('Survey Duration: 30 minutes')).toBeTruthy();
      expect(wrapper.getByText('Sync: 18/07/2023')).toBeTruthy();
    });
  });
});
