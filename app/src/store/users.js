import { Store } from 'pullstate';

export const UserStore = new Store({
  id: null,
  name: '',
  token: null,
  preferences: {},
});
