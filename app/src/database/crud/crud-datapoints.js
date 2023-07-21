import { conn, query } from '../';

const db = conn.init;

const selectDataPointById = async ({ id }) => {
  const { rows } = await conn.tx(db, query.read('datapoints', { id }), [id]);
  if (!rows.length) {
    return {};
  }
  const current = rows._array[0];
  return {
    ...current,
    json: JSON.parse(current.json.replace(/''/g, "'")),
  };
};

const dataPointsQuery = () => {
  return {
    selectDataPointById,
    selectDataPointsByFormAndSubmitted: async ({ form, submitted }) => {
      const { rows } = await conn.tx(db, query.read('datapoints', { form, submitted }), [
        form,
        submitted,
      ]);
      if (!rows.length) {
        return [];
      }
      return rows._array;
    },
    selectSubmissionToSync: async () => {
      const submitted = 1;
      const syncedAt = null;
      const { rows } = await conn.tx(db, query.read('datapoints', { submitted, syncedAt }), [
        submitted,
        syncedAt,
      ]);
      if (!rows.length) {
        return [];
      }
      return rows._array;
    },
    saveDataPoint: async ({ form, user, name, submitted, duration, json }) => {
      const insertQuery = query.insert('datapoints', {
        form,
        user,
        name,
        submitted,
        duration,
        createdAt: new Date().toISOString(),
        submittedAt: submitted ? new Date().toISOString() : null,
        json: json ? JSON.stringify(json).replace(/'/g, "''") : null,
      });
      return await conn.tx(db, insertQuery, []);
    },
    updateDataPoint: async ({ id, name, submitted, duration, submittedAt, syncedAt, json }) => {
      const updateQuery = query.update(
        'datapoints',
        { id },
        {
          name,
          submitted,
          duration,
          submittedAt,
          syncedAt,
          json: json ? JSON.stringify(json).replace(/'/g, "''") : null,
        },
      );
      return await conn.tx(db, updateQuery, [id]);
    },
  };
};

const crudDataPoints = dataPointsQuery();

export default crudDataPoints;
