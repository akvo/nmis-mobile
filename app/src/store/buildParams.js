import { Store } from 'pullstate';
import defaultBuildParams from '../build.json';

const BuildParamsState = new Store({
  authenticationType: defaultBuildParams?.authenticationType || [
    'code_assignment',
    'username',
    'password',
  ],
  serverURL: defaultBuildParams?.serverURL || 'https://api.example.com/nmis',
  debugMode: defaultBuildParams?.debugMode || false,
  dataSyncInterval: defaultBuildParams?.dataSyncInterval || 300,
  errorHandling: defaultBuildParams?.errorHandling || true,
  loggingLevel: defaultBuildParams?.loggingLevel || 'verbose',
  appVersion: defaultBuildParams?.appVersion || '1.0.0',
});

export default BuildParamsState;
