import { Store } from 'pullstate';

export const AppStore = new Store({
  currentPage: 'GetStarted',
  lang: 'en',
  online: false,
});
