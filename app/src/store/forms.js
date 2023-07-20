import { Store } from 'pullstate';

const FormState = new Store({
  form: {},
  questionGroups: [],
  questions: [],
  currentGroup: 1,
  saved: false,
  submitted: false,
  currentValues: {}, // answers
  questionGroupListCurrentValues: {}, // answers for question group list component
});

export default FormState;
