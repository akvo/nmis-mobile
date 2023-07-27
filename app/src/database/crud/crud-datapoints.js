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
    selectDataPointsByFormAndSubmitted: async ({ form, submitted, user }) => {
      const columns = user ? { form, submitted, user } : { form, submitted };
      const params = user ? [form, submitted, user] : [form, submitted];
      const { rows } = await conn.tx(db, query.read('datapoints', { ...columns }), [...params]);
      if (!rows.length) {
        return [];
      }
      return rows._array;
    },
    selectSubmissionToSync: async () => {
      const submitted = 1;
      const { rows } = await conn.tx(
        db,
        'SELECT * FROM datapoints WHERE submitted = ? AND syncedAt IS NULL',
        [submitted],
      );
      if (!rows.length) {
        return [];
      }
      return rows._array;
    },
    saveDataPoint: async ({ form, user, name, submitted, duration, json }) => {
      const submittedAt = submitted ? { submittedAt: new Date().toISOString() } : {};
      const insertQuery = query.insert('datapoints', {
        form,
        user,
        name,
        submitted,
        duration,
        createdAt: new Date().toISOString(),
        ...submittedAt,
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
