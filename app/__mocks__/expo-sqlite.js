export const openDatabase = jest.fn().mockReturnValue({
  transaction: jest.fn(),
  close: jest.fn(),
});
