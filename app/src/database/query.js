import {
  createUsersTable,
  createConfigTable,
  createFormsTable,
  createDatapointsTable,
} from './tables';
const insert = (table, data = {}) => {
  const fields = Object.keys(data).join(', ');
  const values = Object.values(data)
    .map((d) => d)
    .join(', ');
  const query = `INSERT INTO ${table}(${fields}) VALUES (${values})`;
  return query;
};

const update = (table, data = {}) => {
  const fields = Object.keys(data)
    .map((k) => {
      const val = data[k];
      return `${k} = ${val}`;
    })
    .join(', ');
  const query = `UPDATE ${table} SET ${fields} WHERE id = ?`;
  return query;
};

const read = (table, where = {}) => {
  let query = `SELECT * FROM ${table}`;
  if (Object.keys(where).length) {
    Object.keys(where).forEach((k, kx) => {
      if (kx === 0) {
        query += ` WHERE ${k} = ?`;
      } else {
        query += ` AND ${k} = ?`;
      }
    });
  }
  return query;
};

export const query = {
  insert,
  update,
  read,
};

export const initialQuery = () => {
  const queries = [createUsersTable, createConfigTable, createFormsTable, createDatapointsTable];
  return queries.join(' ');
};
