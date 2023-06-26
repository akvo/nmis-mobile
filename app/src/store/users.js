import { Store } from 'pullstate';

export const UserStore = new Store({
  id: null,
  name: '',
  token: null,
  syncWifiOnly: false,
  syncInterval: 300,
  forms: [],
});
