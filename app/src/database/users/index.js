import * as Crypto from 'expo-crypto';
import {
  createUserTable,
  addUser,
  updateUserName,
  updateUserPassword,
  getUserById,
  verifyUser,
} from './query';

const create = (db) => {
  db.transaction((tx) => {
    tx.executeSql(createUserTable);
  });
};
const add = async (db, name, password, success, error = null) => {
  const passwordEncrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    password,
  );
  db.transaction((tx) => {
    tx.executeSql(addUser, [name, passwordEncrypted], success, error);
  });
};

const updateName = (db, name, id) => {
  return db.transaction((tx) => {
    tx.executeSql(updateUserName, [name, id]);
  });
};

const updatePassword = async (db, password, id) => {
  const passwordEncrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    password,
  );

  return db.transaction((tx) => {
    tx.executeSql(updateUserPassword, [passwordEncrypted, id]);
  });
};
const getUser = (db, id, success = null, error = null) => {
  db.transaction((tx) => {
    tx.executeSql(getUserById, [id], success, error);
  });
};
const verify = async (db, name, password) => {
  const passwordEncrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    password,
  );

  db.transaction((tx) => {
    tx.executeSql(verifyUser, [name, passwordEncrypted]);
  });
};

export const users = {
  create,
  add,
  updateName,
  updatePassword,
  getUser,
  verify,
};
