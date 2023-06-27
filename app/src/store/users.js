import { Store } from 'pullstate';

const UserState = new Store({
  id: null,
  name: '',
  token: null,
  syncWifiOnly: false,
  syncInterval: 300,
  forms: [],
});

export default UserState;
