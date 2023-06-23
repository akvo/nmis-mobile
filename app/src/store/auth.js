import { Store } from 'pullstate';

export const AuthStore = new Store({
  authenticationType: ['assesment', 'username_password'],
  authenticationCode: '',
  serverUrl: 'http://api.example.com/nmis',
});
