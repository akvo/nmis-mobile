import {
  createUsersTable,
  createConfigTable,
  createFormsTable,
  createDatapointsTable,
} from './tables';
const insert = (table, data = {}) => {
  const fields = Object.keys(data);
  const valuesString = fields.map((key) => data[key]).join(', ');
  const fieldsString = fields.join(', ');
  return `INSERT INTO ${table}(${fieldsString}) VALUES (${valuesString})`;
};

const update = (table, where = {}, data = {}) => {
  const fieldString = Object.keys(data)
    .map((key) => `${key} = ${data[key]}`)
    .join(', ');
  const conditions = Object.keys(where).map((key) => `${key} = ?`);
  const conditionString = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `UPDATE ${table} SET ${fieldString} ${conditionString}`;
};

const read = (table, where = {}) => {
  const conditions = Object.keys(where).map((key) => `${key} = ?`);
  const conditionString = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `SELECT * FROM ${table} ${conditionString}`;
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
