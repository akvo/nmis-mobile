const insert = (table, data = {}) => {
  const fields = Object.keys(data);
  const valuesString = fields.map((key) => isNaN(data[key]) ? `'${data[key]}'` : data[key]).join(', ');
  const fieldsString = fields.join(', ');
  return `INSERT INTO ${table}(${fieldsString}) VALUES (${valuesString});`;
};

const update = (table, where = {}, data = {}) => {
  const fieldString = Object.keys(data)
    .map((key) => isNaN(data[key]) ? `${key} = '${data[key]}'` : `${key} = ${data[key]}`)
    .join(', ');
  const conditions = Object.keys(where).map((key) => `${key} = ?`);
  const conditionString = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `UPDATE ${table} SET ${fieldString} ${conditionString};`;
};

const read = (table, where = {}) => {
  const conditions = Object.keys(where).map((key) => `${key} = ?`);
  const conditionString = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `SELECT * FROM ${table} ${conditionString};`;
};

const clear = (table) => {
  return `DELETE FROM ${table};`;
};

const drop = (table) => {
  return `DROP TABLE IF EXISTS ${table};`;
};

const initialQuery = (tableName, columns) => {
  const fields = Object.keys(columns).map((key) => `${key} ${columns[key]}`);
  const fieldsString = fields.join(', ');
  return `CREATE TABLE IF NOT EXISTS ${tableName}(${fieldsString});`;
};
export const query = {
  insert,
  update,
  read,
  clear,
  drop,
  initialQuery,
};
