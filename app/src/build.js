import { SERVER_URL } from '@env';
import build_json from './build.json';

const defaultBuildParams = {
  authenticationType: ['code_assignment', 'username', 'password'],
  ...build_json,
  serverURL: SERVER_URL,
};

export default defaultBuildParams;
