import { Store } from 'pullstate';

const FormState = new Store({
  form: {},
  questionGroups: [],
  questions: [],
  currentGroup: 1,
  saved: false,
  submitted: false,
  currentValues: {},
});

export default FormState;
