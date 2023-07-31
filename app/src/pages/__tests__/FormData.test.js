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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
        submitted: 1,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      const list0 = wrapper.getByTestId('card-touchable-0');
      expect(list0.props.children[0].props.title).toEqual('Datapoint 1');
      expect(list0.props.children[0].props.subTitles[0]).toEqual('Created: 18/07/2023');
      expect(list0.props.children[0].props.subTitles[1]).toEqual('Survey duration: 02h 25m');
      expect(list0.props.children[0].props.subTitles[2]).toEqual('Synced: 18/07/2023');
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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: null,
        submitted: 0,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      const list0 = wrapper.getByTestId('card-touchable-0');
      expect(list0.props.children[0].props.title).toEqual('Datapoint 1');
      expect(list0.props.children[0].props.subTitles[0]).toEqual('Created: 18/07/2023');
      expect(list0.props.children[0].props.subTitles[1]).toEqual('Survey duration: 02h 25m');
      expect(list0.props.children[0].props.subTitles[2]).toEqual(undefined);
    });
  });

  it('should have search input field', () => {
    const mockData = [
      {
        id: 1,
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
      },
    ];
    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);
    const wrapper = render(<FormDataPage />);
    expect(wrapper.queryByTestId('search-bar')).toBeTruthy();
  });

  it('should filter list of datapoint by search value', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
      },
      {
        id: 2,
        name: 'Datapoint 2',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage />);

    const searchField = wrapper.getByTestId('search-bar');
    expect(searchField).toBeDefined();
    fireEvent.changeText(searchField, 'Datapoint 1');

    await waitFor(() => {
      const list0 = wrapper.queryByTestId('card-touchable-0');
      expect(list0).toBeTruthy();

      const list1 = wrapper.queryByTestId('card-touchable-1');
      expect(list1).toBeFalsy();
    });
  });

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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
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

  it('should not render render sync button on Saved FormData page', async () => {
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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
        submitted: 1,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      // check sync button rendered
      expect(wrapper.queryByTestId('button-to-trigger-sync')).toBeFalsy();
      const list0 = wrapper.getByTestId('card-touchable-0');
      expect(list0).toBeTruthy();
    });
  });

  it('should render render sync button on Submitted FormData page', async () => {
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
        name: 'Datapoint 1',
        createdAt: '2023-07-18T12:34:56.789Z',
        duration: 145,
        syncedAt: '2023-07-18T13:00:00.000Z',
        submitted: 1,
      },
    ];

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue(mockData);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      // check sync button rendered
      expect(wrapper.getByTestId('button-to-trigger-sync')).toBeTruthy();
      const list0 = wrapper.getByTestId('card-touchable-0');
      expect(list0).toBeTruthy();
    });
  });

  it('should disable sync button if no data on Submitted FormData page', async () => {
    const mockRoute = {
      params: {
        id: 123,
        name: 'Form Name',
        showSubmitted: true,
      },
    };

    crudDataPoints.selectDataPointsByFormAndSubmitted.mockResolvedValue([]);

    const wrapper = render(<FormDataPage route={mockRoute} />);

    await waitFor(() => {
      expect(wrapper.getByText('Form Name')).toBeTruthy();
      // check sync button rendered
      const syncButtonElement = wrapper.getByTestId('button-to-trigger-sync');
      expect(syncButtonElement).toBeTruthy();
      expect(syncButtonElement.props.accessibilityState.disabled).toEqual(true);
      const list0 = wrapper.queryByTestId('card-touchable-0');
      expect(list0).toBeFalsy();
    });
  });

  it.todo('should handle sync submission when sync button pressed');
});
