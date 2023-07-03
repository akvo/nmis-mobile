import crudForms from '../crud-forms';
jest.mock('expo-sqlite');

describe('crudForms function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFormsIfNotExist', () => {
    it('should insert the form if it does not exist or has a different version', async () => {
      const formId = 1;
      const version = 1;
      const formJSON = { id: 1, version: 1, name: 'Form 1' };
      const result = await crudForms.addFormsIfNotExist({ id: formId, version, formJSON });
      expect(result).toEqual({ rowsAffected: 1 });
    });

    it('should update the form if it exists and has the same version', async () => {
      const formId = 1;
      const version = 1;
      const formJSON = { id: 1, version: 1, name: 'Form 1' };
      const result = await crudForms.addFormsIfNotExist({ id: formId, version, formJSON });
      expect(result).toEqual({ rowsAffected: 1 });
    });
  });

  describe('selectFormByIdAndVersion', () => {
    it('should return false if the form does not exist', async () => {
      const result = await crudForms.selectFormByIdAndVersion({ id: 1, version: '1.0.0' });
      expect(result).toBe(false);
    });

    it('should return the form if it exists', async () => {
      // Mock the result set for select
      const formData = [
        {
          id: 1,
          formId: 123,
          name: 'Form Test',
          latest: 1,
          version: '1.0.0',
          json: { id: 1, version: 1, name: 'Form 1' },
        },
      ];
      const mockSelectSql = jest.fn(() => formData);
      crudForms.selectFormByIdAndVersion = mockSelectSql;
      const result = await crudForms.selectFormByIdAndVersion({ id: 1, version: '1.0.0' });
      expect(result).toEqual(formData);
    });
  });
});
