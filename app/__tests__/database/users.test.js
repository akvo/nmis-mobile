jest.mock('expo-sqlite');
import * as SQLite from 'expo-sqlite';
import { users } from '../../src/database';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: () => null,
}));

describe('Users table', () => {
  let db;

  beforeAll(async () => {
    db = await SQLite.openDatabase('test.db');
    users.create(db);
  });

  afterAll(async () => {
    await db.close();
  });

  test('should users table exist when inserting', async () => {
    const name = 'Jhon Doe';
    const password = 'secret';
    users.add(db, name, password, (_, { insertId }) => {
      expect(insertId).toBe(1);
    });
  });

  test('should able to update name', async () => {
    const id = 1;
    const name = 'Jhon Cena';
    users.updateName(db, name, id);
    await users.getUser(db, 1, (_, { rows }) => {
      expect(rows.item(0).name).toBe(name);
    });
  });
});
