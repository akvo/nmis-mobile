import { Store } from 'pullstate';

export const FormStore = new Store({
  form: {},
  questionGroups: [],
  questions: [],
  allSynced: false,
});
