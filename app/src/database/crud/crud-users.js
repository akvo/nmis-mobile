import { conn, query } from '../';

const db = conn.init;

const usersQuery = () => {
  return {
    selectUsers: async () => {
      try {
        const { rows } = await conn.tx(db, query.read('users', []));
        if (!rows.length) {
          return false;
        }
        return rows._array;
      } catch (error) {
        console.error('Get users', error);
        return false;
      }
    },
  };
};

const crudUsers = usersQuery();

export default crudUsers;
