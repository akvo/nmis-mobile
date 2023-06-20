import React from 'react';
import { render } from 'react-native-testing-library';
import App from '../App';
import { createExampleTable, addExample, getAllExamples } from '../src/database';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: () => null,
}));

jest.mock('expo-sqlite');
import * as SQLite from 'expo-sqlite';

describe('App', () => {
  test('renders App component without crashing', () => {
    render(<App />);
  });
});

describe('Expo SQLite', () => {
  let db;

  beforeAll(async () => {
    db = await SQLite.openDatabase('test.db');
  });

  afterAll(async () => {
    await db.close();
  });

  test('should create a table and insert data', async () => {
    await db.transaction(async (tx) => {
      tx.executeSql(createExampleTable);
      tx.executeSql(addExample, [
        'John Doe',
        1.9,
        JSON.stringify([
          {
            email: 'jhon@example.com',
          },
        ]),
      ]);
      tx.executeSql(addExample, [
        'Lorem',
        5.9,
        JSON.stringify([
          {
            email: 'lorem@example.com',
          },
        ]),
      ]);
      await new Promise((resolve) => {
        tx.executeSql(getAllExamples, [], (_, { rows }) => {
          expect(rows.length).toBe(2);
          expect(rows.item(0).name).toBe('John Doe');
          expect(rows.item(0).example_float).toBe(1.9);
          expect(rows.item(1).name).toBe('Lorem');
          expect(JSON.parse(rows.item(1).example_json), [
            {
              email: 'lorem@example.com',
            },
          ]);
          resolve();
        });
      });
    });
  });
});
