import { mockExecuteSql, mockResultSet } from 'expo-sqlite';
import { conn, query, initialQuery } from '../src/database';
jest.mock('expo-sqlite');

// Create or open a mock database connection
const db = conn.init;
describe('conn.tx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await conn.tx(db, initialQuery());
  });

  afterAll(async () => {
    await db.close();
  });

  test('should execute the insert transaction successfully', async () => {
    // Define the query and parameters for insert
    const table = 'users';
    const name = 'Jhon doe';
    const password = 'secret';
    const data = {
      name,
      password,
    };
    const insertQuery = query.insert(table, data);
    const insertParams = [];
    // Execute the insert transaction
    const insertResultSet = await conn.tx(db, insertQuery, insertParams);

    // Assertions
    expect(insertResultSet).toEqual(mockResultSet);
    expect(db.transaction).toHaveBeenCalled();
    expect(mockExecuteSql).toHaveBeenCalledWith(
      insertQuery,
      insertParams,
      expect.any(Function),
      expect.any(Function),
    );
  });

  test('should execute the update transaction successfully', async () => {
    // Define the query and parameters for update
    const table = 'users';
    const name = 'Jhon Lenon';
    const where = { id: 1 };
    const data = { name };
    const updateQuery = query.update(table, where, data);
    const updateParams = [];

    // Execute the update transaction
    const updateResultSet = await conn.tx(db, updateQuery, updateParams);

    // Assertions
    expect(updateResultSet).toEqual(mockResultSet);
    expect(db.transaction).toHaveBeenCalled();
    expect(mockExecuteSql).toHaveBeenCalledWith(
      updateQuery,
      updateParams,
      expect.any(Function),
      expect.any(Function),
    );
  });

  test('should execute the select transaction successfully', async () => {
    // Mock the result set for select
    const mockRows = [{ id, name: 'John Lenon' }];
    const mockSelectSql = jest.fn((query, params, successCallback) => {
      successCallback(null, { rows: { length: mockRows.length, _array: mockRows } });
    });
    db.transaction.mockImplementation((transactionFunction) => {
      transactionFunction({
        executeSql: mockSelectSql,
      });
    });

    // Define the query and parameters for select
    const table = 'users';
    const id = 1;
    const where = { id };
    const selectQuery = query.read(table, where);
    const selectParams = [id];

    // Execute the select transaction
    const result = await conn.tx(db, selectQuery, selectParams);

    // Assertions
    expect(result.rows).toHaveLength(mockRows.length);
    expect(result.rows._array).toEqual(mockRows);
    expect(db.transaction).toHaveBeenCalled();
    expect(mockSelectSql).toHaveBeenCalledWith(
      selectQuery,
      selectParams,
      expect.any(Function),
      expect.any(Function),
    );
  });
});
