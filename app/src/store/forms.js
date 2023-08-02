import { Store } from 'pullstate';

const FormState = new Store({
  form: {},
  currentValues: {}, // answers
  questionGroupListCurrentValues: {}, // answers for question group list component
  visitedQuestionGroup: [], // to store visited question group id
  dataPointName: [],
  surveyDuration: 0,
});

export default FormState;
