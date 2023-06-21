export const createUserTable =
  'CREATE TABLE IF NOT EXISTS users(id integer primary key not null,name text,password text);';

export const addUser = 'INSERT INTO users(name, password) values (?,?);';

export const updateUserName = 'UPDATE users SET name = ? WHERE id = ?;';

export const updateUserPassword = 'UPDATE users SET password = ? WHERE id = ?;';

export const getCurrentUser = 'SELECT id, name FROM users WHERE id = ?;';

export const verifyUser = 'SELECT id, name FROM users WHERE password = ?;';
