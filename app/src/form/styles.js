import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  fieldLabel: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  inputFieldContainer: {
    borderColor: 'grey',
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    borderBottomWidth: 0.5,
  },
  radioFieldContainer: {
    backgroundColor: 'transparent',
  },
  radioFieldText: {
    fontWeight: 'normal',
  },
  dropdownField: {
    marginLeft: 10,
    marginRight: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  dropdownSelectedList: {
    marginLeft: 10,
    marginRight: 0,
  },
  formNavigationButton: {
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
  },
  formNavigationIcon: {
    paddingTop: 9,
  },
  formNavigationTitle: {
    paddingTop: 9,
    color: 'grey',
    fontWeight: 'normal',
    fontSize: 14,
    marginRight: -10,
    marginLeft: -10,
  },
});
