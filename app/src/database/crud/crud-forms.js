import { conn, query } from '../';

const db = conn.init;

const formsQuery = () => {
  return {
    selectLatestFormVersion: async () => {
      const latest = 1;
      const { rows } = await conn.tx(db, query.read('forms', { latest }), [latest]);
      if (!rows.length) {
        return [];
      }
      return rows._array.map((x) => ({
        ...x,
        json: JSON.parse(x.json.replace(/''/g, "'")),
      }));
    },
    selectFormById: async ({ id }) => {
      const { rows } = await conn.tx(db, query.read('forms', { id }), [id]);
      if (!rows.length) {
        return {};
      }
      const current = rows._array[0];
      return {
        ...current,
        json: JSON.parse(current.json.replace(/''/g, "'")),
      };
    },
    selectFormByIdAndVersion: async ({ id: formId, version }) => {
      const { rows } = await conn.tx(db, query.read('forms', { formId, version }), [
        formId,
        version,
      ]);
      if (!rows.length) {
        return false;
      }
      return rows._array[0];
    },
    addForm: async ({ id: formId, version, formJSON }) => {
      const insertQuery = query.insert('forms', {
        formId: formId,
        version: version,
        latest: 1,
        name: formJSON?.name || null,
        json: formJSON ? JSON.stringify(formJSON).replace(/'/g, "''") : null,
        createdAt: new Date().toISOString(),
      });
      return await conn.tx(db, insertQuery, []);
    },
    updateForm: async ({ id: formId, latest = 0 }) => {
      // update latest to false
      const updateQuery = query.update('forms', { formId }, { latest: latest });
      return await conn.tx(db, updateQuery, [formId]);
    },
  };
};

const crudForms = formsQuery();

export default crudForms;
