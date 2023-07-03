import crudUsers from '../crud-users';
jest.mock('expo-sqlite');

describe('crudUsers function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('selectUsers', () => {
    it('should return false if users does not exist', async () => {
      const result = await crudUsers.selectUsers();
      expect(result).toBe(false);
    });

    it('should return users', async () => {
      // Mock the result set for select
      const users = [
        {
          id: 1,
          name: 'John Doe',
          password: 'password',
        },
        {
          id: 2,
          name: 'John Doe Junior',
          password: 'password',
        },
      ];
      const mockSelectSql = jest.fn(() => users);
      crudUsers.selectUsers = mockSelectSql;
      const result = await crudUsers.selectUsers();
      expect(result).toEqual(users);
    });
  });
});
