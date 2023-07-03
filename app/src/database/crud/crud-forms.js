import { conn, query } from '../';

const db = conn.init;

const formsQuery = () => {
  const selectFormByIdAndVersion = async ({ id: formId, version }) => {
    const { rows } = await conn.tx(db, query.read('forms', { formId, version }, [formId, version]));
    if (!rows.length) {
      return false;
    }
    return rows._array[0];
  };

  return {
    selectFormByIdAndVersion,
    addFormsIfNotExist: async ({ id: formId, version, formJSON }) => {
      const formExist = await selectFormByIdAndVersion({ id: formId, version });
      if (formExist && formExist.version === version) {
        // update latest to false
        const updateQuery = query.update('forms', { formId, version }, { latest: 0 });
        return await conn.tx(db, updateQuery, [formId, version]);
      }
      // insert forms
      const insertQuery = query.insert('forms', {
        formId: formId,
        version: version,
        latest: 1,
        name: formJSON?.name || null,
        json: formJSON ? formJSON : null,
        createdAt: new Date().toISOString(),
      });
      return await conn.tx(db, insertQuery, []);
    },
  };
};

const crudForms = formsQuery();

export default crudForms;
