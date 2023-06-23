import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

const openDatabase = () => {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  const db = SQLite.openDatabase('db.db');
  return db;
};

const init = openDatabase();

const tx = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (transaction) => {
        transaction.executeSql(
          query,
          params,
          (_, resultSet) => {
            resolve(resultSet);
          },
          (_, error) => {
            reject(error);
            return false; // Rollback the transaction
          },
        );
      },
      (error) => {
        reject(error);
      },
    );
  });
};

export const conn = {
  init,
  tx,
};
