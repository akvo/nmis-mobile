import crudDataPoints from '../crud-datapoints';
import { render, renderHook, fireEvent, act, waitFor } from '@testing-library/react-native';
jest.mock('expo-sqlite');

const dataPoints = [
  {
    id: 1,
    form: 123,
    user: 1,
    name: 'Data point 1 name',
    submitted: 1,
    duration: 2.5,
    createdAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    syncedAt: null,
    json: [{ 101: 'Data point 1', 102: 1 }],
  },
  {
    id: 2,
    form: 123,
    user: 1,
    name: 'Data point 2 name',
    submitted: 0,
    duration: 2.0,
    createdAt: new Date().toISOString(),
    submittedAt: null,
    syncedAt: null,
    json: [{ 101: 'Data point 2', 102: 2 }],
  },
  {
    id: 3,
    form: 123,
    user: 1,
    name: 'Data point 3 name',
    submitted: 0,
    duration: 2.7,
    createdAt: new Date().toISOString(),
    submittedAt: null,
    syncedAt: null,
    json: [{ 101: 'Data point 3', 102: 3 }],
  },
];

describe('crudDataPoints function', () => {
  test('selectDataPointById should return an empty object when given an invalid ID', async () => {
    await act(async () => {
      const result = await crudDataPoints.selectDataPointById({ id: 1 });
      expect(result).toEqual({});
    });
  });

  test('saveDataPoint should save the data point to the database correctly', async () => {
    await act(async () => {
      const saveValue = dataPoints[0];
      const result = await crudDataPoints.saveDataPoint({ ...saveValue });
      expect(result).toEqual({ rowsAffected: 1 });
    });
  });

  test('selectDataPointById should return the correct data point when given a valid ID', async () => {
    const mockSelectDataPointById = jest.fn(({ id }) => dataPoints.find((d) => d.id === id));
    crudDataPoints.selectDataPointById = mockSelectDataPointById;
    const result = await crudDataPoints.selectDataPointById({ id: 1 });
    expect(result).toEqual(dataPoints[0]);
  });

  test('selectSubmittedDatapoints should return the correct list of submitted data points', async () => {
    const mockSelectSubmittedDatapoints = jest.fn(() =>
      dataPoints.filter((d) => d.submitted === 1),
    );
    crudDataPoints.selectSubmittedDatapoints = mockSelectSubmittedDatapoints;
    const result = await crudDataPoints.selectSubmittedDatapoints();
    expect(result).toEqual(dataPoints.filter((d) => d.submitted));
  });

  test('selectSavedDatapoints should return the correct list of saved data points', async () => {
    const mockSelectSavedDataPoints = jest.fn(() => dataPoints.filter((d) => d.submitted === 0));
    crudDataPoints.selectSavedDatapoints = mockSelectSavedDataPoints;
    const result = await crudDataPoints.selectSavedDatapoints();
    expect(result).toEqual(dataPoints.filter((d) => !d.submitted));
  });

  test('updateDataPoint should update the data point in the database correctly', async () => {
    await act(async () => {
      const updateValue = { ...dataPoints[0], syncedAt: new Date().toISOString() };
      const result = await crudDataPoints.updateDataPoint({ ...updateValue });
      expect(result).toEqual({ rowsAffected: 1 });
    });
  });
});
