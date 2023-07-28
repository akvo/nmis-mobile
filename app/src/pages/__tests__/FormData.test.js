import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import FormDataPage from '../FormData';
import crudDataPoints from '../../database/crud/crud-datapoints';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');
jest.mock('../../database/crud/crud-datapoints');

describe('FormDataPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    const mockData = [
      {
        id: 1,
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: '30 minutes',
        syncedAt: '2023-07-18T13:00:00.000Z',
      },
    ];
    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);
    const tree = render(<FormDataPage />);
    await waitFor(() => expect(tree.toJSON()).toMatchSnapshot());
  });

  it('should show list of submitted datapoints', async () => {
    const mockRoute = {
      params: {
        id: 123,
        name: 'Form Name',
        showSubmitted: true,
      },
    };

    const mockData = [
      {
        id: 1,
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: '30 minutes',
        syncedAt: '2023-07-18T13:00:00.000Z',
        submitted: 1,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      expect(wrapper.getByText('Created: 18/07/2023')).toBeTruthy();
      expect(wrapper.getByText('Survey duration: 30 minutes')).toBeTruthy();
      expect(wrapper.getByText('Synced: 18/07/2023')).toBeTruthy();
    });
  });

  it('should show list of saved datapoints', async () => {
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
        syncedAt: null,
        submitted: 0,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      expect(wrapper.getByText('Created: 18/07/2023')).toBeTruthy();
      expect(wrapper.getByText('Survey Duration: 30 minutes')).toBeTruthy();
      expect(wrapper.queryByText('Sync: -')).toBeFalsy();
    });
  });

  it('should have search input field', () => {
    const mockData = [
      {
        id: 1,
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: '30 minutes',
        syncedAt: '2023-07-18T13:00:00.000Z',
      },
    ];
    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);
    const wrapper = render(<FormDataPage />);
    expect(wrapper.queryByTestId('search-bar')).toBeTruthy();
  });

  it.todo('should filter list of datapoint by search value');

  it('should navigate to FormPage with correct route params when datapoint list pressed', async () => {
    const mockNavigation = useNavigation();
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
        syncedAt: null,
        submitted: 0,
      },
    ];
    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      const cardElement = wrapper.getByTestId('card-touchable-0');
      fireEvent.press(cardElement);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('FormPage', {
      ...mockRoute.params,
      dataPointId: 1,
      newSubmission: false,
    });
  });
});
