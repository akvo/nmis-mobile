import { Store } from 'pullstate';

export const BuildParamsStore = new Store({
  debugMode: false,
  dataSyncInterval: 300,
  errorHandling: true,
  loggingLevel: 'verbose',
  appVersion: '1.0.0',
});
