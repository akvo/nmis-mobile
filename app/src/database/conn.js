import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
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
        if (Array.isArray(query)) {
          const results = [];
          query.forEach(async (q) => {
            transaction.executeSql(q, params, (_, resultSet) => {
              results.push(resultSet); // Store the result set in the array
            });
          });
          resolve(results);
        } else {
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
        }
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const openDBfile = async (databaseFile, databaseName) => {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(databaseFile).uri,
    FileSystem.documentDirectory + `SQLite/${databaseName}.db`,
  );
  return SQLite.openDatabase(`${databaseName}.db`);
};

export const conn = {
  file: (dbFile, dbName) => openDBfile(dbFile, dbName),
  init,
  tx,
};
