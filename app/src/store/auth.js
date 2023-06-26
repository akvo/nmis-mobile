import { Store } from 'pullstate';
/**
 * Server config
 */
export const AuthStore = new Store({
  authenticationTypes: ['assesment', 'username_password'], // list of authentication method
  authenticationType: 'assesment', // active type or current implementation of authentication type
  authenticationCode: '',
  serverUrl: 'http://api.example.com/nmis',
  username: '',
  password: '',
});
