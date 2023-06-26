import { Store } from 'pullstate';

export const UIStore = new Store({
  isDarkMode: false, // if isDarkMode = false then Theme= light
  lang: 'en',
  fontSize: 'default',
});
