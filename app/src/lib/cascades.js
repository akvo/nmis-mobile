import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { conn, query } from '../database';

const DIR_NAME = 'SQLite';

const createSqliteDir = async () => {
  /**
   * Setup sqlite directory to save cascades sqlite from server
   */
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + DIR_NAME)).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + DIR_NAME);
  }
};

const download = async (downloadUrl, fileUrl) => {
  const pathSql = fileUrl.replace(/\/sqlite\//, `${DIR_NAME}/`);
  // download file if not exists
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + pathSql)).exists) {
    const results = await FileSystem.downloadAsync(
      downloadUrl,
      FileSystem.documentDirectory + pathSql,
    );
    return results;
  }
};

const loadDataSource = async (source) => {
  const { file: cascadeName } = source;
  const db = SQLite.openDatabase(cascadeName);
  const readQuery = query.read('nodes');
  const result = await conn.tx(db, readQuery);
  return result;
};

export default cascades = {
  createSqliteDir,
  loadDataSource,
  download,
};
