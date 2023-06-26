import { Store } from 'pullstate';

export const BuildParamsStore = new Store({
  authenticationType: ['code_assignment', 'username', 'password'],
  serverURL: 'https://api.example.com/nmis',
  debugMode: false,
  dataSyncInterval: 300,
  errorHandling: true,
  loggingLevel: 'verbose',
  appVersion: '1.0.0',
});
