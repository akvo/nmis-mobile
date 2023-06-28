import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  questionGroupContainer: {
    marginBottom: 20,
  },
  fieldGroupHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  fieldGroupName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fieldGroupDescription: {
    paddingTop: 20,
    paddingVertical: 15,
    fontSize: 14,
  },
  questionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  validationErrorText: {
    paddingHorizontal: 10,
    marginTop: -15,
    color: 'red',
    fontStyle: 'italic',
  },
  fieldLabel: {
    paddingHorizontal: 10,
    marginBottom: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  inputFieldContainer: {
    paddingHorizontal: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    borderBottomWidth: 0.5,
  },
  radioFieldContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    marginBottom: 0,
  },
  radioFieldText: {
    fontWeight: 'normal',
  },
  optionContainer: {
    marginBottom: 25,
  },
  multipleOptionContainer: {
    marginBottom: 25,
  },
  dropdownField: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  dropdownSelectedList: {
    marginLeft: 10,
    marginRight: 0,
  },
  formNavigationButton: {
    // backgroundColor:'red',
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0,
  },
  formNavigationIcon: {
    paddingTop: 9,
    paddingBottom: 10,
  },
  formNavigationTitle: {
    paddingTop: 9,
    paddingBottom: 10,
    color: 'grey',
    fontWeight: 'normal',
    fontSize: 14,
    marginRight: -10,
    marginLeft: -10,
  },
});