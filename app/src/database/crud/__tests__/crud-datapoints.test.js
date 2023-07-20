import crudDataPoints from '../crud-datapoints';
jest.mock('expo-sqlite')

describe('crudDataPoints function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('selectDataPointById should return the correct data point when given a valid ID', () => {
    return new Error();
  });

  test.todo('selectDataPointById should return an empty array when given an invalid ID');

  test.todo('selectSubmittedDatapoints should return the correct list of submitted data points');

  test.todo('selectSavedDatapoints should return the correct list of saved data points');

  test.todo('saveDataPoint should save the data point to the database correctly');

  test.todo('updateDataPoint should update the data point in the database correctly');
})
