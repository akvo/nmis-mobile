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
  visitedQuestionGroup: [], // to store visited question group id
  dataPointName: [],
  surveyDuration: 0,
});

export default FormState;
