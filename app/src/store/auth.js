import { Store } from 'pullstate';
/**
 * Server config
 */
export const AuthStore = new Store({
  authenticationCode: '',
  useAuthenticationCode: false, // using code for authentication
  username: '',
  password: '',
});
