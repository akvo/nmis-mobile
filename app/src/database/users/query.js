export const createUserTable =
  'CREATE TABLE IF NOT EXISTS users(id integer primary key not null,name text,password text);';

export const addUser = 'INSERT INTO users(name, password) values (?,?);';

export const updateUserName = 'UPDATE users SET name = ? WHERE id = ?;';

export const updateUserPassword = 'UPDATE users SET password = ? WHERE id = ?;';

export const getUserById = 'SELECT id, name FROM users WHERE id = ?;';

export const getAllUsers = 'SELECT * from users';

export const verifyUser = 'SELECT id, name FROM users WHERE name = ? and password = ?;';
