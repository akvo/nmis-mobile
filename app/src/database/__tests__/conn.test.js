import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { act, renderHook, waitFor, fireEvent } from '@testing-library/react-native';
import { conn } from '../conn';
import exampledb from 'assets/example.db';

jest.mock('expo-asset', () => {
  return {
    Asset: {
      fromModule: jest.fn((module) => ({
        uri: `mocked-uri-for-${module}`,
      })),
    },
  };
});

jest.mock('expo-file-system', () => {
  return {
    getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
    makeDirectoryAsync: jest.fn(),
    downloadAsync: jest.fn(),
  };
});

describe('openDBFile', () => {
  it('should have db connection from file', async () => {
    const dbFile = exampledb;
    const db = await conn.file(dbFile, 'example');

    await waitFor(() => {
      expect(db.transaction).toBeDefined();
    });
  });
});
