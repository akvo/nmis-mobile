import { Store } from 'pullstate';

const UIState = new Store({
  isDarkMode: false, // if isDarkMode = false then Theme= light
  lang: 'en',
  fontSize: 'default',
  currentPage: 'GetStarted',
  online: false,
});

export default UIState;
